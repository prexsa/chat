import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { convertToHumanReadable } from '../../utils/chatSterilizeHelperFunc';
import MessageType from './MessageType';

const Message = ({
  message,
  displayName,
  isUser,
  handleImageSelected,
  handleFileSelected,
}) => {
  return (
    <Box>
      <Box
        className="bubble-name-time-container"
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
          sx={{ fontSize: '14px', color: '#474747', fontWeight: 600 }}
        >
          {displayName}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: '14px',
            color: '#a1a1a1',
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {convertToHumanReadable(message.date)}
        </Typography>
      </Box>
      <Box className={isUser ? 'speech-bubble-right' : 'speech-bubble-left'}>
        <MessageType
          message={message}
          handleImageSelected={handleImageSelected}
          handleFileSelected={handleFileSelected}
        />
      </Box>
    </Box>
  );
};

Message.propTypes = {
  message: PropTypes.object,
  displayName: PropTypes.string,
  isUser: PropTypes.bool,
  handleImageSelected: PropTypes.func,
  handleFileSelected: PropTypes.func,
};

export default Message;
