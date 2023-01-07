const express = require('express');
const router = express.Router();
const AuthControl = require('../controller/auth.controller');
const { rateLimiter } = require('../controller/rateLimiter');

router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.route('/login').post(rateLimiter(60, 10), AuthControl.login)
router.route('/signup').post(AuthControl.signup)

module.exports = router;