const User = require("../model/auth.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendMail } = require("./nodemailer.controller");
const JWT_SECRET = process.env.JWT_SECRET;
const { jwtSign, jwtVerify, getJwt } = require("./jwt.controller");

exports.verifyToken = (req, res) => {
  const token = getJwt(req);
  // console.log('token; ', token)
  // console.log('token: ', token)
  jwtVerify(token, JWT_SECRET)
    .then((decoded) => {
      // console.log('decoded: ', decoded)
      res.status(200).send({
        loggedIn: true,
        username: decoded.username,
        userId: decoded.userId,
      });
    })
    .catch((err) => {
      console.log("check token error: ", err);
      if (err) res.status(401).send({ loggedIn: false, status: err });
    });
};

exports.login = (req, res) => {
  // console.log('app: body: ', req.body)
  const { username, password = "testing", keyType } = req.body;
  User.findOne({ [keyType]: username })
    .then((user) => {
      if (!user)
        return res.status(200).send({
          isSuccessful: false,
          message: "User not found",
          errorType: "user",
        });
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(200).send({
          accessToken: null,
          message: "Invalid password!",
          isSuccessful: false,
          errorType: "password",
        });
      }
      const payload = {
        id: user._id,
        username: user?.username,
        userId: user.userId,
      };
      // console.log('payload: ', payload)
      jwtSign(payload, JWT_SECRET, { expiresIn: "7d" }).then((token) => {
        res.status(200).send({
          username: user?.username,
          accessToken: token,
          userId: user.userId,
          isSuccessful: true,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ status: err });
    });
};

exports.signup = async (req, res) => {
  // console.log('signup ', req.body)
  const { fname, lname, email, password } = req.body;
  // console.log('req.body: ', req.body)
  const record = await User.findOne({ email: email });
  // console.log('record: ', record)
  if (record === null) {
    const user = new User({
      // username: username,
      firstname: fname,
      lastname: lname,
      email: email,
      password: bcrypt.hashSync(req.body.password, 8),
      userId: crypto.randomUUID(),
    });
    user
      .save()
      .then(() => {
        const payload = {
          id: user._id,
          // username: user.username,
          userId: user.userId,
        };
        jwtSign(payload, JWT_SECRET, { expiresIn: "7d" }).then((token) => {
          res.send({
            status: "User was registered successfully!",
            // username: username,
            accessToken: token,
            userId: user.userId,
            isSuccessful: true,
          });
        });
      })
      .catch((err) => {
        console.log("signup error: ", err);
        res.status(500).send({ status: err, isSuccessful: false });
      });
  } else {
    res.status(200).send({
      isSuccessful: false,
      message: "This is email is already taken.",
      errorType: "email",
    });
    return;
  }
};

exports.addUsername = async (req, res) => {
  const { userId, username } = req.body;
  // console.log('req.body: ', req.body)
  const isUsernameFound = await User.findOne({ username: username });
  // if username is null, username is available
  if (isUsernameFound === null) {
    const user = await User.findOneAndUpdate(
      { userId: userId },
      { $set: { username: username } },
    );
    const payload = {
      id: user._id,
      username: username,
      userId: userId,
    };
    // console.log('payload: ', payload)
    jwtSign(payload, JWT_SECRET, { expiresIn: "7d" }).then((token) => {
      res.status(200).send({
        username: username,
        accessToken: token,
        userId: userId,
        isSuccessful: true,
      });
    });
  } else {
    res.status(200).send({ isSuccessful: false, message: "Username is taken" });
  }
};

exports.getUserProfile = async (req, res) => {
  const { userId } = req.body;
  // console.log('userId: ', userId)
  const user = await User.findOne(
    { userId: userId },
    { username: 1, password: 1, firstname: 1, lastname: 1, email: 1 },
  );
  const profile = {
    username: user?.username,
    password: user?.password,
    firstname: user?.firstname,
    lastname: user?.lastname,
    email: user?.email,
  };
  // console.log('profile: ', profile)
  res.status(200).send({ ...profile });
};

exports.updateUserProfile = async (req, res) => {
  const { userId } = req.body;
  // console.log('updateUserProfile: ', )
  const user = await User.findOneAndUpdate(
    { userId: userId },
    { $set: { ...req.body } },
  );
  // console.log('user: ', user)
  // if user changes their username, re-issue a new token because the username is part of the JWT payload
  if (Object.keys(req.body).includes("username")) {
    // create a new payload
    const payload = {
      id: user._id,
      username: req.body.username,
      userId: userId,
    };
    // console.log('payload: ', payload)
    jwtSign(payload, JWT_SECRET, { expiresIn: "7d" }).then((token) => {
      res.status(200).send({
        username: req.body.username,
        accessToken: token,
        userId: userId,
        isSuccessful: true,
      });
    });
    return;
  }
  res.status(200).send({ isSuccessful: true });
};

exports.sendResetLink = async (req, res) => {
  const { keyType, value } = req.body;
  console.log("req.body: ", req.body);
  // findOne returns an obj
  const hasRecord = await User.findOne({ [keyType]: value });
  console.log("hasRecord: ", hasRecord);
  if (hasRecord === null) {
    res.status(200).send({
      isSuccessful: false,
      message: "User does not exist in our system.",
    });
    return;
  }
  const { userId, email } = hasRecord;
  const payload = { userId, email };
  sendMail(payload);
  res
    .status(200)
    .send({
      isSuccessful: true,
      message: "An email has been sent to reset your password.",
    });
};

exports.passwordReset = async (req, res) => {
  const { userId, password } = req.body;
  // console.log(req.body)
  if (userId === null) return;
  const result = await User.findOneAndUpdate(
    { userId: userId },
    { $set: { password: bcrypt.hashSync(password, 8) } },
  );
  // console.log('result: ;', result)
  res.status(200).send({ isSuccessful: true });
};
