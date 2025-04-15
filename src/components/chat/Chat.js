/* eslint-disable */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useUserContext } from '../../context/userContext';
import { FriendContext } from '../chat/Main';
import { Box, Typography, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ModalImageViewer } from '../ModalImageViewer';
import { ModalFileViewer } from '../ModalFileViewer';
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
  const [showImage, setShowImage] = useState(false);
  const [showFile, setShowFile] = useState(false);
  const [image, setImage] = useState([]);
  const [file, setFile] = useState([]);
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

  const filterFiles = (id) =>
    selectedRoom.uploadFiles.filter((file) => file._id === id);

  const handleImageSelect = (fileId) => {
    const file = filterFiles(fileId);
    // console.log({ file });
    setShowImage(true);
    setImage(file);
  };

  const handleFileSelect = (fileId) => {
    const file = filterFiles(fileId);

    setShowFile(true);
    setFile(file);
  };

  return (
    <div className="message-panel-container">
      <ModalImageViewer
        open={showImage}
        onClose={() => setShowImage(false)}
        images={image}
        imgIndex={0}
        isMultiple={false}
      />
      <ModalFileViewer
        open={showFile}
        onClose={() => setShowFile(false)}
        files={file}
        fileIndex={0}
        isMultiple={false}
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
            // setShowModal={setShowModal}
            handleImageSelected={handleImageSelect}
            handleFileSelected={handleFileSelect}
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
