const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isGroup: {
    type: Boolean,
    required: true,
  },
  messages: {
    type: [
      {
        userId: String,
        message: String,
        date: String,
      },
    ],
  },
  roomId: {
    type: String,
    required: true,
  },
  mates: {
    type: [
      {
        userId: String,
        username: String,
      },
    ],
    required: true,
  },
});

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
