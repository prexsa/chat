const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String, // "direct" | "group"
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  roomId: {
    type: String,
    required: true,
  },
  memberIds: {
    type: [
      {
        userId: String,
      },
    ],
    required: true,
  },
  lastMessage: {
    type: {
      text: String,
      senderId: String,
      sentAt: String,
    },
  },
});

const Channel = mongoose.model('Channel', ChannelSchema);
module.exports = Channel;
