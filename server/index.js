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
  createGroup,
  initializeUser,
  dm,
  // removeRoomId,
  clearUnreadCount,
  handleRoomSelected,
  uploadFile, 
  disconnectUserRelationship,
  // getRoomMessages,
  onDisconnect
} = require('./controller/socketController');
const auth = require('./routes/auth.routes');
const connectDB = require('./connectDB');

const io = new Server(httpServer, { 
  cors: corsConfig,
  maxHttpBufferSize: 1e8 // 100 MB 
});
// middleware needs to be before routes
// parse form data
// app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
// app.use(sessionMiddleware);
app.use('/api/auth', auth);
app.set("trust proxy", 1);
// socket middleware
// io.use(wrap(sessionMiddleware));
io.use(authorizeUser)

io.on('connection', async (socket) => {
  // console.log('connection')
  initializeUser(socket);
  socket.on('dm', message => dm(socket, message))
  // socket.on('room_msgs', (roomId, cb) => getRoomMessages(socket, roomId, cb))
  socket.on("add_friend", (name, cb) => addFriend(socket, name, cb))
  socket.on('create_group', (name, cb) => createGroup(socket, name, cb))
  socket.on('clear_unread_count', ({ roomId }) => clearUnreadCount(socket, roomId ))
  socket.on('handle_room_selected', ({ channelId }) => handleRoomSelected(socket, channelId))
  socket.on('remove_channel', ({ user, channel }) => disconnectUserRelationship(socket, user, channel))
  socket.on('upload_file', (fileObj, cb) => uploadFile(socket, fileObj, cb))
  socket.on('feedback_typing', ({userId, showFeedback}) => {
    console.log('userId: ', userId)
    socket.to(userId).emit('typing_feedback', showFeedback)
    /*io.to(to).emit('typingResp', {toggleState, to})
    // socket.broadcast.emit('typingResp', toggleState);*/
  })
  socket.on('logoff', () => onDisconnect(socket))
  socket.on('disconnect', () => onDisconnect(socket));
})

io.on('connection_error', (err) => {
  console.log('err obj: ', err.req);
  console.log('err code: ', err.code);
  console.log('err msg: ', err.message);
  console.log('err context: ', err.context)
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