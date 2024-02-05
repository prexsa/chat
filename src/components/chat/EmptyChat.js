import React from 'react';
// import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const EmptyChat = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: 500, margin: '4em auto 0' }}>
      <Typography variant="h1" sx={{ fontSize: '3em' }}>
        Choose a conversation
      </Typography>
      <Typography variant="subtitle1">
        Click on an existing chat or click &quot;New Chat&quot; to create a new
        conversation
      </Typography>
    </Box>
  );
};

export default EmptyChat;
