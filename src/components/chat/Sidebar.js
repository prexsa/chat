import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Badge from '@mui/material/Badge';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';

import { useChat } from '../../context/SocketContext';

/*
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
*/

export default function Sidebar() {
  const { channels, changeRoom } = useChat();
  const [searchTerm, setSearchTerm] = useState('');

  /*
  const handleClear = () => {
    setSearchTerm('');
    // if (onSearch) onSearch('');
  };
  */
  const handleStartChat = (e) => {
    e.preventDefault();
    alert('Start a new chat');
  };

  // Chat list is empty
  if (channels.length == 0) {
    return (
      <React.Fragment>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
          }}
        >
          <ChatBubbleOutlinedIcon
            sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
          />
          <Typography variant="h6" color="text.primary" gutterBottom>
            No conversations yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start a new chat to connect with friends and family.
          </Typography>
          <Button variant="contained" onClick={handleStartChat}>
            New Chat
          </Button>
        </Box>
      </React.Fragment>
    );
  }

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    // if (onSearch) onSearch(e.target.value);
  };

  return (
    <React.Fragment>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={handleChange}
          /*
              inputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClear}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              */
        />
      </Box>

      <Divider />
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {channels.map((chat, index) => {
          return (
            <React.Fragment key={chat.roomId}>
              <ListItem
                alignItems="flex-start"
                onClick={() => changeRoom(index)}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    backgroundColor:
                      '#e0e0e0' /* Optional: slight visual shift */,
                  },
                  p: 2,
                }}
              >
                <ListItemAvatar>
                  <Avatar alt={chat.avatar} src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gridTemplateRows: 'auto auto',
                    width: '100%',
                  }}
                >
                  {/* Quadrant 1: Top-Left */}
                  <Box sx={{ alignSelf: 'flex-start' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {chat.name}
                    </Typography>
                  </Box>

                  {/* Quadrant 2: Top-Right */}
                  <Box
                    sx={{ justifySelf: 'flex-end', alignSelf: 'flex-start' }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      fontWeight="bold"
                    >
                      {chat.time}
                    </Typography>
                  </Box>

                  {/* Quadrant 3: Bottom-Left */}
                  <Box sx={{ alignSelf: 'flex-end' }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1, // Limits the text to exactly 3 lines
                      }}
                    >
                      {chat.messages.length > 0
                        ? chat.messages[chat.messages.length - 1].message
                        : ''}
                    </Typography>
                  </Box>

                  {/* Quadrant 4: Bottom-Right */}
                  <Box
                    sx={{
                      justifySelf: 'flex-end',
                      alignSelf: 'flex-start',
                      marginRight: '10px',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      <Badge badgeContent={3} color="primary"></Badge>
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          );
        })}
      </List>
      <IconButton
        onClick={handleStartChat}
        sx={{
          position: 'absolute',
          bottom: '30px',
          right: '20px',
        }}
      >
        <AddCircleIcon color="primary" sx={{ fontSize: 50 }} />
      </IconButton>
    </React.Fragment>
  );
}
