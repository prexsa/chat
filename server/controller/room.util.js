const crypto = require('crypto');
const Room = require('../model/room.model');

module.exports.createARoomRelationship = async (userId, requesterId) => {
  // create room
  const roomId = crypto.randomUUID();
  const room = new Room({
    roomId: roomId,
    mates: [userId, requesterId],
  });
  const result = await room.save();

  // update both user records with
  return Promise.resolve({ roomId });
};
