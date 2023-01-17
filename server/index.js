require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io');
const app = express();
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');
const httpServer = require('http').createServer(app);
const { corsConfig } = require('./session');
const {
  authorizeUser,
  addFriend,
  initializeUser,
  dm,
  channelMsgs,
  onDisconnect
} = require('./controller/socketController');
const auth = require('./routes/auth.routes');
const connectDB = require('./connectDB');

const io = new Server(httpServer, { cors: corsConfig });
// middleware needs to be before routes
// parse form data
// app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
// app.use(sessionMiddleware);
app.use('/api/auth', auth);
// socket middleware
// io.use(wrap(sessionMiddleware));
io.use(authorizeUser)

io.on('connection', async (socket) => {
  console.log('connection')
  initializeUser(socket);
  socket.on('dm', message => dm(socket, message))
  socket.on('channel_msgs', (userID, cb) => channelMsgs(socket, userID, cb))
  socket.on("add_friend", (name, cb) => addFriend(socket, name, cb))

  /*socket.on('typing', ({ toggleState, to }) => {
    io.to(to).emit('typingResp', {toggleState, to})
    // socket.broadcast.emit('typingResp', toggleState);
  })*/
  socket.on('logoff', () => onDisconnect(socket))
  socket.on('disconnect', () => onDisconnect(socket));
})

io.on('connection_error', (err) => {
  console.log('err obj: ', err.req);
  console.log('err code: ', err.code);
  console.log('err msg: ', err.message);
  console.log('err context: ', err.context)
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