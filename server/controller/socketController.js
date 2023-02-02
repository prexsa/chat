const { redisClient } = require('../redis');
const JWT_SECRET = process.env.JWT_SECRET;
const { jwtVerify } = require('./jwt.controller');

module.exports.authorizeUser = (socket, next) => {
  // console.log('socket: ', socket.request.session)
  const token = socket.handshake.auth.token;
  jwtVerify(token, JWT_SECRET).then(decoded => {
    socket.user = { ...decoded };
    next();
  }).catch(err => {
    console.log('Bad request! ', err);
    next(new Error("Not Authorized!"))
  })
}

module.exports.initializeUser = async socket => {
  // set user to active
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
  // console.log('parsedFriendList: ', parsedFriendList)
  const friendRooms = parsedFriendList.map(friend => friend.userID);
  // console.log('friendRooms: ', friendRooms)
  if(friendRooms.length > 0) {
    socket.to(friendRooms).emit("connected", "true", socket.user.username)
  }

  // get new msg indicator notice, while user was away
  const hasMessages = await redisClient.smembers(`hasMsg:${socket.user.username}`);
  // console.log('has ', hasMessages )
  if(hasMessages.length > 0) {
    hasMessages.map(roomId => {
      parsedFriendList.map(friend => {
        if(friend.userID === roomId) {
          friend.hasNewMessage = true;
        }
        return friend;
      })
    })
  }
  // console.log('parsedFriendList: ', parsedFriendList)
  socket.emit("friends", parsedFriendList)

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
  // console.log('friend: 75 ', friend)
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
  console.log('msg: ', msg)
  // check if the user is online
  msg.from = socket.user.userID;
  const username = socket.user.username

  const { connected, friendUN } = await getFriendConnectionState(username, msg.to);
  // console.log('connected: ', connected, 'friendUN: ', friendUN)
  if(connected === 'false') {
    // console.log('connected false')
    await redisClient.sadd(`hasMsg:${friendUN}`,`${msg.from}`)
  }
  // console.log('socket: ', socket.user.username)
  const messageStr = [msg.to, msg.from, msg.content].join(".");
// console.log('messageStr: ', messageStr)
  await redisClient.lpush(`chat:${msg.to}`, messageStr);
  await redisClient.lpush(`chat:${msg.from}`, messageStr)

  socket.to(msg.to).emit("dm", msg)
}

module.exports.channelMsgs = async (socket, userID) => {
  // console.log('channelMsgs: ', userID)
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
}

module.exports.removeRoomId = async (socket, roomId) => {
  await redisClient.srem(`hasMsg:${socket.user.username}`, roomId)
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

const getFriendConnectionState = async (username, friendid) => {
  const friendList = await redisClient.lrange(`friends:${username}`, 0 , -1);
  let friendConnectionStatus = false;
  let parseFriendUN = ''
  for(let i = 0; i < friendList.length; i++) {
    const friend = friendList[i];
    parseFriendUN = friend.split('.')[0];
    const parseFriendID = friend.split('.')[1];
    // console.log('friend: ', friend)
    if(parseFriendID === friendid) {
      // console.log('connection status: ', await redisClient.hgetall(`userid:${parseFriendUN}`))
      friendConnectionStatus = await redisClient.hget(`userid:${parseFriendUN}`, 'connected')
      return {
        connected: friendConnectionStatus,
        friendUN: parseFriendUN
      };
    }
  }
}
