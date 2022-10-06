require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { addUser, getUser, deleteUser, getAllUsers } = require('./users')

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

const PORT = process.env.PORT || 9000;

io.on('connection', (socket) => {
  socket.on('login', name => {
    console.log('name :', name)
    const { user, error } = addUser(socket.id, name)
    io.emit('login', user)
  });

  socket.on('chat', msg => {
    io.emit('chat', msg)
  });

  socket.on('users', () => {
    const users = getAllUsers();
    // console.log('users: ', users)
    io.emit('users', users)
  });

  socket.on('remove', (id) => {
    deleteUser(id);
    io.emit('remove', )
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  });
})

httpServer.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));