const JWT_SECRET = process.env.JWT_SECRET;

const NODEMAILER_AUTH_EMAIL = process.env.NODEMAILER_AUTH_EMAIL;
const NODEMAILER_AUTH_PASSWORD = process.env.NODEMAILER_AUTH_PASSWORD;

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;

module.exports = {
  JWT_SECRET,
  NODEMAILER_AUTH_EMAIL,
  NODEMAILER_AUTH_PASSWORD,
  CLOUDINARY_NAME,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET,
};