class MessageStore {
  saveMsg(msg) {};
  findMsgForUser(userID) {};
}

class InMemoryMessageStore extends MessageStore {
  constructor() {
    super();
    this.messages = [];
  }
  saveMsg(msg) {
    this.messages.push(msg);
  }
  findMsgForUser(userID) {
    return this.messages.filter(
      ({ from, to }) => from === userID || to === userID
    );
  }
  allMessages() {
    return this.messages;
  }
}

const CONVERSATION_TTL = 24 * 60 * 60;

class RedisMessageStore extends MessageStore {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }
  saveMsg(msg) {
    const value = JSON.stringify(msg);
    this.redisClient
      .multi()
      .rpush(`messages:${msg.from}`, value)
      .rpush(`messages:${msg.to}`, value)
      .expire(`messages:${msg.from}`, CONVERSATION_TTL)
      .expire(`messages:${msg.from}`, CONVERSATION_TTL)
      .exec();
  }
  findMsgForUser(userID) {
    return this.redisClient
      .lrange(`messages:${userID}`, 0, -1)
      .then((results) => {
        return results.map((result) => JSON.parse(result));
      });
  }
}

module.exports = {
  InMemoryMessageStore, RedisMessageStore
};