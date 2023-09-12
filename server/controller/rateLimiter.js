const { redisClient } = require("../redis");

module.exports.rateLimiter =
  (secondsLimit, limitAmount) => async (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    // console.log('ip: ', ip);
    const [resp] = await redisClient
      .multi()
      .incr(ip)
      .expire(ip, secondsLimit)
      .exec();
    // console.log('resp: ', resp)
    if (resp[1] > limitAmount)
      res.json({
        loggedIn: false,
        status: "Slow down!! Try again in a minute",
      });
    else next();
  };
