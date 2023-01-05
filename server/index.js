require('dotenv').config();
const express = require('express');
const axios = require('axios');
const helmet = require('helmet');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
// const expressSession = require('express-session');
// const Redis = require('ioredis');
// const RedisStore = require('connect-redis')(expressSession);
const crypto = require("crypto");
const {
  redisClient,
  messageStore,
  sessionStore } = require('./redis');
const { sessionMiddleware, wrap } = require('./session');
const { authorizeUser, addFriend } = require('./socketController');
const connectDB = require('./connectDB');
// const AuthControl = require('./auth.control');
const User = require('./auth/auth.model');
const MessageControl = require('./message/message.controller');

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

const corsConfig = {
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: corsConfig });

// middleware needs to be before routes
// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());
app.use(helmet());
app.use(cors(corsConfig));
// https://itnext.io/mastering-session-authentication-aa29096f6e22
app.use(sessionMiddleware);

app.use(function(req, res, next) {
  if(!req.session) {
    return next(new Error("Session Error"))
  }
  next()
})
// import routes
const auth = require('./auth/auth.routes');

app.use('/api/auth', auth);

// require('./socketIO')(io);

const randomId = () => crypto.randomBytes(8).toString("hex");

// socket middleware
io.use(wrap(sessionMiddleware));
io.use(authorizeUser)
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

  socket.on("add_friend", (friendName, cb) => addFriend(socket, friendName, cb))

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

app.post('/api/check-email', (req, res) => {

})

app.post('/api/check-username', (req, res) => {
  // console.log('req.body: ', req.body)
  const { username } = req.body;
  const exist = userNameExist(username);
  res.status(200).send({ exist })
})

app.get('/api/clear', async (req, res) => {
  /*const { username } = req.body;
  const users = clearUsers();*/
  const cleared = await sessionStore.clearAll();
  res.status(200).send({ cleared })
})

app.get('/api/get-users', (req, res) => {
  const { username } = req.body;
  const users = getAllUsers();
  res.status(200).send({ users })
})

app.post('/api/channel-messages', async (req, res) => {
  const { userID } = req.body;
  console.log('messageStore: ', messageStore)
  const messages = await messageStore.findMsgForUser(userID)
  res.status(200).send({ messages })
})

app.get('/api/messages', async (req, res) => {
  const { userID } = req.body;
  const messages = messageStore.allMessages
  res.status(200).send({ messages })
})

app.post('/api/redis', async(req, res) => {
  // await client.connect();
  redisClient.set('financial', 'freedom')
})

app.get('/api/redis-get', async(req, res) => {
  // await client.connect();
  const all = await sessionStore.getAll()
  console.log('all: ', all)
})

app.get('/api/mongdb-collection-clear', (req, res) => {
  MessageControl.clearMsgCollection();
})

const PORT = process.env.PORT || 9000;
const DATABASE_URI = process.env.MONGO_URI;

const start = async () => {
  try {
    const conn = await connectDB(DATABASE_URI);
    console.log('MongoDB connected: ', conn.connection.host);
    httpServer.listen(PORT,
      () => console.log(`Server listening on PORT ${PORT}`)
    );
  } catch (error) {
    console.log('Start Error: ', error)
  }
}

start();