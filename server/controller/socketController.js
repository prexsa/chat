const { redisClient } = require('../redis');

module.exports.authorizeUser = (socket, next) => {
  if(!socket.request.session || !socket.request.session.user) {
    console.log('Bad Reqeust');
    next(new Error('Not Authorized'));
  } else {
    console.log('success')
    /*socket.user = { ...socket.request.session.user };
    // console.log('socket.user: ', socket.user)
    redisClient.hset(
      `userid:${socket.user.username}`,
      "userid",
      socket.user.userID,
      "connected",
      true
    )*/
    next();
  }
}

module.exports.initializeUser = async socket => {
  // set user to active
  socket.user = { ...socket.request.session.user };
  // console.log('socket.user: ', socket.user)
  socket.join(socket.user.userID)
  redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userID,
    "connected",
    true
  )
  // get friend list
  const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0 , -1);
  socket.emit("friends", friendList)
}

module.exports.addFriend = async (socket, name, cb) => {
  console.log('name: ', name)
  console.log('socket user: ', socket.user)
  if(name === socket.user.username) {
    cb({ done: false, errorMsg: "Cannot add self!" })
    return;
  }
  const friendUserID = await redisClient.hget(
    `userid:${name}`,
    "userid"
  )
  const currentFriendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0, -1
  )
  if(!friendUserID) {
    cb({done: false, errorMsg: "User doesn't exist!" });
    return;
  }
  if(currentFriendList && currentFriendList.indexOf(name) !== -1) {
    cb({done: false, errorMsg: "Friend already added!" });
    return;
  }
  // add yourself to friend friend's list
  await redisClient.lpush(`friends:${name}`, socket.user.username)
  // find friend and add user to your friend's list
  await redisClient.lpush(`friends:${socket.user.username}`, name);
  const newFriend = {
    username: name,
    userID: friendUserID,
    connected: true
  }
  cb({ done: true, newFriend })
}