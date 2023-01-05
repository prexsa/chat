const Redis = require('ioredis');
const crypto = require("crypto");
const redisURL = process.env.REDIS_URL;
const redisClient = new Redis(redisURL);
// https://redis.com/blog/get-redis-cli-without-installing-redis-server/
const { InMemoryMessageStore } = require('./messageStore');
const messageStore = new InMemoryMessageStore(redisClient);

const { InMemorySessionStore} = require('./sessionStore');
const sessionStore = new InMemorySessionStore(redisClient);

const randomId = () => crypto.randomBytes(8).toString("hex");

const {
  addUser,
  getUser,
  deleteUser,
  getAllUsers,
  userNameExist,
  getConnectedUsers,
  clearUsers,
  setUserDisconnect
} = require('./users')

module.exports = function(io) {
  io.use(async (socket, next) => {
    // console.log('socket: ', socket)
    // console.log('handshake: ', socket.handshake)
    const sessionID = socket.handshake.auth.sessionID;
    const accessToken = socket.handshake.auth.accessToken;
    // console.log('sessionID: ', socket.handshake.auth.sessionID)
    // console.log('accessToken: ', accessToken)
    if(sessionID) {
      // find existing session
      const session = await sessionStore.findSession(sessionID);
      console.log('session: ', session)
      if(session) {
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        return next();
      }
    }
    const username = socket.handshake.auth.username;
    // console.log('username: ', username)
    if(!username) {
      return next(new Error("invalid username"))
    }
    // create new session
    socket.sessionID = randomId();
    socket.userID = randomId();
    // socket.userID = accessToken;
    socket.username = username;
    next();
  });

  io.on('connection', async (socket) => {
    // console.log('main socket: ', socket)
    // persist session
    sessionStore.saveSession(socket.sessionID, {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });

    console.log('Saved Sessions: ', sessionStore.getAll())
    // emit session details
    socket.emit("session", {
      sessionID: socket.sessionID,
      userID: socket.userID,
      // userID: socket.id,
      // username: socket.username
    });
    // join the "userID" room
    socket.join(socket.userID);

    // fetch existing users
    const users = [];
    const [messages, sessions] = await Promise.all([
      messageStore.findMsgForUser(socket.userID),
      sessionStore.findAllSessions(),
    ]);
    const messagesPerUser = new Map();
    messages.forEach((message) => {
      const { from, to } = message;
      const otherUser = socket.userID === from ? to : from;
      if(messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
      } else {
        messagesPerUser.set(otherUser, [message]);
      }
    });

    sessions.forEach((session) => {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected,
        messages: messagesPerUser.get(session.userID) || []
      })
    })
  // console.log('users: ', users)
    socket.emit("users", users);
    // notify existing users
    socket.broadcast.emit('user connected', {
      userID: socket.userID,
      username: socket.username,
      connected: true,
      messages: [],
      // socketID: socket.id
    })

    socket.on("private msg", ({ to, msg, fromName }) => {
      console.log('to: ', to, 'msg: ', msg )
      const message = {
        msg,
        from: socket.userID,
        to,
        // fromName
      }
      console.log('message: ', message)
      // socket.to(to).emit("private msg", message);
      socket.to(to).to(socket.userID).emit("private msg", message);
      messageStore.saveMsg(message);
      MessageControl.saveMessageToDB(message)
    });

    socket.on('typing', ({ toggleState, to }) => {
      io.to(to).emit('typingResp', {toggleState, to})
      // socket.broadcast.emit('typingResp', toggleState);
    })

    socket.on('disconnect', async () => {
      // console.log('user disconnected: ', socket.id)
      const matchingSockets = await io.in(socket.userID).allSockets();
      // console.log('matchingSockets: ', matchingSockets)
      const isDisconnected = matchingSockets.size === 0;
      if(isDisconnected) {
        // notify other users
        socket.broadcast.emit('user disconnected', socket.userID);
        // update the connection status of the session
        sessionStore.saveSession(socket.sessionID, {
          userID: socket.userID,
          username: socket.username,
          connected: false,
        })
      }
    });
    console.log('all users: ', getAllUsers())
  })

  io.on('connection_error', (err) => {
    console.log('err obj: ', err.req);
    console.log('err code: ', err.code);
    console.log('err msg: ', err.message);
    console.log('err context: ', err.context)
  })

}