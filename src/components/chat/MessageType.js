import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

const MessageType = ({ message, handleImageSelected, handleFileSelected }) => {
  // console.log(message);
  const isMedia = message?.isMedia;
  // console.log({ isMedia });
  // message is plain text
  if (!isMedia)
    return (
      <Typography
        variant="subtitles1"
        sx={{ color: '#000000', fontWeight: 500, fontSize: '15px' }}
      >
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

MessageType.propTypes = {
  message: PropTypes.object,
  handleImageSelected: PropTypes.func,
  handleFileSelected: PropTypes.func,
};

export default MessageType;
