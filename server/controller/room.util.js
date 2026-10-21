const crypto = require('crypto');
const Channel = require('../model/channel.model');

module.exports.createARoomRelationship = async (userId, requesterId) => {
  // create room
  const roomId = crypto.randomUUID();
  const room = new Channel({
    roomId: roomId,
    mates: [userId, requesterId],
  });
  const result = await room.save();

  // update both user records with
  return Promise.resolve({ roomId });
};
