module.exports = (io, socket) => {
  // socket.user is available here thanks to the authentication middleware
  console.log(`User ${socket.user.fname} connected successfully.`);

  socket.on('message:send', (data) => {
    const payload = {
      sender: socket.user.username,
      message: data.message,
      timestamp: new Date(),
    };

    // Broadcast to everyone else
    socket.broadcast.emit('message:received', payload);
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.user.fname} disconnected.`);
  });
};
