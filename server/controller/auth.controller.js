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
      userID: decoded.userID
    })
  }).catch(err => {
    console.log('check token error: ', err)
    if(err) res.status(401).send({ loggedIn: false, status: err })
  })
}

exports.login = (req, res) => {
  // console.log('app: body: ', req.body)
  const { username, password = "testing" } = req.body;
  User.findOne({ username: username }).exec((err, user) => {
      if(err) {
        res.status(500).send({ status: err });
        return;
      }
      if(!user) return res.status(200).send({ loggedIn: false, status: "User not found" });
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if(!passwordIsValid) {
        return res.status(200).send({
          accessToken: null,
          status: 'Invalid password!',
          loggedIn: false,
        });
      }
      // console.log('user: ', user)
      const payload = {
        id: user._id,
        username: user.username,
        userID: user.userID
      }
      jwtSign(payload, JWT_SECRET, { expiresIn: '7d' }).then(token => {
        res.status(200).send({
          username: user.username,
          accessToken: token,
          userID: user.userID,
          loggedIn: true
        })
      })
    })
}

exports.signup = async (req, res) => {
  // console.log('signup ', req.body)
  const { username, password } = req.body;
  const record = await User.findOne({ username: username })
  // console.log('record: ', record)
  if(record === null) {
    const user = new User({
      username: username,
      password: bcrypt.hashSync(req.body.password, 8),
      userID: crypto.randomUUID()
    });
    user.save((err, user) =>{
      if(err) {
        res.status(500).send({ status: err, loggedIn: false });
        return;
      }

      const payload = {
        id: user._id,
        username: user.username,
        userID: user.userID
      }
      jwtSign(payload, JWT_SECRET, { expiresIn: "7d"}).then(token => {
        res.send({
          status: 'User was registered successfully!',
          username: username,
          accessToken: token,
          userID: user.userID,
          loggedIn: true,
        })
      })
    })
    return;
  } else {
    res.status(200).send({ loggedIn: false, status: "Username taken"})
    return;
  }
}


exports.sendResetLink = async (req, res) => {
  const { keyType, value } = req.body;
  console.log('req.body: ', req.body)
  // findOne returns an obj
  const recordFound = await User.findOne({ [keyType]: value })
  console.log('recordFound: ', recordFound)
  const { userID, email } = recordFound
  const payload = { userID, email }
  sendMail(payload)
  const status = recordFound !== null ? 'success' : 'failed'
  res.status(200).send({ status })
}

exports.passwordReset = async (req, res) => {
  const { userId, password } = req.body
  const result = await User.findOneAndUpdate({ userID: userId }, { $set: { password: bcrypt.hashSync(password, 8), }});
  // console.log('result: ;', result)
  res.status(200).send({ status: 'success' })
}