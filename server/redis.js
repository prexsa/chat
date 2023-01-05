const Redis = require('ioredis');

// const redisClient = new Redis();

// connect to redis instance
/*const client = createClient({
  url: redisURL
})
client.on('error', (err) => console.log('Redis Client Error: ', err))
console.log('client: ', client)*/
const redisURL = process.env.REDIS_URL;
const redisClient = new Redis(redisURL);
// https://redis.com/blog/get-redis-cli-without-installing-redis-server/
const { InMemoryMessageStore } = require('./messageStore');
const messageStore = new InMemoryMessageStore(redisClient);

const { InMemorySessionStore } = require('./sessionStore');
const sessionStore = new InMemorySessionStore(redisClient);


module.exports = {
  redisClient,
  messageStore,
  sessionStore
};