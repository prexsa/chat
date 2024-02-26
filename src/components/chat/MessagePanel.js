import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FriendContext, MessagesContext } from './Main';
import { Box, Typography, List, ListItem } from '@mui/material';
// import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

const MessagePanel = ({ user }) => {
  const bottomRef = useRef(null);
  const { feedback } = useContext(MessagesContext);
  const { selectedRoom } = useContext(FriendContext);
  // console.log('user: ', selectedRoom);
  useEffect(() => {
    // console.log('picture: ', picture)
    // bottomRef.current?.scrollIntoView({block: "end", behavior: 'smooth'});
    // console.log('bottomRef', selectedRoom);
    bottomRef.current?.scrollIntoView({ block: 'end', inline: 'nearest' });
  }, [selectedRoom.messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end', inline: 'nearest' });
  }, []);

  /*const displayModal = (imgSrc) => {
    // console.log('displayModal; ')
    setShowModal(true);
    // setImages([imgSrc])
    extractAllImagesFromMessages(imgSrc, messages);
  };*/

  const convertToHumanReadable = (unix) => {
    const date = new Date(unix * 1000);
    return date.toLocaleString([], { timeStyle: 'short' });
  };
  // console.log('selectedRoom; ', selectedRoom);
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
              at {convertToHumanReadable(message.date)}
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
    const name = selectedRoom.mates.filter((mate) => mate.userId === userId);
    // console.log('name; ', name);
    return name[0].fullname;
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
              at {convertToHumanReadable(message.date)}
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
    <Box
      className="message-box-container"
      sx={{
        overflowY: 'auto',
        height: `calc(100% -120px)`,
        '&::-webkit-scrollbar': {
          width: '0.4em',
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#9ac1f7',
        },
      }}
    >
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {selectedRoom.messages.map((message, index) => {
          // console.log('messages: ', message, ' user.userId', user.userId);
          return (
            <Box key={index}>
              {message.userId === user.userId
                ? renderUserMessage(message)
                : renderRoommatesMessage(message)}
            </Box>
          );
        })}

        <ListItem ref={bottomRef} className="feedback-typing">
          {feedback ? `typing...` : ''}
        </ListItem>
        <ListItem ref={bottomRef}></ListItem>
      </List>
    </Box>
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
