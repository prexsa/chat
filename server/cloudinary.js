const cloudinary = require('cloudinary').v2;

const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = require('./env');

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

exports.cloudinary = cloudinary;
