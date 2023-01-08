require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io');
const app = express();
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');
const httpServer = require('http').createServer(app);
const { sessionMiddleware, wrap, corsConfig } = require('./session');
const {
  authorizeUser,
  addFriend,
  initializeUser,
  onDisconnect
} = require('./controller/socketController');
const auth = require('./routes/auth.routes');
const connectDB = require('./connectDB');

const { redisClient, messageStore, sessionStore } = require('./redis');

const io = new Server(httpServer, { cors: corsConfig });
// middleware needs to be before routes
// parse form data
// app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(sessionMiddleware);
app.use('/api/auth', auth);
// const randomId = () => crypto.randomBytes(8).toString("hex");
// socket middleware
io.use(wrap(sessionMiddleware));
io.use(authorizeUser)
/*io.use(async (socket, next) => {
  // console.log('socket: ', socket)
  // console.log('handshake: ', socket.handshake)
  const sessionID = socket.handshake.auth.sessionID;
  const accessToken = socket.handshake.auth.accessToken;
  // console.log('sessionID: ', socket.handshake.auth.sessionID)
  // console.log('accessToken: ', accessToken)
  if(sessionID) {
    // find existing session
    const session = await sessionStore.findSession(sessionID);
    // console.log('session: ', session)
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
  // socket.sessionID = randomId();
  // socket.userID = randomId();
  // socket.userID = accessToken;
  socket.username = username;
  next();
});*/

io.on('connection', async (socket) => {
  initializeUser(socket)
  // console.log('socket connection: ', socket.request.session);
  // console.log('main socket: ', socket)
  // persist session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // console.log('Saved Sessions: ', sessionStore.getAll())
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

  socket.on("add_friend", (name, cb) => addFriend(socket, name, cb))

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
    // MessageControl.saveMessageToDB(message)
  });

  socket.on('typing', ({ toggleState, to }) => {
    io.to(to).emit('typingResp', {toggleState, to})
    // socket.broadcast.emit('typingResp', toggleState);
  })

  socket.on('disconnect', () => onDisconnect(socket));
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

/*app.post('/api/redis', async(req, res) => {
  // await client.connect();
  redisClient.set('financial', 'freedom')
})*/

app.get('/api/redis-get', async(req, res) => {
  // await client.connect();
  const all = await sessionStore.getAll()
  console.log('all: ', all)
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