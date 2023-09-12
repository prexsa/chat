const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_AUTH_EMAIL,
    pass: process.env.NODEMAILER_AUTH_PASSWORD,
  },
});

transporter.verify((err) => {
  if (err) {
    console.log("nodemailer error: ", err);
  } else {
    console.log("nodemailer ready");
  }
});

const expireTimeThirtyMins = () => {
  const thirtyMinsInMilliseconds = 30 * 60 * 1000;
  const currentTime = new Date().getTime();
  const addThirtyMins = currentTime + thirtyMinsInMilliseconds;
  const time = new Date(addThirtyMins).getTime();
  return time;
};

module.exports.sendMail = (values) => {
  const { userId, email } = values;
  const name = "Prexsa";
  const expireTime = expireTimeThirtyMins();
  const mail = {
    from: "Task Manager",
    to: "preksamam@gmail.com",
    subject: "Password reset link for Chats",
    html:
      `<p>Here is the link to reset your password for Chat</p>` +
      "<br />" +
      `<a href='http://localhost:3000/pw-reset?userId=${userID}&expireTime=${expireTime}'>Reset my password</a>`,
  };

  return transporter.sendMail(mail, (err) => {
    if (err) {
      console.log("transporter err: ", err);
      return;
    }
    return "Message Sent";
  });
};
