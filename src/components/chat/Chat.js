import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useUserContext } from '../../context/userContext';
import { FriendContext } from '../chat/Main';
import { Box, Typography, Divider } from '@mui/material';
import { ModalImageViewer } from '../ModalImageViewer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Chatbox from '../Forms/Chatbox';
import MessagePanel from './MessagePanel';
import EmptyChat from './EmptyChat';
import ChatHeader from './ChatHeader';
import ChatAttachments from './ChatAttachments';

const Chat = ({ isGroup }) => {
  // const gridRef = useRef(null);
  // const parRef = useRef(null);
  const { user } = useUserContext();
  const { selectedRoom } = useContext(FriendContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState('');
  /*
  useEffect(() => {
    if (gridRef.current !== null) {
      console.log('gridRef: ', gridRef.current);
    }

    if (parRef.current !== null) {
      console.log('parRef: ', parRef.current.clientHeight);
    }
  }, [gridRef, parRef]);
  */

  if (Object.keys(selectedRoom).length === 0 || selectedRoom.roomId === '') {
    return <EmptyChat />;
  }
  // console.log('selectedRoom: ', selectedRoom);
  const mapNameToUserId = (roommates) => {
    // console.log('roommates: ', roommates);
    const filtered = roommates.filter((mate) => mate.userId !== user.userId);
    return filtered[0].fullname;
  };

  const getRoomName = () => {
    let name = isGroup
      ? selectedRoom.name
      : mapNameToUserId(selectedRoom.mates);
    return name;
  };

  const handleImageSelect = (imageId) => {
    setShowModal(true);
    setSelectedImageId(imageId);
  };

  return (
    <div className="message-panel-container">
      <ModalImageViewer
        open={showModal}
        onClose={() => setShowModal(false)}
        images={selectedRoom?.uploadFiles}
        selectedImageId={selectedImageId}
      />
      <ChatHeader
        isGroup={isGroup}
        roomId={selectedRoom.roomId}
        roomName={getRoomName()}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '97vh',
            width: '100%',
            borderRight: '1px solid #eaeef2',
          }}
        >
          <MessagePanel
            user={user}
            selectedRoom={selectedRoom}
            isGroup={isGroup}
            setShowModal={setShowModal}
            handleImageSelect={handleImageSelect}
          />
          <Chatbox
            roomId={selectedRoom?.userId || selectedRoom?.roomId}
            from={user.userId}
            isGroup={selectedRoom?.isGroup}
          />
        </Box>
        <Box sx={{ width: 500 }}>
          <Box sx={{ my: 5, flexDirection: 'column' }}>
            <AccountCircleIcon sx={{ fontSize: 100 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontSize: '18px', mt: '10px' }}
            >
              {getRoomName()}
            </Typography>
          </Box>
          <Divider />
          <ChatAttachments selectedRoom={selectedRoom} />
        </Box>
      </Box>
    </div>
  );
};

Chat.propTypes = {
  isGroup: PropTypes.bool,
};

export default Chat;
