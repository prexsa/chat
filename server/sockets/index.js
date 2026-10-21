const socketAuth = require('../middlewares/socketAuth');
const registerChatHandlers = require('./chatHandler');

const {
  authorizeUser,
  sendRequestByName,
  sendRequestByEmail,
  createGroupName,
  initializeUser,
  dm,
  // removeRoomId,
  clearUnreadCount,
  handleRoomSelected,
  uploadFile,
  deleteFile,
  updateGroupName,
  getGroupAdminInfo,
  getGroupMembers,
  addToGroup,
  leaveChatRoom,
  searchUsersDb,
  acceptRequest,
  denyRequest,
  // removeUserFromGroup,
  leaveGroup,
  deleteGroup,
  // disconnectUserRelationship,
  // getRoomMessages,
  getUserConnections,
  onDisconnect,
} = require('../controller/socketController');

const User = require('../model/user.model');

const initSockets = (io) => {
  // Enforce JWT check on every single handshake connection
  io.use(socketAuth);

  io.on('connection', async (socket) => {
    // console.log('socket connect', socket.user);
    const { userId } = socket.user;

    initializeUser(socket);

    socket.on('get_channels', async () => {
      const user = await User.find({ userId: socket.user.userId });
      // console.log('user: ', user);
      const { rooms, pendingRequest } = user[0];

      // Emit back
      // socket.emit('channel_list', { data: "Here's some data for you" });
    });

    // Register feature modules
    registerChatHandlers(io, socket);

    // You can easily scale by registering more handlers here:
    // registerNotificationHandlers(io, socket);
  });
};

module.exports = initSockets;

/*

io.use(authorizeUser);

io.on('connection', async (socket) => {
  // console.log('connection')
  initializeUser(socket);
  socket.on('dm', (message) => dm(socket, message));
  socket.on('send_request_by_name', ({ email, userId, username }, cb) =>
    sendRequestByName(socket, userId, cb),
  );

  socket.on('send_request_by_email', ({ email, senderDetails }, cb) =>
    sendRequestByEmail(socket, email, senderDetails, cb),
  );

  socket.on('accept_request', (requesterId) =>
    acceptRequest(socket, requesterId),
  );
  socket.on('deny_request', (requesterId, cb) =>
    denyRequest(socket, requesterId, cb),
  );
  socket.on('clear_unread_count', ({ roomId }) =>
    clearUnreadCount(socket, roomId),
  );
  socket.on('handle_room_selected', ({ channelId, isGroup }) =>
    handleRoomSelected(socket, channelId, isGroup),
  );
  socket.on('upload_file', (fileObj, cb) => uploadFile(socket, fileObj, cb));
  socket.on('delete_file', ({ fileId, roomId }, cb) =>
    deleteFile(socket, fileId, roomId, cb),
  );
  socket.on('create_group_name', (data, cb) =>
    createGroupName(socket, data, cb),
  );
  socket.on('update_group_name', ({ roomId, name }, cb) =>
    updateGroupName(socket, roomId, name, cb),
  );
  socket.on('get_group_admin_info', ({ ownerId }, cb) =>
    getGroupAdminInfo(ownerId, cb),
  );
  socket.on('get_group_members', ({ roomId }, cb) =>
    getGroupMembers(roomId, cb),
  );
  socket.on('search_users_db', (name, cb) => searchUsersDb(socket, name, cb));

  // socket.on('room_msgs', (roomId, cb) => getRoomMessages(socket, roomId, cb))
  // socket.on('remove_channel', ({ user, channel, isGroup }) => disconnectUserRelationship(socket, user, channel, isGroup))
  // socket.on('remove_member_from_group', ({ roomId, userId }, cb) => removeUserFromGroup(socket, roomId, userId, cb))

  socket.on('leave_chat', ({ hostUserId, userIdToRemove, roomId }, cb) =>
    leaveChatRoom(socket, hostUserId, userIdToRemove, roomId, cb),
  );
  socket.on('leave_group', ({ userId, roomId }, cb) =>
    leaveGroup(socket, roomId, userId, cb),
  );
  socket.on('delete_group', ({ roomId }, cb) =>
    deleteGroup(socket, roomId, cb),
  );

  socket.on('add_to_group', ({ roomId, userId }, cb) =>
    addToGroup(socket, roomId, userId, cb),
  );
  socket.on('feedback_typing', ({ userId, showFeedback }) => {
    console.log('userId: ', userId);
    socket.to(userId).emit('typing_feedback', showFeedback);
    // io.to(to).emit('typingResp', {toggleState, to})
    // socket.broadcast.emit('typingResp', toggleState);
  });
  socket.on('test', (cb) => getUserConnections(socket, cb));
  socket.on('logoff', () => onDisconnect(socket));
  socket.on('disconnect', () => onDisconnect(socket));
});

io.on('connection_error', (err) => {
  console.log('err obj: ', err.req);
  console.log('err code: ', err.code);
  console.log('err msg: ', err.message);
  console.log('err context: ', err.context);
});
*/
