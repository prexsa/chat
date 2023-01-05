class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.session = new Map();
  }
  findSession(id) {
    return this.session.get(id);
  }
  saveSession(id, session) {
    this.session.set(id, session)
  }
  async findAllSessions() {
    return [...this.session.values()];
  }
  async getAll() {
    return this.session;
  }
  async clearAll() {
    return this.session.clear();
  }
}

const SESSION_TTL = 24 * 60 * 60;
const mapSession = ([userID, username, connected]) => {
  userID ? { userID, username, connected: connected === "true" } : undefined;
}

class RedisSessionStore extends SessionStore {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }
  findSession(id) {
    return this.redisClient
      .hmget(`session:${id}`, "userID", "username", "connected")
      .then(mapSession)
  }
  saveSession(id, { userID, username, connected }) {
    this.redisClient
      .multi()
      .hset(`session:${id}`, "userID", userID, "username", username, "connected", connected)
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }
  async findAllSessions() {
    // first, we fetch all the keys with the SCAN command
    const keys = new Set();
    let nextIndex = 0;
    do {
      const [nextIndexAsStr, results] = await this.redisClient.scan(
        nextIndex, "MATCH", "session:*", "COUNT", "100"
      );
      nextIndex = parseInt(nextIndexAsStr, 10);
      results.forEach((s) => keys.add(s));
    } while(nextIndex !== 0);

    // and then we retrieve the session details with multiple HMGET commands
    const commands = [];
    keys.forEach((key) => {
      commands.push(["hmget", key, "userID", "username", "connected"]);
    });
    return this.redisClient
      .multi(commands)
      .exec()
      .then((results) => {
        return results
          .map(([err, session]) => (err ? undefined : mapSession(session)))
          .filter((v) => !!v)
      })
  }
  async getAll() {
    return this.redisClient.hgetall();
  }
}

module.exports = {
  InMemorySessionStore,
  RedisSessionStore
}