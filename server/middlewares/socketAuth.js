const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../env');

// Handles the token checks for each request

const socketAuth = (socket, next) => {
  // Extract token from auth object
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers?.authorization?.split(' ')[1];

  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid or expired token'));
    }

    // Attach decoded user information to the socket instance for route handlers
    socket.user = decoded;
    next();
  });
};

module.exports = socketAuth;
