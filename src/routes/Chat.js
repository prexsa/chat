import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';

import { IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';
/*
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
*/

// Example message data structure
const messages = [
  {
    id: '1',
    sender: 'assistant',
    text: 'Hello! How can I help you today?',
    time: '10:00 AM',
  },
  {
    id: '2',
    sender: 'user',
    text: 'I need help implementing a MUI chat component.',
    time: '10:01 AM',
  },
  {
    id: '3',
    sender: 'assistant',
    text: 'Hello! How can I help you today?',
    time: '10:00 AM',
  },
  {
    id: '4',
    sender: 'user',
    text: 'I need help implementing a MUI chat component.',
    time: '10:01 AM',
  },
  {
    id: '5',
    sender: 'assistant',
    text: 'Hello! How can I help you today?',
    time: '10:00 AM',
  },
  {
    id: '6',
    sender: 'user',
    text: 'I need help implementing a MUI chat component.',
    time: '10:01 AM',
  },
  {
    id: '7',
    sender: 'assistant',
    text: 'Hello! How can I help you today?',
    time: '10:00 AM',
  },
  {
    id: '8',
    sender: 'user',
    text: 'I need help implementing a MUI chat component.',
    time: '10:01 AM',
  },
  {
    id: '9',
    sender: 'assistant',
    text: 'Hello! How can I help you today?',
    time: '10:00 AM',
  },
  {
    id: '10',
    sender: 'user',
    text: 'I need help implementing a MUI chat component.',
    time: '10:01 AM',
  },
  {
    id: '11',
    sender: 'assistant',
    text: 'Hello! How can I help you today?',
    time: '10:00 AM',
  },
  {
    id: '12',
    sender: 'user',
    text: 'I need help implementing a MUI chat component.',
    time: '10:01 AM',
  },
  {
    id: '13',
    sender: 'assistant',
    text: 'Hello! How can I help you today?',
    time: '10:00 AM',
  },
  {
    id: '14',
    sender: 'user',
    text: 'I need help implementing a MUI chat component.',
    time: '10:01 AM',
  },
];

export default function Chat() {
  const [searchTerm, setSearchTerm] = useState('');

  /*
  const handleClear = () => {
    setSearchTerm('');
    // if (onSearch) onSearch('');
  };
  */

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    // if (onSearch) onSearch(e.target.value);
  };
  return (
    <Box sx={{ backgroundColor: '#f5f8fe' }}>
      <Grid
        container
        sx={{
          height: '100vh',
          borderRadius: '10px',
          border: '1px solid',
          borderColor: 'divider',
          marginLeft: '15px',
          backgroundColor: '#fafcfe',
        }}
      >
        <Grid
          size={4}
          sx={{
            borderRight: '1px solid',
            borderColor: 'divider',
            position: 'relative',
          }}
        >
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
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Brunch this weekend?"
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: 'text.primary', display: 'inline' }}
                    >
                      Ali Connors
                    </Typography>
                    {" — I'll be in your neighborhood doing errands this…"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
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
                    Name
                  </Typography>
                </Box>

                {/* Quadrant 2: Top-Right */}
                <Box sx={{ justifySelf: 'flex-end', alignSelf: 'flex-start' }}>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    fontWeight="bold"
                  >
                    11:11
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
                    Gonna head out for a drive, wanna join?
                    slfj;aslfjsaldfkjas;ldfkjas;flksajdf;laksj;l
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
          </List>
          <IconButton
            onClick={() => alert('Create a new chat')}
            sx={{
              position: 'absolute',
              bottom: '30px',
              right: '20px',
            }}
          >
            <AddCircleIcon color="primary" sx={{ fontSize: 50 }} />
          </IconButton>
        </Grid>
        <Grid size={8}>
          <Box
            sx={{
              p: 1.5,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            <List sx={{ listStyleType: 'none', p: 0, m: 0, textAlign: 'left' }}>
              <ListItem sx={{ p: 0, m: 0 }}>Remy Sharp</ListItem>
              <ListItem sx={{ p: 0, m: 0, color: '#56a4ff', fontSize: '14px' }}>
                online
              </ListItem>
            </List>
          </Box>
          <Box
            sx={{
              backgroundColor: '#fafafa',
              height: 'calc(100vh - 80px)',
              position: 'relative', // Anchors the absolute child
              overflow: 'hidden', // Prevents content from spilling out
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto', // Allows content to scroll behind the input
                p: 2,
                // paddingBottom: '80px', // Prevents bottom content from being hidden by the input
                // height: '80vh',
                marginBottom: '50px',
              }}
            >
              {/* Your scrollable content/chat messages go here */}
              <div>
                <p>Scrollable content start...</p>
                {/* Spacer to force scroll */}
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';

                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        flexDirection: isUser ? 'row-reverse' : 'row',
                        gap: 1,
                        mb: 2,
                        px: 2,
                      }}
                    >
                      {/* Optional User Avatar */}
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {isUser ? 'U' : 'AI'}
                      </Avatar>

                      {/* Message Bubble Wrapper */}
                      <Box
                        sx={{
                          position: 'relative',
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: isUser ? 'primary.main' : 'grey.100',
                          color: isUser
                            ? 'primary.contrastText'
                            : 'text.primary',
                          maxWidth: '70%',
                        }}
                      >
                        {/* Content block inside the bubble */}

                        <Typography variant="body2">{msg.text}</Typography>

                        {/* Status/Time Meta positioned cleanly inside */}

                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {msg.time}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
                <p>Scrollable content end.</p>
              </div>
            </Box>
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                // borderRadius: 2,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
              }}
              onSubmit={(e) => {
                e.preventDefault();
                // handleSend();
              }}
            >
              {/* Custom MUI Input Template */}
              <TextField
                sx={{ ml: 1, flex: 1 }}
                placeholder="Type a message..."
                variant="standard"
                // inputProps={{ disableUnderline: true }}
                // value={message}
                // onChange={(e) => setMessage(e.target.value)}
                // onKeyDown={handleKeyDown}
                multiline
                maxRows={4}
              />
              <IconButton
                color="primary"
                sx={{ p: '10px' }}
                aria-label="send message"
                onClick={() => alert('Send message!')}
                // disabled={!message.trim()}
              >
                <SendIcon />
              </IconButton>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

// https://recipes.mui.com/chat/edit-WtlmwCYacr7yoct41APT
// https://addons.mozilla.org/en-CA/firefox/addon/web-telegram-online/
// https://www.google.com/search?q=mui+chat+messages+component&oq=mui+chat+messages+c&gs_lcrp=EgZjaHJvbWUqBwgBECEYoAEyBggAEEUYOTIHCAEQIRigATIHCAIQIRigATIHCAMQIRigATIHCAQQIRigATIHCAUQIRirAjIHCAYQIRirAjIHCAcQIRirAjIHCAgQIRifBTIHCAkQIRifBdIBCDk5MDhqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8
