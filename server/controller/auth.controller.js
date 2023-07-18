const User = require('../model/auth.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendMail } = require('./nodemailer.controller')
const JWT_SECRET = process.env.JWT_SECRET;
const { jwtSign, jwtVerify , getJwt } = require('./jwt.controller');

exports.verifyToken = (req, res) => {
  const token = getJwt(req);
  // console.log('token; ', token)
  // console.log('token: ', token)
  jwtVerify(token, JWT_SECRET).then(decoded => {
    // console.log('decoded: ', decoded)
    res.status(200).send({
      loggedIn: true,
      username: decoded.username,
      userId: decoded.userId
    })
  }).catch(err => {
    console.log('check token error: ', err)
    if(err) res.status(401).send({ loggedIn: false, status: err })
  })
}

exports.login = (req, res) => {
  // console.log('app: body: ', req.body)
  const { inputValue, password = "testing", keyType } = req.body;
  User.findOne({ [keyType]: inputValue }).then((user) => {
    if(!user) return res.status(200).send({ loggedIn: false, status: "User not found" });
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if(!passwordIsValid) {
      return res.status(200).send({
        accessToken: null,
        status: 'Invalid password!',
        loggedIn: false,
      });
    }
    const payload = {
      id: user._id,
      username: user?.username,
      userId: user.userId
    }
     console.log('payload: ', payload)
    jwtSign(payload, JWT_SECRET, { expiresIn: '7d' }).then(token => {
      res.status(200).send({
        username: user?.username,
        accessToken: token,
        userId: user.userId,
        loggedIn: true
      })
    })
  }).catch(err => {
    res.status(500).send({ status: err });
  })
}

exports.signup = async (req, res) => {
  // console.log('signup ', req.body)
  const { fname, lname, email, password } = req.body;
  // console.log('req.body: ', req.body)
  const record = await User.findOne({ email: email })
  // console.log('record: ', record)
  if(record === null) {
    const user = new User({
      // username: username,
      firstname: fname,
      lastname: lname,
      email: email,
      password: bcrypt.hashSync(req.body.password, 8),
      userId: crypto.randomUUID()
    });
    user.save().then(() => {
      const payload = {
        id: user._id,
        // username: user.username,
        userId: user.userId
      }
      jwtSign(payload, JWT_SECRET, { expiresIn: "7d"}).then(token => {
        res.send({
          status: 'User was registered successfully!',
          // username: username,
          accessToken: token,
          userId: user.userId,
          loggedIn: true,
        })
      })
    }).catch((err) => {
      console.log('signup error: ', err)
      res.status(500).send({ status: err, loggedIn: false });
    })
  } else {
    res.status(200).send({ loggedIn: false, status: "That email is in use"})
    return;
  }
}

exports.addUsername = async (req, res) => {
  const { userId, username } = req.body;
  console.log('req.body: ', req.body)
  const isUsernameFound = await User.findOne({ username: username })
  // if username is null, username is available
  if(isUsernameFound === null) {
    const user = await User.findOneAndUpdate({ userId: userId }, { $set: { username: username }})
    const payload = {
      id: user._id,
      username: username,
      userId: userId
    }
    // console.log('payload: ', payload)
    jwtSign(payload, JWT_SECRET, { expiresIn: '7d' }).then(token => {
      res.status(200).send({
        username: username,
        accessToken: token,
        userId: userId,
        loggedIn: true
      })
    })
  } else {
    res.status(200).send({ loggedIn: false, status: 'Username is taken'})
  }
}


exports.sendResetLink = async (req, res) => {
  const { keyType, value } = req.body;
  console.log('req.body: ', req.body)
  // findOne returns an obj
  const recordFound = await User.findOne({ [keyType]: value })
  console.log('recordFound: ', recordFound)
  const { userId, email } = recordFound
  const payload = { userId, email }
  sendMail(payload)
  const status = recordFound !== null ? 'success' : 'failed'
  res.status(200).send({ status })
}

exports.passwordReset = async (req, res) => {
  const { userId, password } = req.body
  const result = await User.findOneAndUpdate({ userId: userId }, { $set: { password: bcrypt.hashSync(password, 8), }});
  // console.log('result: ;', result)
  res.status(200).send({ status: 'success' })
}