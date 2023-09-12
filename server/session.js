/*
require("dotenv").config();
const { redisClient } = require('./redis');
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
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

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
*/
const corsConfig = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

module.exports = { corsConfig };

/*
  express-session will not share session obj with socket.io
  session obj is visible with req.session
  For the time being, send userID in response obj until a solution is found
*/
