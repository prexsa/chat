const Redis = require('ioredis');
const redisURL = process.env.REDIS_URL;
const redisClient = new Redis(redisURL);
// https://redis.com/blog/get-redis-cli-without-installing-redis-server/
// const { InMemoryMessageStore, RedisMessageStore } = require('./messageStore');
// const messageStore = new InMemoryMessageStore(redisClient);

// const { InMemorySessionStore, RedisSessionStore } = require('./sessionStore');
// const sessionStore = new InMemorySessionStore(redisClient);

module.exports = { redisClient };