// const { redisClient } = require('../redis');
// const JWT_SECRET = process.env.JWT_SECRET;
const { jwtVerify } = require('./jwt.controller');
const crypto = require('crypto');
const { writeFile, readFile, stat, unlink } = require('fs');
const path = require('path');
const { cloudinary } = require('../cloudinary');
const { JWT_SECRET } = require('../env');
const axios = require('axios');

const User = require('../model/user.model');
const Room = require('../model/room.model');
const UploadFile = require('../model/file.model');
// const Message = require('../model/message.model');

const RoomUtil = require('./room.util');

module.exports.authorizeUser = (socket, next) => {
  // console.log('socket: ', socket.request.session)
  const token = socket.handshake.auth.token;
  jwtVerify(token, JWT_SECRET)
    .then((decoded) => {
      socket.user = { ...decoded };
      next();
    })
    .catch((err) => {
      console.log('Bad request! ', err);
      next(new Error('Not Authorized!'));
    });
};

/*
 * After verified credentials, set user connected status to true
 * Grab friend's list, parse for roomId, emit to all friends that user is online
 * Check if user has unread messages and get count of unread messages
 * Loop through friend's list and add onto object key: 'unreadCount' and value of 'totalCount'
 */

const notifyRooms = async (socket, rooms) => {
  // console.log({ socket, rooms });
  if (rooms.length > 0) {
    socket.to(rooms).emit('connected', 'true', socket.user.userId);
  }
  // socket.emit('roomList', rooms);
};

const mapFileIdToFileObj = async (files) => {
  // console.log(files);
  const mapFiles = await Promise.all(
    files.map(async (fileId) => {
      const record = await UploadFile.find({
        _id: fileId.fileId.toString(),
      });
      return ({
        cloudinaryUrl,
        cloudinarySecureUrl,
        cloudinaryAssetId,
        name,
        createdAt,
      } = record[0]);
    }),
  );
  return Promise.resolve(mapFiles);
};

const getRoomDetails = async (socket, rooms) => {
  // console.log('rooms: ', rooms);
  const roomDetails = await Promise.all(
    rooms.map(async (roomId) => {
      const details = await Room.find({ roomId: roomId });
      // console.log('details: ', details[0]);
      const { mates } = details[0];
      const mapped = await mapNameToUserId(mates);
      details[0].mates = mapped;
      // console.log('details: ', details[0]);
      if ('uploadFiles' in details[0]) {
        const mappedFiles = await mapFileIdToFileObj(details[0].uploadFiles);
        details[0].uploadFiles = mappedFiles;
      }
      // console.log('details: ', mapped);
      return details[0];
    }),
  );
  socket.emit('roomList', roomDetails);
  // console.log('room details: ', roomDetails);
};

const mapNameToUserId = async (arrayOfUserIds) => {
  // console.log('arrayOfUserIds: ', arrayOfUserIds);
  const mapped = await Promise.all(
    arrayOfUserIds.map(async (userId) => {
      const user = await User.findOne(
        { userId: userId },
        { userId: 1, firstname: 1, lastname: 1 },
      );
      return {
        userId: user.userId,
        fullname: `${user.firstname} ${user.lastname}`,
      };
    }),
  );

  return Promise.resolve(mapped);
};

const getRequestsList = async (socket, pendingRequest) => {
  // console.log('mapMsgToUsername :', mapNameToUserId);
  const mappedNameToUserId = await mapNameToUserId(pendingRequest);
  // console.log('mapped: ', mappedNameToUserId);
  socket.emit('requests_to_connect', { mappedNameToUserId });
};

module.exports.initializeUser = async (socket) => {
  // set user to active
  socket.join(socket.user.userId);

  const user = await User.find({ userId: socket.user.userId });
  // console.log('user: ', user);
  const { rooms, pendingRequest } = user[0];
  // console.log('rooms: ', rooms);

  //addToAllUsers(socket.user.username, socket.user.userId);
  notifyRooms(socket, rooms);
  getRoomDetails(socket, rooms);
  getRequestsList(socket, pendingRequest);
  // populateRooms(socket);
  // console.log('rooms: ', rooms)
  // updateFriendsList(socket)
  socket.emit('current_user', socket.user.username);
};

module.exports.acceptRequest = async (socket, requesterId, cb) => {
  // console.log({ requesterId });
  const userId = socket.user.userId;
  // console.log('userId: ', userId);
  // console.log('requesterId: ', requesterId);
  // create room
  const { roomId } = await RoomUtil.createARoomRelationship(
    userId,
    requesterId,
  );
  // update requestee pendingRequest array and add room
  const updateAcceptee = await User.findOneAndUpdate(
    { userId: userId },
    { $pull: { pendingRequest: requesterId }, $addToSet: { rooms: roomId } },
  );
  // update requestor's requested array
  const updateRequester = await User.findOneAndUpdate(
    { userId: requesterId },
    { $pull: { requested: userId }, $addToSet: { rooms: roomId } },
    { returnDocument: true },
  );
  getRoomDetails(socket, updateRequester.rooms);
  // send the socket
  socket.to(requesterId).emit('request-accepted', updateRequester);
};

module.exports.denyRequest = async (socket, requesterId, cb) => {
  // update requestee pendingRequest array and add room
  const userId = socket.user.userId;

  const removeFromPendingRequest = await User.findOneAndUpdate(
    { userId: userId },
    { $pull: { pendingRequest: requesterId } },
  );
  // update requestor's requested array
  const removeFromRequested = await User.findOneAndUpdate(
    { userId: requesterId },
    { $pull: { requested: userId } },
    { returnDocument: true },
  );

  cb({ isSuccessful: true });
};

module.exports.sendRequest = async (socket, userId, cb) => {
  // socket.user.userId
  // update your requesting record
  const addUserIdToRequestedArr = await User.findOneAndUpdate(
    { userId: socket.user.userId },
    { $addToSet: { requested: userId } },
    { returnDocument: true },
  );
  // console.log('updated: ', updated);
  // update requestee's records
  const addUserIdToPendingRequest = await User.findOneAndUpdate(
    { userId: userId },
    { $addToSet: { pendingRequest: socket.user.userId } },
    { returnDocument: true },
  );

  // console.log({ addUserIdToPendingRequest, addUserIdToRequestedArr });

  const userInfo = [
    {
      fullname: `${addUserIdToRequestedArr.firstname} ${addUserIdToRequestedArr.lastname}`,
      userId: addUserIdToRequestedArr.userId,
    },
  ];

  // notify requestee of request
  socket
    .to(userId)
    .emit('requests_to_connect', { mappedNameToUserId: userInfo });
};

module.exports.clearUnreadCount = async (socket, roomId) => {
  // console.log("clearUnreadCount ", { userID: socket.user.userID, roomId })
  resetUnreadCount(socket.user.userId, roomId);
};

module.exports.dm = async (socket, msg) => {
  console.log('msg: ', msg);
  // check if the user is online
  // const unixDateTime = Date.now();
  const roomId = msg.roomId;
  const message = {
    userId: msg.from,
    message: msg.content,
    date: msg.date,
  };

  const updatedRoomMessages = await Room.findOneAndUpdate(
    { roomId: roomId },
    { $push: { messages: message } },
    { new: true }, // flag to return the updated record
  );

  // console.log(updateRoomMessages);

  let roomMessages = updatedRoomMessages.messages;
  let getLastMessage = [];
  if (roomMessages.length > 0) {
    getLastMessage = roomMessages[roomMessages.length - 1];
  } else {
    getLastMessage = roomMessages[0];
  }

  const getRoom = await Room.find({ roomId: roomId });
  const getRoommates = getRoom[0].mates;
  // console.log('getRoommates: ', getRoommates);
  const matesToReceiveMsg = getRoommates.filter((mate) => mate !== msg.from);
  // .map((x) => x.userId);

  // add roomId to message
  // getLastMessage['roomId'] = roomId;
  // console.log('matesToReceiveMsg ', matesToReceiveMsg);
  // console.log('getLastMessage: ', getLastMessage);
  const addRoomId = {
    userId: getLastMessage.userId,
    message: getLastMessage.message,
    date: getLastMessage.date,
    _id: getLastMessage._id,
    roomId,
  };
  // console.log('addRoomId: ', addRoomId);
  socket.to(matesToReceiveMsg).emit('dm', addRoomId);
};

module.exports.updateGroupName = async (socket, roomId, name, cb) => {
  const hostUserId = socket.user.userId;

  const updateRoomName = await Room.findOneAndUpdate(
    { roomId: roomId },
    { $set: { name: name } },
    { new: true },
  );

  const matesToUpdate = updateRoomName.mates.filter(
    (mate) => mate !== hostUserId,
  );

  socket.to(matesToUpdate).emit('update_group_name', { roomId, name });
  // console.log('updateRoomName: ', updateRoomName);
  cb();
};

module.exports.createGroup = async (socket, data, cb) => {
  const { groupName, members } = data;
  const randomId = crypto.randomUUID();
  const hostUserId = socket.user.userId;
  const extractUserId = members.map((member) => member.userId);
  // console.log('extractUserId: ', extractUserId);
  const groupMembers = [hostUserId, ...extractUserId];

  const room = new Room({
    isGroup: true,
    roomId: randomId,
    mates: groupMembers,
    name: groupName,
  });

  room
    .save()
    .then(async (resp) => {
      // update all members records
      // console.log('resp: ', resp);
      const addToRooms = await Promise.all(
        groupMembers.map(async (userId) => {
          const user = await User.findOneAndUpdate(
            { userId: userId },
            { $push: { rooms: randomId } },
          );
        }),
      );

      const mappedNameToUserId = await mapNameToUserId(groupMembers);
      resp.mates = mappedNameToUserId;

      socket.to(extractUserId).emit('new_group_created', { roomRecord: resp });
      cb({ room });
    })
    .catch((err) => {
      console.log('Saving new group error: ', err);
    });
};

module.exports.addToGroup = async (socket, roomId, userId, cb) => {
  console.log('addToGroup: ', { roomId, userId });
  // get host userId
  const hostUserId = socket.user.userId;
  // get room record
  const updatedRoomRecordWithNewMember = await Room.findOneAndUpdate(
    { roomId: roomId },
    { $push: { mates: userId }, $set: { isGroup: true } },
    { new: true },
  );

  // update new members record with roomId
  const updateNewMemberRecord = await User.findOneAndUpdate(
    { userId: userId },
    { $push: { rooms: roomId } },
    { new: true },
  );

  const mates = updatedRoomRecordWithNewMember.mates;
  const mappedNameToUserId = await mapNameToUserId(mates);
  // console.log('mappedNameToUserId ', mappedNameToUserId);
  updatedRoomRecordWithNewMember.mates = mappedNameToUserId;
  /*console.log(
    'updatedRoomRecordWithNewMember ',
    updatedRoomRecordWithNewMember,
  );*/
  // console.log('mates: ', mates);
  const matesToNotify = mates.filter((mate) => mate !== hostUserId);
  console.log('matesToNotify: ', matesToNotify);
  // notify other sockets in room of new user
  const newGroupMemberFullname = `${updateNewMemberRecord.firstname} ${updateNewMemberRecord.lastname}`;
  socket.to(matesToNotify).emit('new_member_added_to_group', {
    roomId,
    newMemberProfile: {
      userId,
      fullname: newGroupMemberFullname,
    },
    roomRecord: updatedRoomRecordWithNewMember,
  });

  socket.to(userId).emit('update_new_group_member_roomlist', {
    roomRecord: updatedRoomRecordWithNewMember,
  });

  cb({ newGroupMember: { userId: userId, fullname: newGroupMemberFullname } });
};

module.exports.leaveGroup = async (socket, roomId, userId, cb) => {
  // user has the only authority to leave the group
  const hostUserId = socket.user.userId;
  if (hostUserId === userId) {
    // remove roomId from user record
    const removedRoomIdFromUser = await User.findOneAndUpdate(
      { userId: userId },
      { $pull: { rooms: roomId } },
    );
    // remove userId from room records
    const removedUserIdFromRoom = await Room.findOneAndUpdate(
      { roomId: roomId },
      { $pull: { mates: userId } },
      { new: true },
    );
    const { mates } = removedUserIdFromRoom;
    socket.to(mates).emit('left_group_chat', { roomId, userId });
  }
  cb();
};

module.exports.searchUsersDb = async (socket, name, cb) => {
  console.log('name ', name);

  const resp = await User.find(
    {
      $or: [
        { email: { $regex: name, $options: 'i' } },
        { firstname: { $regex: name, $options: 'i' } },
        { lastname: { $regex: name, $options: 'i' } },
      ],
    },
    { email: 1, firstname: 1, lastname: 1, userId: 1 },
  );

  const mergeFirstLastName = resp.map((user) => {
    const username = `${user.firstname} ${user.lastname}`;
    return {
      email: user.email,
      label: username,
      userId: user.userId,
    };
  });

  cb({ resp: mergeFirstLastName });
  // console.log('resp: searchUsersDb ', resp);
};

module.exports.deleteGroup = async (socket, roomId, cb) => {
  const hostUserId = socket.user.userId;
  const room = await Room.find({ roomId: roomId });
  const deleteRoomRecord = await Room.deleteOne({ roomId: roomId });
  const { mates } = room[0];
  const removeRoomId = await Promise.all(
    mates.map(async (userId) => {
      const user = await User.findOneAndUpdate(
        { userId: userId },
        { $pull: { rooms: roomId } },
      );
    }),
  );

  const removedHostUserId = mates.filter((userId) => userId !== hostUserId);
  socket.to(removedHostUserId).emit('remove_room', { roomId });

  cb({ roomId });
};

module.exports.leaveChatRoom = async (
  socket,
  hostUserId,
  userIdToRemove,
  roomId,
  cb,
) => {
  // remove connection from host records
  const hostRecord = await User.findOneAndUpdate(
    { userId: hostUserId },
    { $pull: { rooms: userIdToRemove } },
    { returnDocument: true },
  );
  // remove connection from mates records
  const matesRecord = await User.findOneAndUpdate(
    { userId: hostUserId },
    { $pull: { rooms: hostUserId } },
    { returnDocument: true },
  );

  // delete room's records
  const roomRecordRemoved = await Room.deleteOne({ roomId: roomId });

  // notify user to remove connection
  socket.to(userIdToRemove).emit('remove_room', { roomId });

  // callback to update host's state
  cb({ userIdToRemove, roomId });
};

// add flag to img url
const setFlagForMissingImgUrl = async (messages) => {
  const asyncRes = await Promise.all(
    messages.map(async (msg) => {
      if (msg.hasOwnProperty('isImage')) {
        const imgUrlWorks = await axios
          .get(msg.content)
          .then((resp) => true)
          .catch(() => false);
        msg.urlLinkWorks = imgUrlWorks ? true : false;
      }
      return msg;
    }),
  );
  return Promise.resolve(asyncRes);
};

// https://www.reddit.com/r/reactjs/comments/w22mag/how_to_handle_sending_images_and_videos_in_a_chat/
// https://stackskills.com/courses/181862/lectures/2751724
module.exports.uploadFile = async (socket, fileObj, cb) => {
  const { roomId, userId, fileName, file, isGroup } = fileObj;
  console.log('fileObj: ', fileObj);
  const tmpFileDir = path.join(__dirname, '../tmp/upload');
  // write file to tmp/upload folder
  writeFile(tmpFileDir + '/' + `${fileName}`, file, (err) => {
    // console.log('err: ', err)
    if (err) console.error('upload write file error: ', err);
    // write file success
    // upload file to cloudinary
    cloudinary.uploader
      .upload(tmpFileDir + '/' + fileName, {
        public_id: fileName,
        overwrite: true,
        faces: true,
      })
      .then(async (result) => {
        // console.log(result);
        // delete the stored images from tmp folder
        deleteStoredFile(fileName);
        // destruct { url, public_id, secure_url, asset_id }
        const { url, public_id, secure_url, asset_id } = result;
        // create instance
        const file = new UploadFile({
          cloudinaryUrl: url,
          cloudinarySecureUrl: secure_url,
          cloudinaryAssetId: asset_id,
          name: public_id,
          userId: userId,
        });

        // now save the file
        file
          .save()
          .then(async (resp) => {
            console.log('save resp: ', resp);
            const { _id, createdAt, cloudinaryUrl, cloudinarySecureUrl, name } =
              resp;
            // save
            // convert dateTime str to unix
            const unixDateTime = parseInt(
              new Date(createdAt).getTime() / 1000,
            ).toFixed(0);

            const updateRoomMessages = await Room.findOneAndUpdate(
              { roomId: roomId },
              {
                $push: {
                  messages: {
                    userId,
                    imageUrl: cloudinaryUrl,
                    hasImage: true,
                    name: name,
                    date: unixDateTime,
                    fileId: _id,
                  },
                  uploadFiles: {
                    fileId: _id,
                  },
                },
              },
              { new: true },
            );

            const fileMessageObj = {
              userId,
              roomId,
              imageUrl: cloudinaryUrl,
              hasImage: true,
              name: name,
              date: unixDateTime,
              fileId: _id,
            };
            const mates = updateRoomMessages.mates;
            // const filterOutSenderUserId = mates.filter(mate => mate.userId !== userId)
            socket.to(mates).emit('dm', fileMessageObj);
            // cb({ message: fileMessageObj });
          })
          .catch((err) => {
            console.log('File saving error: ', err);
          });
        // console.log('file: ', file)
      })
      .catch((err) => console.log('Cloudinary upload error', err));
  });
};

const deleteStoredFile = (fileName) => {
  const tmpFileDir = path.join(__dirname, '../tmp/upload');
  stat(tmpFileDir + '/' + fileName, (err, stats) => {
    if (err) {
      return console.error(err);
    }
    unlink(tmpFileDir + '/' + fileName, (err) => {
      if (err) return console.log(err);
      console.log('file deleted successfully');
    });
  });
};

module.exports.onDisconnect = async (socket) => {
  console.log('onDisconnect: ');
  // await redisClient.hset(`userid:${socket.user.userId}`, 'connected', false);
  /*
  const { rooms } = await getRooms(socket);
  const friendRooms = await rooms.map((room) => room.userId);
  socket.to(friendRooms).emit('connected', false, socket.user.userId);*/
};
