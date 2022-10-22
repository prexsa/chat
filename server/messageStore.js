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

module.exports = { InMemoryMessageStore };