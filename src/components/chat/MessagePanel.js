import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FriendContext, MessagesContext } from './Main';
import { Box, Typography, List, ListItem } from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

const MessagePanel = ({ user, handleImageSelect }) => {
  const bottomRef = useRef(null);
  const { feedback } = useContext(MessagesContext);
  const { selectedRoom } = useContext(FriendContext);
  // console.log('user: ', selectedRoom);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end', inline: 'nearest' });
  }, [selectedRoom.messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end', inline: 'nearest' });
  }, []);

  const convertToHumanReadable = (unix) => {
    const date = new Date(unix * 1000);
    return date.toLocaleString([], { timeStyle: 'short' });
  };
  // console.log('selectedRoom; ', selectedRoom);

  const getUsername = (userId) => {
    const name = selectedRoom.mates.filter((mate) => mate.userId === userId);
    // console.log('name; ', name);
    if (name.length === 0) {
      return 'User was removed';
    } else {
      return name[0].fullname;
    }
  };

  const renderMessage = (message, displayName, isUser) => {
    const isAnImage = message?.hasImage;

    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: `${isUser ? 'flex-end' : 'flex-start'}`,
            columnGap: '5px',
          }}
        >
          <Typography variant="h6" sx={{ color: '#2196f3', fontSize: '1rem' }}>
            {displayName}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: 14, color: '#9e9e9e' }}>
            at {convertToHumanReadable(message.date)}
          </Typography>
        </Box>
        {isAnImage ? (
          <Box sx={{ '&:hover': { cursor: 'pointer' } }}>
            <img
              src={message.imageUrl}
              alt={message.name}
              style={{ maxWidth: '180px' }}
              onClick={() => handleImageSelect(message.fileId)}
            />
          </Box>
        ) : (
          <Typography variant="subtitles1" sx={{ color: '#616161' }}>
            {message.message}
          </Typography>
        )}
      </Box>
    );
  };

  const renderListItem = (message) => {
    const isUser = message.userId === user.userId;
    const username = getUsername(message.userId);

    return isUser ? (
      <ListItem
        sx={{
          // display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
        }}
      >
        {renderMessage(message, 'You', isUser)}
        <ListItemAvatar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Avatar alt="User" src="/static/images/avatar/2.jpg" />
        </ListItemAvatar>
      </ListItem>
    ) : (
      <ListItem sx={{ alignItems: 'flex-start' }}>
        <ListItemAvatar>
          <Avatar alt={username} src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        {renderMessage(message, username, isUser)}
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
          // check if current message is an image
          // console.log('message: ', message);
          return <Box key={index}>{renderListItem(message)}</Box>;
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
  handleImageSelect: PropTypes.func,
};

export default MessagePanel;
