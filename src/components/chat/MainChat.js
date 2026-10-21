import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SendIcon from '@mui/icons-material/Send';

import { useChat } from '../../context/SocketContext';

export default function MainChat() {
  const { activeRoom, messages } = useChat();
  const [inputValue, setInputValue] = useState('');
  console.log({ messages, activeRoom });
  // If no chat has been selected
  if (!activeRoom) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6">Select a chat to start messaging</Typography>
      </Box>
    );
  }

  // Auto-scroll to bottom of chat
  /*
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  */

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // onSendMessage(inputValue);
    setInputValue('');
  };

  const convertToHumanReadable = (unix) => {
    const date = new Date(unix * 1000);
    return date.toLocaleString([], { timeStyle: 'short' });
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <Avatar alt={activeRoom.avatar} src="/static/images/avatar/1.jpg" />
        <List sx={{ listStyleType: 'none', p: 0, m: 0, textAlign: 'left' }}>
          <ListItem sx={{ p: 0, m: 0 }}>{activeRoom.name}</ListItem>
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
            {/* Spacer to force scroll */}
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              // console.log({ msg });
              return (
                <Box
                  key={index}
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
                    {isUser ? 'U' : activeRoom.avatar}
                  </Avatar>

                  {/* Message Bubble Wrapper */}
                  <Box
                    sx={{
                      position: 'relative',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: isUser ? 'primary.main' : 'grey.100',
                      color: isUser ? 'primary.contrastText' : 'text.primary',
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'row',
                      columnGap: '5px',
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Content block inside the bubble */}

                    <Typography variant="body2" sx={{ p: 1 }}>
                      {msg.message}
                    </Typography>

                    {/* Status/Time Meta positioned cleanly inside */}

                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.7,
                        alignSelf: 'flex-end',
                      }}
                    >
                      {convertToHumanReadable(msg.date)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </div>
        </Box>
        <Paper
          component="form"
          onSubmit={handleSendMessage}
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
        >
          {/* Custom MUI Input Template */}
          <TextField
            sx={{ ml: 1, flex: 1 }}
            placeholder="Type a message..."
            variant="standard"
            // inputProps={{ disableUnderline: true }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            // onKeyDown={handleKeyDown}
            multiline
            maxRows={4}
          />
          <IconButton
            color="primary"
            sx={{ p: '10px' }}
            aria-label="send message"
            type="submit"
            // onClick={() => alert('Send message!')}
            // disabled={!message.trim()}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>
    </React.Fragment>
  );
}
