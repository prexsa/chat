import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FriendContext, MessagesContext } from './Main';
import { Box, List, ListItem } from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import Message from './Message';

const Messages = ({ user, handleImageSelected, handleFileSelected }) => {
  const bottomRef = useRef(null);
  const { feedback } = useContext(MessagesContext);
  const { selectedRoom } = useContext(FriendContext);
  // console.log('user: ', selectedRoom);
  useEffect(() => {
    setTimeout(function () {
      bottomRef.current?.scrollIntoView({ block: 'end', inline: 'nearest' });
    }, 100);
  }, [selectedRoom.messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end', inline: 'nearest' });
  }, []);

  const getUsername = (userId) => {
    const name = selectedRoom.mates.filter((mate) => mate.userId === userId);
    // console.log('name; ', name);
    if (name.length === 0) {
      return 'User was removed';
    } else {
      return name[0].fullname;
    }
  };

  const renderListItem = (message) => {
    const isUser = message.userId === user.userId;
    const username = getUsername(message.userId);

    return isUser ? (
      <ListItem
        sx={{
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
        }}
      >
        <Message
          message={message}
          displayName={''}
          isUser={isUser}
          handleImageSelected={handleImageSelected}
          handleFileSelected={handleFileSelected}
        />
        <ListItemAvatar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Avatar alt="User" src="/static/images/avatar/2.jpg" />
        </ListItemAvatar>
      </ListItem>
    ) : (
      <ListItem sx={{ alignItems: 'flex-start' }}>
        <ListItemAvatar>
          <Avatar alt={username} src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <Message
          message={message}
          displayName={username}
          isUser={isUser}
          handleImageSelected={handleImageSelected}
          handleFileSelected={handleFileSelected}
        />
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

Messages.propTypes = {
  user: PropTypes.object,
  handleImageSelected: PropTypes.func,
  handleFileSelected: PropTypes.func,
};

export default Messages;
