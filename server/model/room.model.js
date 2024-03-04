const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isGroup: {
    type: Boolean,
  },
  messages: {
    type: [
      {
        userId: String,
        message: String,
        date: String,
        imageUrl: String,
        hasImage: Boolean,
        name: String,
        fileId: String,
      },
    ],
  },
  roomId: {
    type: String,
    required: true,
  },
  mates: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
  },
  uploadFiles: {
    type: Array,
  },
});

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
