import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FriendContext, MessagesContext } from './Main';
import { Box, Typography, List, ListItem } from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

const MessagePanel = ({ user, handleImageSelected, handleFileSelected }) => {
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

  const renderMessageType = (message) => {
    // console.log(message);
    const isMedia = message?.isMedia;
    // console.log({ isMedia });
    // message is plain text
    if (!isMedia)
      return (
        <Typography variant="subtitles1" sx={{ color: '#212f3d' }}>
          {message.message}
        </Typography>
      );

    const fileType = message?.name.split('.').pop();
    const mediaType = ['jpg', 'jpeg', 'png'];

    if (isMedia && mediaType.indexOf(fileType) === -1) {
      return (
        <Box sx={{ '&:hover': { cursor: 'pointer' } }}>
          <Box
            sx={{
              display: 'flex',
              alignContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <ArticleOutlinedIcon />
            <Box
              sx={{ ml: '5px', color: 'blue' }}
              onClick={() => handleFileSelected(message.fileId)}
            >
              {message.name}
            </Box>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box sx={{ '&:hover': { cursor: 'pointer' } }}>
          <img
            src={message.imageUrl}
            alt={message.name}
            style={{ maxWidth: '180px' }}
            onClick={() => handleImageSelected(message.fileId)}
          />
        </Box>
      );
    }
  };

  const renderMessage = (message, displayName, isUser) => {
    return (
      <Box>
        <Box className={isUser ? 'speech-bubble-right' : 'speech-bubble-left'}>
          {renderMessageType(message)}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: `${isUser ? 'flex-end' : 'flex-start'}`,
            columnGap: '15px',
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: '#1b2631', fontSize: '0.9rem', fontWeight: 600 }}
          >
            {displayName}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '0.8rem',
              fontWeight: 500,
              color: '#839192',
              textAlign: isUser ? 'right' : 'left',
            }}
          >
            {convertToHumanReadable(message.date)}
          </Typography>
        </Box>
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
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        {renderMessage(message, '', isUser)}
        <ListItemAvatar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Avatar alt="User" src="/static/images/avatar/2.jpg" />
        </ListItemAvatar>
      </ListItem>
    ) : (
      <ListItem sx={{ alignItems: 'flex-end' }}>
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
  handleImageSelected: PropTypes.func,
  handleFileSelected: PropTypes.func,
};

export default MessagePanel;

// https://dribbble.com/shots/25125233-Message-Education-Management-System-LMS
