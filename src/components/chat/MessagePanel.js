/* eslint-disable */
import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MessagesContext } from './Main';
import { Box, Typography, List, ListItem } from '@mui/material';
// import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const MessagePanel = ({
  user,
  selectedRoom,
  // picture,
  // isGroup,
  // setShowModal,
  // extractAllImagesFromMessages,
}) => {
  const bottomRef = useRef(null);
  const { messages, feedback } = useContext(MessagesContext);
  console.log('user: ', selectedRoom);
  useEffect(() => {
    // console.log('picture: ', picture)
    // bottomRef.current?.scrollIntoView({block: "end", behavior: 'smooth'});
    bottomRef.current?.scrollIntoView(false);
  }, [messages, feedback]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end', inline: 'nearest' });
  }, []);

  /*const displayModal = (imgSrc) => {
    // console.log('displayModal; ')
    setShowModal(true);
    // setImages([imgSrc])
    extractAllImagesFromMessages(imgSrc, messages);
  };*/

  const renderUserMessage = (message) => {
    return (
      <ListItem
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          // columnGap: '5px',
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'flex-end',
              columnGap: '5px',
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: '#2196f3', fontSize: '1rem' }}
            >
              You
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 14, color: '#9e9e9e' }}>
              at 10:30 AM
            </Typography>
          </Box>
          <Typography variant="subtitles1" sx={{ color: '#616161' }}>
            {message.message}
          </Typography>
        </Box>
        <ListItemAvatar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Avatar alt="User" src="/static/images/avatar/2.jpg" />
        </ListItemAvatar>
      </ListItem>
    );
  };

  const getUsername = (userId) => {
    const name = selectedRoom.mates.filter((mate) => mate.userId !== userId);
    return name[0].username;
  };

  const renderRoommatesMessage = (message) => {
    const username = getUsername(message.userId);

    return (
      <ListItem sx={{ alignItems: 'flex-start' }}>
        <ListItemAvatar>
          <Avatar alt={username} src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'flex-start',
              columnGap: '5px',
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: '#424242', fontSize: '1rem' }}
            >
              {username}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 14, color: '#9e9e9e' }}>
              at 10:30 AM
            </Typography>
          </Box>
          <Typography variant="subtitles1" sx={{ color: '#616161' }}>
            {message.message}
          </Typography>
        </Box>
      </ListItem>
    );
  };

  return (
    <div className="message-box-container">
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {selectedRoom.messages.map((message, index) => {
          console.log('messages: ', message);
          return message.userId === user.userId
            ? renderUserMessage(message)
            : renderRoommatesMessage(message);
        })}

        <ListItem ref={bottomRef} className="feedback-typing">
          {feedback ? `typing...` : ''}
        </ListItem>
        <ListItem ref={bottomRef}></ListItem>
      </List>
    </div>
  );
};

MessagePanel.propTypes = {
  user: PropTypes.object,
  selectedRoom: PropTypes.object,
  isGroup: PropTypes.bool,
  setShowModal: PropTypes.func,
  extractAllImagesFromMessages: PropTypes.func,
};

export default MessagePanel;

/*
      <ul className="chat">
        {messages.map((message, idx) => {
          // console.log("message: ", message);
          // check message if isImage key exist
          const isYou = message.from === null || message.from === user.userId;
          return (
            <li key={idx} className={`${isYou ? 'you' : ''}`}>
              <div
                className={`icon-message-container ${
                  isYou ? 'flex-direction-row-reverse' : 'flex-direction-row'
                }`}
              >
                <AccountCircleIcon />
                <div className="message-container">
                  <div>
                    {message.hasOwn('isImage') ? (
                      message.urlLinkWorks ? (
                        <img
                          className="file-upload-image"
                          src={message.content}
                          alt=""
                          onClick={() => displayModal(message.content)}
                        />
                      ) : (
                        <>
                          <ImageNotSupportedIcon />
                          <Box sx={{ color: '#808080', fontSize: '10px' }}>
                            Image not available
                          </Box>
                        </>
                      )
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              </div>
              <div>
                {isYou ? null : (
                  <div className="chat-username-txt">
                    {isGroup ? message.username : selectedRoom.username}
                  </div>
                )}
              </div>
            </li>
          );
        })}
        <li ref={bottomRef} className="feedback-typing">
          {feedback ? `typing...` : ''}
        </li>
        <li ref={bottomRef}></li>
      </ul>
      */
