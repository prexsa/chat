const { redisClient } = require('../redis');
const JWT_SECRET = process.env.JWT_SECRET;
const { jwtVerify } = require('./jwt.controller');
const crypto = require('crypto');

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

/*
  * After verified credentials, set user connected status to true
  * Grab friend's list, parse for roomId, emit to all friends that user is online
  * Check if user has unread messages and get count of unread messages
  * Loop through friend's list and add onto object key: 'unreadCount' and value of 'totalCount'
*/

const updateFriendsList = async (socket) => {
  // get friend list
  const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0 , -1);
  const parsedFriendList = await parseFriendList(friendList);
  // console.log('parsedFriendList: ', parsedFriendList)
  const friendRooms = parsedFriendList.map(friend => friend.userID);
  // console.log('friendRooms: ', friendRooms)
  if(friendRooms.length > 0) {
    socket.to(friendRooms).emit("connected", "true", socket.user.username)
  }

  /*
    * map over parsedFriendList 
    * attach unreadCount and lastestMessage to parsedFriendList
  */
  const asyncRes = await Promise.all(
    parsedFriendList.map(async friend => {
      const friendId = friend.userID
      const { roomId } = await getRoomId(socket.user.userID, friendId)
      // console.log({ roomId, userID: socket.user.userID})
      /*friend.unreadCount = await redisClient.hget(`unreadCount:${roomId}:${socket.user.userID}`, "count")
      const lastestMessage = await redisClient.zrevrange(`room:messages:${roomId}:${socket.user.userID}`, 0, 0)*/
      // friend.unreadCount = await redisClient.hget(`unreadCount:${socket.user.userID}:${roomId}`, "count")
      friend.unreadCount = await redisClient.hget(`unreadCount:${roomId.id}`, "count")
      // console.log('friend.unreadCount ', { userID: socket.user.userID, friend })
      // zrevrange returns an []
      const messages = await redisClient.zrevrange(`messages:${roomId.id}`, 0, -1)
      console.log('lastestMessage: ', messages)
      if(messages.length <= 0) {
        friend.latestMessage = ""
      } else {
        // console.log('lastestMessage;  hello',  lastestMessage)
        let latestMessage = ''
        const parsedJson = messages.map(message => {
          const parsedJson = JSON.parse(message)
          if(latestMessage === '' && parsedJson.from !== socket.user.userID) {
            latestMessage = parsedJson.content
          }
          return parsedJson
        })
        // console.log('parsedJson: ', parsedJson)
        friend.latestMessage = latestMessage
      }
      // console.log('friend: ', friend)
      return friend;
    })
  )

  // console.log('asyncRes: ', asyncRes)
  socket.emit("friends", asyncRes)
}

const addUserToGeneralAssembly = async (username) => {
  await redisClient.sadd(`g_a_:`, username)
}

const isUsernameAvailable = async (username) => {
  return await redisClient.sismember(`g_a_:`, username)
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

  addUserToGeneralAssembly(socket.user.username)
  updateFriendsList(socket)
  // check list for new messages by rooms
  // get new msg indicator notice, while user was away
  // const hasMessages = await redisClient.smembers(`hasMsg:${socket.user.username}`);
  // console.log('has ', hasMessages )
  /*
    * map over roomId,
    * map over room messages, get count of key: 'read', and stop count when 'read' value is 'true'
  */
  /*if(hasMessages.length > 0) {
    hasMessages.map(roomId => {
      parsedFriendList.map(async friend => {

        if(friend.userID === roomId) {
          friend.unreadCount = await redisClient.hget(`unreadCount:${roomId}:${socket.user.userID}`, "count")
          const lastestMessage = await redisClient.zrevrange(`room:messages:${roomId}:${socket.user.userID}`, 0, 0)
          const parsedJson = JSON.parse(lastestMessage)
          console.log('parsedJson: ', parsedJson)
          friend.lastestMessage = parsedJson.content
        }

        return friend;
      })
    })
  }*/

  /*const messageQuery= await redisClient.lrange(`chat:${socket.user.userID}`, 0 , -1)
  const messages = messageQuery.map(msgStr => {
    const parsedStr = msgStr.split('.');
    // check is message has been read
    // if(parsedStr[3] === "false") unreadCount += 1;
    return {
      to: parsedStr[0],
      from: parsedStr[1],
      content: parsedStr[2]
    }
  }).reverse()
  // console.log('allMessages: ', messages)
  // get count of unread messages

  if(messages && messages.length > 0) {
    socket.emit('all_messages', messages)
  }*/

  socket.emit('current_user', socket.user.username)
}

const checkForOldRoomIdPairing = async (userId, friendId) => {
  const keyVariant_1 = `${userId}:${friendId}`
  const keyVariant_2 = `${friendId}:${userId}`
  // console.log({ keyVariant_1, keyVariant_2})
  let roomId = { 
    id: '',
    first: '',
    second: ''
  }
  const messages_1 = await redisClient.zrevrange(`messages:${keyVariant_1}`, 0, -1)
  const messages_2 = await redisClient.zrevrange(`messages:${keyVariant_2}`, 0, -1)
  // console.log({ messages_1, messages_2 })
  if(messages_1.length > 0) {
    roomId = {
      id: keyVariant_1,
      first: userId,
      second: friendId
    }
  } else if (messages_2.length > 0) {
    roomId = {
      id: keyVariant_2,
      first: friendId,
      second: userId
    }
  }

  return Promise.resolve({ roomId })
  // return { roomId }  
}

const restoreRoomIdPairing = async (userId, friendId, roomId) => {
  // console.log({ userId, friendId, roomId })
  await redisClient.sadd(`rooms:${userId}`, roomId.id)
  await redisClient.sadd(`rooms:${friendId}`, roomId.id)
}

const createRoomId = async (userId, friendId) => {
  // const roomId = crypto.randomUUID()
  const { roomId } = await getRoomId(userId, friendId)
  if(roomId.id == '') {
    const roomId = `${userId}:${friendId}`
    await redisClient.sadd(`rooms:${userId}`, roomId)
    await redisClient.sadd(`rooms:${friendId}`, roomId)
  }
}

const getRoomId = async (userId, friendId) => {
  // use 'sismember' to check for existence, 1 = true, 0 = false
  const keyVariant_1 = `${userId}:${friendId}`
  const keyVariant_2 = `${friendId}:${userId}`
  // console.log({ keyVariant_1, keyVariant_2})
  let roomId = { 
    id: '',
    first: '',
    second: ''
  }
  const key_1 = await redisClient.sismember(`rooms:${userId}`, keyVariant_1)
  const key_2 = await redisClient.sismember(`rooms:${userId}`, keyVariant_2)
  // console.log({ key_1, key_2 })
  if(key_1 === 1) {
    roomId = {
      id: keyVariant_1,
      first: userId,
      second: friendId
    }
  } else if (key_2 === 1) {
    roomId = {
      id: keyVariant_2,
      first: friendId,
      second: userId
    }
  }

  return Promise.resolve({ roomId })
  // return { roomId }
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
    cb({ done: false, errorMsg: "Friend already added!" });
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

  const { roomId } = await checkForOldRoomIdPairing(socket.user.userID, friend.userid)
// console.log('roomId: ', roomId)
  if(roomId.id === '') {
    createRoomId(socket.user.userID, friend.userid)
  } else {
    restoreRoomIdPairing(roomId.first, roomId.second, roomId)
  }
  // create roomId connection to store relationship for messages

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

const incrementUnreadCount = async (roomId, userId) => {
  // saved as redis hash
  // console.log('incrementUnreadCount: ', { roomId, userId })
  const count = await redisClient.hincrby(`unreadCount:${roomId}:${userId}`, 'count', 1)
  return Promise.resolve({ count })
  // https://www.tabnine.com/code/javascript/functions/ioredis/Redis/hincrby
}

const resetUnreadCount = async (roomId, userId) => {
  // console.log('resetUnreadCount: ', { roomId, userId })
  const count = await redisClient.hset(`unreadCount:${roomId}:${userId}`, 'count', 0)
  return Promise.resolve({ count })
}

module.exports.dm = async (socket, msg) => {
  console.log('msg: ', msg)
  // check if the user is online
  msg.from = socket.user.userID;
  const username = socket.user.username
  const { count } = await incrementUnreadCount(msg.to, socket.user.userID)
  // emit to the user that is receiving the current count
  socket.to(msg.to).emit('unread-count', { userId: socket.user.userID, count})
  // updateFriendsList(socket)
  const { roomId } = await getRoomId(socket.user.userID, msg.to)

/*  const { connected, friendUN } = await getFriendConnectionState(username, msg.to);
  // console.log('connected: ', connected, 'friendUN: ', friendUN)
  if(connected === 'false') {
    // console.log('connected false')
    await redisClient.sadd(`hasMsg:${friendUN}`,`${msg.from}`)
  }
  // console.log('socket: ', socket.user.username)
  const messageStr = [msg.to, msg.from, msg.content, msg.read].join(".");
// console.log('messageStr: ', messageStr)
  await redisClient.lpush(`chat:${msg.to}`, messageStr);
  await redisClient.lpush(`chat:${msg.from}`, messageStr)*/

  socket.to(msg.to).emit("dm", msg)

  // messages are stored in sorted set
  const unixDateTime = Date.now()
  const message = {
    to: msg.to,
    from: msg.from,
    content: msg.content,
    date: unixDateTime
  }
  await redisClient.zadd(`messages:${roomId.id}`, unixDateTime, JSON.stringify(message))
}
// https://developer.redis.com/howtos/chatapp/
// https://redis.io/docs/data-types/sorted-sets/

/*module.exports.getRoomMessages = async (socket, roomId) => {
  console.log('channelMsgs: ', roomId)
  const msgs = await redisClient.lrange(`chat:${userID}`, 0, -1);
  const reversed = msgs.reverse();
  const parsedMsgs = await reversed.map(msg => {
    const parsed = msg.split('.');
    return {
      to: parsed[0],
      from: parsed[1],
      content: parsed[2],
      read: parsed[3]
    }
  })

  socket.emit("room_msgs", parsedMsgs)
}*/

module.exports.disconnectUserRelationship = async (socket, user, channel) => {
  const { userId, username } = user
  const { channelId, channelname } = channel
  console.log({ user, channel })
  removeFromFriendList(username, channelname, channelId)
  removeFromFriendList(channelname, username, userId)
  // get roomId 
  const { roomId } = await getRoomId(userId, channelId)
  removeRoomIdPairing(userId, roomId.id)
  removeRoomIdPairing(channelId, roomId.id)
  // remove yourself off their friends list
  socket.to(channelId).emit('remove_from_chat', { roomId: userId, usernameToRemove: username })
  // socket.to(friend.userid).emit('new_friend', self)
}

/*module.exports.removeRoomId = async (socket, roomId) => {
  await redisClient.srem(`hasMsg:${socket.user.username}`, roomId)
}*/
/*
module.exports.clearUnreadCount = async (socket, roomId) => {
  console.log("fn: clearUnreadCount: ", { roomId })
  // set messages key 'read' to false
  const { count } = await resetUnreadCount(socket.user.userID, roomId)
  // emit to yourself
  socket.emit('unread-count', { userId: socket.user.userID , count })
}*/

module.exports.handleRoomSelected = async (socket, channelId) => {
  // reset unread count
  const userId = socket.user.userID
  const { count } = await resetUnreadCount(userId, channelId)
  // emit to yourself
  socket.emit('unread-count', { userId: channelId , count })
  // get messageId 
  const { roomId } = await getRoomId(userId, channelId)
  // console.log('handleRoomSelected: ', roomId)
  // get room message and emit back
  // zrevrange returns an array[]
  const messages = await redisClient.zrange(`messages:${roomId.id}`, 0 , -1)
  // console.log('messages; ', messages)
  const parsedJson = messages.map(message => JSON.parse(message))
  // console.log('parsedJson: ', parsedJson )
  socket.emit('room_msgs', parsedJson)
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

const removeFromFriendList = async (username, friendname, friendId) => {
  const friendStr = `${friendname}.${friendId}`
  console.log({ username, friendStr })
  const resp = await redisClient.lrem(`friends:${username}`, 0, friendStr)
  console.log('resp: ', resp)
  // remove roomid connections
}

const removeRoomIdPairing = async (userId, roomId) => {
  await redisClient.srem(`rooms:${userId}`, roomId)
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
