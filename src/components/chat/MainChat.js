import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SendIcon from '@mui/icons-material/Send';

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

export default function MainChat() {
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
                      color: isUser ? 'primary.contrastText' : 'text.primary',
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
    </React.Fragment>
  );
}
