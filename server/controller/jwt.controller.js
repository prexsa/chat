const jwt = require('jsonwebtoken');

const jwtSign = (payload, secret, options) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if(err) reject(err);
      resolve(token);
    });
  });
}

const jwtVerify = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if(err) reject(err);
      resolve(decoded);
    });
  });
}

const getJwt = req => req.headers['authorization'].split(' ')[1];

module.exports = {
  jwtSign,
  jwtVerify,
  getJwt
}
