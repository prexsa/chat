const {
  redisClient,
  messageStore,
  sessionStore } = require('./redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,
  credentials: true,
  name: "sid",
  store: new RedisStore({ client: redisClient }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production" ? "true" : "auto",
    httpOnly: true,
    expires: 1000 * 60 * 60 * 24 * 7,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
});


const wrap = expMiddleware => (socket, next) => expMiddleware(socket.request, {}, next);


module.exports = {
  sessionMiddleware,
  wrap
};