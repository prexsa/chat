const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true
  }
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;