import React from 'react';
import { Box, Typography, Fab, CardMedia } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';

const Video = () => {
  return (
    <Box
      sx={{
        display: 'relative',
        // flexDirection: 'column',
        border: '1px solid',
        height: '100vh',
        // justifyContent: 'center',
        // alignItems: 'center',
      }}
    >
      <Typography variant="h6">Video Chat</Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          rowGap: '10px',
          columnGap: '10px',
        }}
      >
        {Array.from(Array(4)).map((_, index) => (
          <CardMedia
            key={index}
            sx={{
              p: 2,
              textAlign: 'center',
              backgroundColor: '#fff',
              border: '1px solid',
              height: '500px',
              width: '500px',
            }}
          >
            <Fab sx={{ float: 'right' }} aria-label="voice-icon">
              <KeyboardVoiceIcon />
            </Fab>
          </CardMedia>
        ))}
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Typography variant="subtitle1">Controls</Typography>
        <Box
          sx={{
            '& > :not(style)': { m: 2 },
            // backgroundColor: 'rgba(0,0,0, 0.05)',
            p: 2,
            width: 'fit-content',
            margin: 'auto',
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50px',
          }}
        >
          <Fab color="primary" aria-label="hangup">
            <CallIcon />
          </Fab>
          <Fab
            sx={{
              backgroundColor: '#f44336',
              color: '#fff',
              '&:hover': { backgroundColor: '#e57373' },
            }}
            aria-label="end-call"
          >
            <CallEndIcon />
          </Fab>
        </Box>
      </Box>
    </Box>
  );
};

export default Video;
