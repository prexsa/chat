require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
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
const { InMemoryMessageStore } = require('./messageStore');

const messageStore = new InMemoryMessageStore();
console.log('messageStore: ', messageStore.messages)

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  }
});

// middleware needs to be before routes
// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());
app.use(cors());

// socket middleware
/*io.use((socket, next) => {
  // console.log('socket: ', socket)
  const username = socket.handshake.auth.username;
  console.log('socket handshake: ', username)
  if(!username) {
    return next(new Error("invalid username"))
  }
  socket.username = username;
  next();
});*/

io.on('connection', (socket) => {
  // console.log('main socket: ', socket)
  const mainSocket = socket;
  const mainSocketID = socket.id;
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  // console.log('socketID ', socket.id)
  // console.log('socketClientID ', socket.client.id)
  // console.log('users: ', users)
  // socket.emit('users', users);
  // notifying existing users
  /*socket.broadcast.emit('user connected', {
    userID: socket.id,
    username: socket.username,
  })*/

  console.log('mainSocketID: ', mainSocketID)

  socket.on('login', (name) => {
    console.log('name :', name)
    const { user, error } = addUser(socket.id, name)
    // io.emit('user connected', user)
    // socket.broadcast.emit('user connected', user)
    // console.log('mainSocketID: ', mainSocketID)
    // console.log('socketID: ', socket.id)
    socket.emit('sender', user)
    socket.broadcast.emit('user connected', user)
  });

  socket.on('chat', (msg) => {
    // console.log('chat: ', msg)
    io.emit('chat', msg)
  });

  socket.on("private msg", ({ to, msg }) => {
    console.log('to: ', to, 'msg: ', msg )
    const message = {
      msg,
      from: socket.id,
      to,
    }
    console.log('message: ', message)
    // socket.to(to).emit("private msg", message);
    io.to(to).to(socket.id).emit("private msg", message);
    messageStore.saveMsg(message);
  });

  socket.on('typing', ({ toggleState }) => {
    socket.broadcast.emit('typingResp', toggleState);
  })

  socket.on('connected users', (username) => {
    // console.log('username: ', username)
    const users = getConnectedUsers(username);
    // console.log('users: ', users)
    // io.emit('connected users', users)
    socket.emit('connected users', users)
  });

  socket.on('remove', (username) => {
    // deleteUser(username);
    const { users } = setUserDisconnect(username)
    io.emit('connected users', users)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id)
  });
  console.log('all users: ', getAllUsers())
})

app.post('/api/check-username', (req, res) => {
  console.log('req.body: ', req.body)
  const { username } = req.body;
  const exist = userNameExist(username);
  res.status(200).send({ exist })
})

app.get('/api/clear', (req, res) => {
  const { username } = req.body;
  const users = clearUsers();
  res.status(200).send({ users })
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

const PORT = process.env.PORT || 9000;

httpServer.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));