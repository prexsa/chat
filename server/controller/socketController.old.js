/*
const updateFriendsList = async (socket) => {
  // get friend list
  const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0 , -1);
  const parsedFriendList = await parseFriendList(friendList);
  console.log('parsedFriendList: ', parsedFriendList)
  const friendRooms = parsedFriendList.map(friend => friend.userId);
  console.log('friendRooms: ', friendRooms)
  if(friendRooms.length > 0) {
    socket.to(friendRooms).emit("connected", "true", socket.user.username)
  }

  
  //  * map over parsedFriendList 
  //  * attach unreadCount and lastestMessage to parsedFriendList
  
  const asyncRes = await Promise.all(
    parsedFriendList.map(async friend => {
      const friendId = friend.userId
      const { roomId } = await getRoomId(socket.user.userId, friendId)
      friend.unreadCount = await redisClient.hget(`unreadCount:${roomId.id}`, "count")
      // console.log('friend.unreadCount ', { userID: socket.user.userID, friend })
      // zrevrange returns an []
      const messages = await redisClient.zrevrange(`messages:${roomId.id}`, 0, -1)
      if(messages.length <= 0) {
        friend.latestMessage = ""
      } else {
        let latestMessage = ''
        for(const message of messages) {
          const parsedJson = JSON.parse(message)
          if(latestMessage === '' && parsedJson.from !== socket.user.userId) {
            latestMessage = parsedJson.content
            break;
          }
        }
        // console.log('parsedJson: ', parsedJson)
        friend.latestMessage = latestMessage
      }
      return friend;
    })
  )
  // console.log('asyncRes: ', asyncRes)
  socket.emit("friends", asyncRes)
}*/

/*
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
}*/

/*
  const friend = await redisClient.hgetall(`userId:${name}`)
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
  if(currentFriendList && currentFriendList.indexOf(`${name}.${friend.userId}`) !== -1) {
    cb({ done: false, errorMsg: "Friend already added!" });
    return;
  }
  // add yourself to friend friend's list
  await redisClient.lpush(
    `friends:${name}`,
    [socket.user.username, socket.user.userId].join('.')
  )
  // find friend and add user to your friend's list
  await redisClient.lpush(
    `friends:${socket.user.username}`,
    [name, friend.userId].join('.')
  )*/