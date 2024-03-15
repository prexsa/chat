const nodemailer = require('nodemailer');

const { NODEMAILER_AUTH_EMAIL, NODEMAILER_AUTH_PASSWORD } = require('../env');

const CLIENT_URL = process.env.CLIENT_URL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: NODEMAILER_AUTH_EMAIL,
    pass: NODEMAILER_AUTH_PASSWORD,
  },
});

transporter.verify((err) => {
  if (err) {
    console.log('nodemailer error: ', err);
  } else {
    console.log('nodemailer ready');
  }
});

const expireTimeThirtyMins = () => {
  const thirtyMinsInMilliseconds = 30 * 60 * 1000;
  const currentTime = new Date().getTime();
  const addThirtyMins = currentTime + thirtyMinsInMilliseconds;
  const time = new Date(addThirtyMins).getTime();
  return time;
};

module.exports.sendPasswordResetEmail = (values) => {
  const { userId, email } = values;
  const name = 'Prexsa';
  const expireTime = expireTimeThirtyMins();
  const mail = {
    from: 'Task Manager',
    to: 'preksamam@gmail.com',
    subject: 'Password reset link for Chats',
    html:
      `<p>Here is the link to reset your password for Chat</p>` +
      '<br />' +
      `<a href='${CLIENT_URL}/pw-reset?userId=${userID}&expireTime=${expireTime}'>Reset my password</a>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mail, (err) => {
      if (err) {
        console.log('transporter err: ', err);
        resolve(false);
      } else resolve(true);
    });
  });
};

module.exports.sendEmailRequest = (values) => {
  const { userId, email, fname, lname } = values;
  console.log('values: ', values);
  const mail = {
    from: 'Chats',
    to: email,
    subject: `Connect with ${fname} ${lname} on Chats`,
    html:
      `<p>${fname} ${lname} wants to connect with you on Chats</p>` +
      `<p>Click the link below, to go to Chats</p>` +
      '<br />' +
      `<a href='${CLIENT_URL}/register?userId=${userId}'>Go to Chats</a>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mail, (err) => {
      if (err) {
        console.log('transporter err: ', err);
        resolve(false);
      } else resolve(true);
    });
  });
};

module.exports.sendMail = (payload) => {
  return transporter.sendMail(payload, (err) => {
    if (err) {
      console.log('transporter err: ', err);
      return;
    }
    return 'Message Sent';
  });
};
