const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  channelId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  attachments: [
    {
      type: String,
      url: String,
      filename: String,
      sizeBytes: Integer,
    },
  ],
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
