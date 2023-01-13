const { redisClient } = require('../redis');

module.exports.authorizeUser = (socket, next) => {
  // console.log('socket: ', socket.request.session)
  if(!socket.request.session || !socket.request.session.user) {
    console.log('Bad Reqeust');
    next(new Error('Not Authorized'));
  } else {
    console.log('success')
    next();
  }
}

module.exports.initializeUser = async socket => {
  // set user to active
  // console.log('initializeUser: ')
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
  const parsedFriendList = await parseFriendList(friendList);
  const friendRooms = parsedFriendList.map(friend => friend.userID);
  if(friendRooms.length > 0) {
    socket.to(friendRooms).emit("connected", "true", socket.user.username)
  }

  // get chat messages
  const messageQuery= await redisClient.lrange(`chat:${socket.user.userID}`, 0 , -1)
  const messages = messageQuery.map(msgStr => {
    const parsedStr = msgStr.split('.');
    return {
      to: parsedStr[0],
      from: parsedStr[1],
      content: parsedStr[2],
    }
  }).reverse()
  // console.log('allMessages: ', messages)
  // console.log('parsedFriendList: ', parsedFriendList)
  socket.emit("friends", parsedFriendList)
  if(messages && messages.length > 0) {
    socket.emit('all_messages', messages)
  }
  socket.emit('current_user', socket.user.username)
}

module.exports.addFriend = async (socket, name, cb) => {
  // console.log('name: ', name)
  // console.log('socket user: ', socket.user)

  if(name === socket.user.username) {
    cb({ done: false, errorMsg: "Cannot add self!" })
    return;
  }
  const friend = await redisClient.hgetall(`userid:${name}`)
  // console.log('friend: 54 ', friend)
  if(Object.keys(friend).length <= 0) {
    cb({done: false, errorMsg: "User doesn't exist!" });
    return;
  }
  const currentFriendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0, -1
  )
  // console.log('currentFriendList: ', currentFriendList)
  if(currentFriendList && currentFriendList.indexOf(`${name}.${friend.userid}`) !== -1) {
    cb({done: false, errorMsg: "Friend already added!" });
    return;
  }
  // add yourself to friend friend's list
  await redisClient.lpush(
    `friends:${name}`,
    [socket.user.username, socket.user.userID].join('.')
  )
  // find friend and add user to your friend's list
  await redisClient.lpush(
    `friends:${socket.user.username}`,
    [name, friend.userid].join('.')
  )

  const newFriend = {
    username: name,
    userID: friend.userid,
    connected: friend.connected
  }

  const self = {
    username: socket.user.username,
    userID: socket.user.userID,
    connected: "true"
  }
  // emit to added friend
  socket.to(friend.userid).emit('new_friend', self)
  cb({ done: true, newFriend })
}

module.exports.dm = async (socket, msg) => {
  // console.log('msg: ', msg)
  msg.from = socket.user.userID;
  const messageStr = [msg.to, msg.from, msg.content].join(".");

  await redisClient.lpush(`chat:${msg.to}`, messageStr);
  await redisClient.lpush(`chat:${msg.from}`, messageStr)

  socket.to(msg.to).emit("dm", msg)
}

module.exports.channelMsgs = async (socket, userID) => {
  console.log('channelMsgs: ', userID)
  const msgs = await redisClient.lrange(`chat:${userID}`, 0, -1);
  const reversed = msgs.reverse();
  const parsedMsgs = await reversed.map(msg => {
    const parsed = msg.split('.');
    return {
      to: parsed[0],
      from: parsed[1],
      content: parsed[2],
    }
  })

  socket.emit("channel_msgs", parsedMsgs)

  // cb({ msgs: parsedMsgs })
}

module.exports.onDisconnect = async socket => {
  console.log('onDisconnect: ')
  await redisClient.hset(
    `userid:${socket.user.username}`,
    "connected",
    false
  )

  const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);
  const friendRooms = await parseFriendList(friendList).then(friends => {
    // console.log('friends: ', friends)
    return friends.map(friend => friend.userID)
  })
  // console.log('friendList: ', friendList)
  // console.log('friendRooms: ', friendRooms)
  socket.to(friendRooms).emit("connected", false, socket.user.username);
}

const parseFriendList = async (friendList) => {
  const newFriendList = [];
  for(let friend of friendList) {
    const parseFriend = friend.split('.');
    const friendConnectionStatus = await redisClient.hget(
      `userid:${parseFriend[0]}`,
      "connected"
    )
    // console.log('friendConnected: ', friendConnected)
    newFriendList.push({
      username: parseFriend[0],
      userID: parseFriend[1],
      connected: friendConnectionStatus
    })
  }
  return newFriendList;
}
