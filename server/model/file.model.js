const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cloudinaryUrl: {
    type: String,
  },
  cloudinarySecureUrl: {
    type: String,
  },
  cloudinaryAssetId: {
    type: String,
  },
  name: {
    type: String,
  },
  userId: {
    type: String,
  },
});

const UploadFile = mongoose.model('UploadFile', FileSchema);
module.exports = UploadFile;
