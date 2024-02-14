const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  messages: {
    type: Array,
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
