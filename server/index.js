require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

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
  socket.on('user', msg => {
    console.log('msg: ', msg)
    io.emit('user', msg)
  });
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

httpServer.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));