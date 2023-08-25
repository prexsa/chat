const { redisClient } = require('../redis');
const JWT_SECRET = process.env.JWT_SECRET;
const { jwtVerify } = require('./jwt.controller');
const crypto = require('crypto');
const { writeFile, readFile, stat, unlink } = require('fs');
const path = require('path');
const { cloudinary } = require('../cloudinary');

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

const getRooms = async (socket) => {
  // get rooms
  const rooms = await redisClient.smembers(`rooms:${socket.user.userId}`)
  // console.log('getRooms: ', rooms)
  const roomList = await Promise.all(
    rooms.map(async room => {
      const parsed = room.split(':');
      let details;
      if(parsed[0] === 'group') {
        details = await redisClient.hgetall(`${room}`);
        // isGroup flag is used to identify whether room is group or not
        details["isGroup"] = true;
      } else {
        const socketUserId = socket.user.userId;
        // check parsed str for roomUserId
        let userId = parsed[1];
        if(parsed[0] === socketUserId) {
          userId = parsed[1];
        } else {
          userId = parsed[0]
        }
        details = await redisClient.hgetall(`userid:${userId}`);
        // isGroup flag is used to identify whether room is group or not
        details["isGroup"] = false;
      }
// console.log('details: ', details)
      return details
    })
  )
  // console.log('roomList: ', roomList)
  return Promise.resolve({ rooms: roomList })
}

const notifyFriends = async (socket) => {
  const { rooms } = await getRooms(socket);
  const friendRooms = await rooms.map(room => room.userId);
  if(friendRooms.length > 0) {
    socket.to(friendRooms).emit("connected", "true", socket.user.userId)
  }
  socket.emit("friends", rooms)
}

const populateRooms = async (socket) => {
  const { rooms } = await getRooms(socket);
  // console.log('rooms; ', rooms)
    /*
    * map over parsedFriendList 
    * attach unreadCount and lastestMessage to parsedFriendList
  */
  const asyncRes = await Promise.all(
    rooms.map(async room => {
      // check isGroup flag
        // if isGroup, roomId is roomId
        // else, roomId is userId
      const tempId = room.isGroup ? room.roomId : room.userId;
      let roomUniqId = '';
      if(room.isGroup) {
        roomUniqId = room.roomId;
        room.unreadCount = await redisClient.hget(`unreadCount:${socket.user.userId}`, roomUniqId)
      } else {
        const { roomId } = await getRoomId(socket.user.userId, room.userId)
        roomUniqId = roomId.id;
        room.unreadCount = await redisClient.hget(`unreadCount:${socket.user.userId}`, room.userId)
      }

      // room.unreadCount = await redisClient.hget(`unreadCount:${roomId.id}`, "count")
      // console.log('friend.unreadCount ', { userID: socket.user.userID, friend })
      // zrevrange returns an []
      const messages = await redisClient.zrevrange(`messages:${roomUniqId}`, 0, -1)
      if(messages.length <= 0) {
        room.latestMessage = ""
      } else {
        let latestMessage = ''
        for(const message of messages) {
          const parsedJson = JSON.parse(message)
          if(latestMessage === '' && parsedJson.from !== socket.user.userId) {
            latestMessage = parsedJson.content
            break;
          }
        }
        /*messages.map(message => {
          return parsedJson
        })*/
        // console.log('parsedJson: ', parsedJson)
        room.latestMessage = latestMessage
      }
      return room;
    })
  )
  // console.log('asyncRes: ', asyncRes)
  socket.emit("friends", asyncRes)
}

const addToAllUsers = async (username, userId) => {
  const exist = await redisClient.hexists(`allUsers`, userId)
  // integer reply: 1 === exist, 0 === not-exist
  // console.log('exist: ', exist)
  if(exist === 0) {
    const added = await redisClient.hset(`allUsers`, userId, username)
    // console.log('added: ', added)
  }
}

const lookUpByUsername = async (username) => {
  const allKeys = await redisClient.hkeys(`allUsers`);
  const allValues = await redisClient.hvals(`allUsers`);
  // console.log('allValues: ', allValues)
  const index = allValues.indexOf(username);
  if(index >= 0) {
    return Promise.resolve({ userId: allKeys[index] })
  }
  return Promise.resolve({ userId: '' })
  // console.log('index: ', index)
}

const isUsernameAvailable = async (username) => {
  return await redisClient.sismember(`g_a_:`, username)
}

module.exports.initializeUser = async socket => {
  // set user to active
  socket.join(socket.user.userId)
  redisClient.hset(
    `userid:${socket.user.userId}`,
    "userId",
    socket.user.userId,
    "username",
    socket.user.username,
    "connected",
    true
  )

  addToAllUsers(socket.user.username, socket.user.userId)
  notifyFriends(socket);
  populateRooms(socket);
  // console.log('rooms: ', rooms)
  // updateFriendsList(socket)
  socket.emit('current_user', socket.user.username)
}

/*const addToActiveUsers = async (username, userId) => {
  const added = await redisClient.hset(`allUsers`)
}*/

module.exports.addFriend = async (socket, name, cb) => {
  // console.log('name: ', name)
  // console.log('socket user: ', socket.user)
  const { userId } = await lookUpByUsername(name);
  // console.log('addFriend: userId ', userId)
  if(userId === '') {
    cb({ done: false, errorMsg: "User doesn't exist."})
    return;
  }
  if(userId === socket.user.username) {
    cb({ done: false, errorMsg: "Cannot add self!" })
    return;
  }

  const connectStatus = await redisClient.hget(`userid:${userId}`, "connected")
  const { roomId } = await checkForOldRoomIdPairing(socket.user.userId, userId)
// console.log('roomId: ', roomId)
  if(roomId.id === '') {
    createRoomId(socket.user.userId, userId)
  } else {
    restoreRoomIdPairing(roomId.first, roomId.second, roomId)
  }
  // create roomId connection to store relationship for messages

  const newFriend = {
    username: name,
    userId: userId,
    connected: connectStatus
  }

  const self = {
    username: socket.user.username,
    userId: socket.user.userId,
    connected: "true"
  }
  // emit to added friend
  socket.to(userId).emit('new_friend', self)
  cb({ done: true, newFriend })
}


module.exports.clearUnreadCount = async (socket, roomId) => {
  // console.log("clearUnreadCount ", { userID: socket.user.userID, roomId })
  resetUnreadCount(socket.user.userId, roomId)
}

module.exports.dm = async (socket, msg) => {
  console.log('msg: ', msg)
  // check if the user is online
  msg.from = socket.user.userId;
  const username = socket.user.username
  const { count } = await incrementUnreadCount(msg.to, socket.user.userId)
  // emit to the user that is receiving the current count
  socket.to(msg.to).emit('unread-count', { userId: socket.user.userId, count })
  // check whether isGroup
  let roomIdStr = ''
  if(msg.isGroup) {
    roomIdStr = msg.to
  } else {
    const { roomId } = await getRoomId(socket.user.userId, msg.to)
    roomIdStr = roomId.id
  }
  // messages are stored in sorted set
  const unixDateTime = Date.now()
  const message = {
    to: msg.to,
    from: msg.from,
    content: msg.content,
    date: unixDateTime
  }
  // save message
  await redisClient.zadd(`messages:${roomIdStr}`, unixDateTime, JSON.stringify(message))
  if(msg.isGroup) {
    const members = await redisClient.smembers(`grpmembers:${msg.to}`)
    socket.to(members).emit("dm", msg);
  } else {
    socket.to(msg.to).emit("dm", msg);
  }

  // 
}

module.exports.changeGroupTitle = async (socket, channelId, title, cb) => {
  if(title === '' || channelId === '') return;
  const resp = await redisClient.hset(`group:${channelId}`, 'title', title)
  const members = await redisClient.smembers(`grpmembers:${channelId}`)
  socket.to(members).emit('update_group_name', { roomId: channelId, updatedTitle: title })
  cb({ resp })
}

module.exports.createGroup = async (socket, title, cb) => {
  const randomId = crypto.randomUUID();
  const groupId = `group:${randomId}`;
  const created = await redisClient.hset(
    `${groupId}`, 
    "roomId",
    randomId,
    "title",
    title.name,
    "owner",
    socket.user.userId
  )
  const added = await redisClient.sadd(`rooms:${socket.user.userId}`, groupId)
  // const addToMembers = await redisClient.sadd(`grpmembers:${randomId}`)
  console.log({ created, added })
  cb({ roomId: groupId, title: title.name })
}

module.exports.getGroupAdminInfo = async (ownerId, cb) => {
  const user = await redisClient.hgetall(`userid:${ownerId}`)
  console.log('user: ', user)
  cb(user);
}


module.exports.getGroupMembers = async (roomId, cb) => {
  // console.log('getGroupMembers: ', roomId)
  const members = await redisClient.smembers(`grpmembers:${roomId}`)
  const membersDetails = await Promise.all(
    members.map(async userId => {
      return await redisClient.hgetall(`userid:${userId}`)
    })
  )
  cb({ members: membersDetails })
  // console.log('membersDetails: ', membersDetails)
}

const getGroupTitle = async (roomId) => {
  return Promise.resolve({ title: await redisClient.hget(`group:${roomId}`, 'title')})
}

module.exports.addToGroup = async (socket, roomId, name, cb) => {
  console.log('addToGroup: ', { roomId, name });
  // locate user by name or email
  const { userId } = await lookUpByUsername(name);
  // console.log('userId; ', userId)
  if(userId === '') {
    cb({ isFound: false, msg: "User does not exist."});
    return;
  }
  // add user to group set
  // update user records
  const { title } = await getGroupTitle(roomId);
  const integerResp = await redisClient.sadd(`grpmembers:${roomId}`, userId);
  // add roomId to member's rooms set
  const updateRoomSet = await redisClient.sadd(`rooms:${userId}`, `group:${roomId}`)
  socket.to(userId).emit('new_friend', {
    roomId,
    title
  })
  cb({ isFound: true, username: name, userId })
}
// https://developer.redis.com/howtos/chatapp/
// https://redis.io/docs/data-types/sorted-sets/
/*module.exports.removeUserFromGroup = async (socket, roomId, userId, cb) => {
  const removedFromGroupList = await redisClient.srem(`grpmembers:${roomId}`, userId)
  // remove roomid from user's list
  const removedFromUsersList = await redisClient.srem(`rooms:${userId}`, roomId)
  console.log('removedFromUsersList ', removedFromUsersList)
  // emit to user
  socket.to(userId).emit('exit_group_chat', { roomId })
  cb({ isUserRemoved: true })
}*/

module.exports.leaveGroup = async (socket, userId, channelId, cb) => {
  // console.log({ userId, channelId })
  const removeFromGroupList = await redisClient.srem(`grpmembers:${channelId}`, userId)
  const removeFromUserList = await redisClient.srem(`rooms:${userId}`, `group:${channelId}`)
  // get remaining userId and emit to users the removed member
  const members = await redisClient.smembers(`grpmembers:${channelId}`)
  socket.to(members).emit('exit_group_chat', { roomId: channelId , userId })
  // console.log('leaveGroup')
  cb({ resp: { channelId }})
}

module.exports.disconnectUserRelationship = async (socket, user, channel, isGroup) => {
  const { userId, username } = user;
  const { channelId, channelname } = channel;
  console.log("disconnectUserRelationship ", { user, channel })
  // check whether channelId is private or group
  // return;
  if(isGroup) {
    const removeFromGroupList = await redisClient.srem(`grpmembers:${channelId}`, userId)
    const removeFromUserList = await redisClient.srem(`rooms:${userId}`, `group:${channelId}`)
    // get remaining userId and emit to users the removed member
    const members = await redisClient.smembers(`grpmembers:${channelId}`)
    socket.to(members).emit('exit_group_chat', { roomId: channelId , userId })
  } else {
    // removeFromFriendList(username, channelname, channelId)
    // removeFromFriendList(channelname, username, userId)
    // get roomId 
    const { roomId } = await getRoomId(userId, channelId)
    removeRoomIdPairing(userId, roomId.id)
    removeRoomIdPairing(channelId, roomId.id)
    // remove yourself off their friends list
    socket.to(channelId).emit('remove_from_chat', { roomId: userId, usernameToRemove: username, isGroup })
    // socket.to(friend.userid).emit('new_friend', self)
  }
}

const addIdentityToGroupMsgUserId = async (messages) => {
  const parsedJson = messages.map(message => JSON.parse(message))
  const asyncRes = await Promise.all(
    parsedJson.map(async message => {
      // console.log('message; ', message.from)
      const resp = await redisClient.hget(`userid:${message.from}`, 'username')
      // console.log('message.from: ', resp)
      message.username = resp
      return message;
    })
  )
  return Promise.resolve({ mapMsgToUsername: asyncRes })
}

module.exports.handleRoomSelected = async (socket, channelId, isGroup) => {
  // reset unread count
  const userId = socket.user.userId
  const { count } = await resetUnreadCount(userId, channelId)
  // emit to yourself
  socket.emit('unread-count', { userId: channelId , count })
  // get messageId 
  let roomIdStr = ''
  if(isGroup) {
    roomIdStr = channelId
  } else {
    const { roomId } = await getRoomId(userId, channelId)
    roomIdStr = roomId.id
  }
  // console.log('handleRoomSelected: ', roomId)
  // get room message and emit back
  // zrevrange returns an array[]
  const messages = await redisClient.zrange(`messages:${roomIdStr}`, 0 , -1)
  // console.log('messages: ', messages)
  let parsedMessages = [];
  if(isGroup) {
    const { mapMsgToUsername } = await addIdentityToGroupMsgUserId(messages);
    // console.log('groupMessage: ', groupMessage)
    parsedMessages = mapMsgToUsername;
  } else {
    // console.log('messages; ', messages)
    parsedMessages = messages.map(message => JSON.parse(message))
  }
  // console.log('parsedJson: ', parsedJson )
  socket.emit('room_msgs', parsedMessages)
}
// https://www.reddit.com/r/reactjs/comments/w22mag/how_to_handle_sending_images_and_videos_in_a_chat/
// https://stackskills.com/courses/181862/lectures/2751724
module.exports.uploadFile = async (socket, fileObj, cb) => {
  const { to: channelId, from: userId, fileName, file } = fileObj
  // console.log('uploadFile: ', { fileName, file })
  // const userId = socket.user.userID
  const tmpFileDir = path.join(__dirname, "../tmp/upload")
  // write file to tmp/upload folder
  writeFile(tmpFileDir + "/" + `${fileName}`, file, (err) => {
    // console.log('err: ', err)
    if(err) console.error('upload write file error: ', err)
    // write file success
    // upload file to cloudinary
    cloudinary.uploader
      .upload(tmpFileDir + "/" + fileName, { 
        public_id: fileName,
        overwrite: true, 
        faces: true})
      .then(async result => {
        console.log(result)
        // delete the stored images from tmp folder
        deleteStoredFile(fileName);
        // destruct { url, public_id, secure_url, asset_id }
        const { url, public_id, secure_url, asset_id } = result
        // save url to redis
        // get roomId
        const { roomId } = await getRoomId(userId, channelId)
        const unixDateTime = Date.now()
        const message = {
          to: channelId,
          from: userId,
          isImage: true,
          content: url,
          date: unixDateTime
        }
        // save message
        await redisClient.zadd(`messages:${roomId.id}`, unixDateTime, JSON.stringify(message))
        socket.to(channelId).emit("dm", message)
        cb({ message })
      })
      .catch(err => console.log(err));
  })
  
  /*const readStream = fs.createReadStream(path.resolve(tmpFileDir, fileName), { encoding: 'binary'})
  const chunks = []

  readStream.on('readable', function() {
    console.log('Image Loading')
  })

  readStream.on('data', function(chunk) {
    chunks.push(chunk)
    socket.emit('img-chunk', chunk)
  })

  readStream.on('end', function() {
    console.log('Image loaded')
  })*/

  // await redisClient.hset(`file:${roomId.id}`)
}

const deleteStoredFile = (fileName) => {
  const tmpFileDir = path.join(__dirname, "../tmp/upload");
  stat(tmpFileDir + "/" + fileName, (err, stats) => {
    if(err) {
      return console.error(err)
    }
    unlink(tmpFileDir + "/" + fileName, (err) => {
      if(err) return console.log(err);
      console.log('file deleted successfully');
    })
  })
}

module.exports.onDisconnect = async socket => {
  console.log('onDisconnect: ')
  await redisClient.hset(
    `userid:${socket.user.userId}`,
    "connected",
    false
  )

  const { rooms } = await getRooms(socket);
  const friendRooms = await rooms.map(room => room.userId);
  socket.to(friendRooms).emit("connected", false, socket.user.userId);
}

/*const removeFromFriendList = async (username, friendname, friendId) => {
  const friendStr = `${friendname}.${friendId}`
  console.log({ username, friendStr })
  const resp = await redisClient.lrem(`friends:${username}`, 0, friendStr)
  console.log('resp: ', resp)
  // remove roomid connections
}*/

const removeRoomIdPairing = async (userId, roomId) => {
  // console.log('remove: ', { userId, roomId })
  await redisClient.srem(`rooms:${userId}`, roomId)
}

const incrementUnreadCount = async (roomId, userId) => {
  // saved as redis hash
  // console.log('incrementUnreadCount: ', { roomId, userId })
  const count = await redisClient.hincrby(`unreadCount:${roomId}`, userId, 1)
  // const count = await redisClient.hincrby(`unreadCount:${roomId}:${userId}`, 'count', 1)
  return Promise.resolve({ count })
  // https://www.tabnine.com/code/javascript/functions/ioredis/Redis/hincrby
}

const resetUnreadCount = async (roomId, userId) => {
  // console.log('resetUnreadCount: ', { roomId, userId })
  const count = await redisClient.hset(`unreadCount:${roomId}`, userId, 0)
  // const count = await redisClient.hset(`unreadCount:${roomId}:${userId}`, 'count', 0)
  return Promise.resolve({ count })
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