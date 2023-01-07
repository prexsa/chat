const User = require('../model/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = (req, res) => {
  // console.log('app: body: ', req.body)
  // console.log('session auth : ', req.session)
  const { username, password = "testing" } = req.body;
  User.
    findOne({
      username: username
    }).exec((err, user) => {
      if(err) {
        res.status(500).send({ status: err });
        return;
      }
      if(!user) return res.status(200).send({ loggedIn: false, status: "User not found" });
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if(!passwordIsValid) {
        return res.status(200).send({
          accessToken: null,
          status: 'Invalid password!'
        });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 86400 }); // expires 24hrs

      req.session.user = {
        username,
        id: user._id,
        accessToken: token,
        userID: user.userID
      }

      res.status(200).send({
        id: user._id,
        username: user.username,
        accessToken: token,
        userID: user.userID
      })
    })
}

exports.signup = async (req, res) => {
  console.log('signup ', req.body)
  const { username, password } = req.body;
  const record = await User.findOne({ username: username })
  console.log('record: ', record)
  if(record === null) {
    const user = new User({
      username: username,
      password: bcrypt.hashSync(req.body.password, 8),
      userID: crypto.randomUUID()
    });
    user.save((err, user) =>{
      if(err) {
        res.status(500).send({ status: err });
        return;
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 86400 }); // expires 24hrs
      // console.log('user: ', user)
      req.session.user = {
        username,
        id: user._id,
        userID: user.userID
        // accessToken: token,
      }
      res.send({
        status: 'User was registered successfully!',
        username: username,
        // accessToken: token
      })
    })
    return;
  } else {
    res.status(200).send({ loggedIn: false, status: "Username taken"})
    return;
  }
}
