import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useUserContext } from '../../userContext';
import { FriendContext } from './Main';
import { Box, Typography, Divider, Paper, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerticallyCenteredModal from '../VerticallyCenteredModal';
import Chatbox from './Chatbox';
import MessagePanel from './MessagePanel';
import EmptyChat from './EmptyChat';
import ChatHeader from './ChatHeader';

const Chat = ({ isGroup }) => {
  const { user } = useUserContext();
  const { selectedRoom } = useContext(FriendContext);
  // const [picture, setPicture] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  // console.log('selectedRoom: ', selectedRoom);
  const extractAllImagesFromMessages = async (selectedImgSrc, messages) => {
    const images = await messages.filter(
      (message) => message.hasOwn('isImage') === true,
    );
    let index = 0;
    for (let [key, value] of images.entries()) {
      if (value.content === selectedImgSrc) {
        index = key;
        break;
      }
    }
    setImages(images);
    setImageIndex(index);
  };
  // console.log('selectedRoom: ', selectedRoom);
  if (Object.keys(selectedRoom).length === 0 || selectedRoom.roomId === '') {
    return <EmptyChat />;
  }

  const displayRoommatesName = (roommates) => {
    // console.log('roommates: ', roommates);
    const filtered = roommates.filter((mate) => mate.userId !== user.userId);
    return filtered[0].fullname;
  };

  const getRoomName = () => {
    let name = isGroup
      ? selectedRoom.name
      : displayRoommatesName(selectedRoom.mates);
    return name;
  };

  return (
    <div className="message-panel-container">
      {/* The Modal */}
      <VerticallyCenteredModal
        show={showModal}
        onHide={() => setShowModal(false)}
        images={images}
        activeindex={imageIndex}
      />
      <ChatHeader
        isGroup={isGroup}
        roomId={selectedRoom.roomId}
        roomName={getRoomName()}
        // roomDetails={displayRoommatesName(selectedRoom.mates)}
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
            // picture={picture}
            isGroup={isGroup}
            setShowModal={setShowModal}
            extractAllImagesFromMessages={extractAllImagesFromMessages}
          />
          <Chatbox
            roomId={selectedRoom?.userId || selectedRoom?.roomId}
            from={user.userId}
            isGroup={selectedRoom?.isGroup}
            // picture={picture}
            // handleSetPicture={setPicture}
          />
        </Box>
        <Box sx={{ width: 500 }}>
          <Box sx={{ my: 5, flexDirection: 'column' }}>
            <AccountCircleIcon sx={{ fontSize: 100 }} />
            <Typography variant="subtitle2">Name</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="h6">Shared Photos</Typography>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{
                height: '76vh',
                overflowY: 'auto',
                px: 1,
                paddingBottom: 3,
              }}
            >
              {Array.from(Array(16)).map((_, index) => (
                <Grid item xs={6} key={index}>
                  <Paper sx={{ height: '150px' }}>xs=2</Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

Chat.propTypes = {
  isGroup: PropTypes.bool,
};

export default Chat;
/*
  <div className="message-box-container">
    <ul className="chat">
      {
        messages.map((message, idx) => {
          // console.log('message: ', message)
          // check message if isImage key exist
          const isYou = message.from === null || message.from === user.userId;
          return (
            <li
              key={idx}
              className={`${isYou ? 'you' : ''}`}
            >
              <div className={`icon-message-container ${isYou ? "flex-direction-row-reverse" : "flex-direction-row"}`}>
                <AccountCircleIcon />
                <div className="message-container">
                  <div>
                  {
                    message.hasOwnProperty('isImage') ?
                    <img 
                      className="file-upload-image" 
                      src={message.content} 
                      alt="" 
                      onClick={() => displayModal(message.content)} 
                    />
                    :            
                    message.content
                  }
                  </div>
                </div>
              </div>
              <div>
                {
                  (isYou) ? 
                  null 
                  : 
                  <div className="chat-username-txt">{isGroup ? message.username : selectedRoom.username}</div>
                }
              </div>
            </li>
          )
        })
      }
      <li className="you">
        <div className=" icon-message-container flex-direction-row">
          <img className="file-upload-image" src={picture && picture} alt="" />
        </div>
      </li>
      <li ref={bottomRef} className="feedback-typing">
        {feedback ? `typing...` : ''}
      </li>
      <li ref={bottomRef}></li>
    </ul>
  </div>
*/
