import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { ModalImageViewer } from '../ModalImageViewer';
import { ModalFileViewer } from '../ModalFileViewer';

const attachmentBox = {
  textAlign: 'center',
  mx: 1,
};

const attachmentHeader = { display: 'flex', justifyContent: 'space-between' };

const textBtn = {
  fontSize: '13px',
  textDecoration: 'underline',
  '&:hover': {
    cursor: 'pointer',
    color: '#1976d2',
  },
};

const ChatAttachments = ({ selectedRoom }) => {
  const [showImages, setShowImages] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const handleImageSelect = (imageId) => {
    setShowImages(true);
    setImgIndex(imageId);
  };

  const handleModalClose = () => {
    setShowImages(false);
    setShowFiles(false);
    setImgIndex(0);
  };

  const handleViewAllMedia = () => setShowImages(true);
  // console.log('imgIndex: ', imgIndex);
  const handleViewAllFiles = () => setShowFiles(true);
  return (
    <>
      <ModalImageViewer
        open={showImages}
        onClose={handleModalClose}
        images={selectedRoom?.uploadFiles}
        imgIndex={imgIndex}
      />
      <ModalFileViewer open={showFiles} onClose={handleModalClose} />
      <Box>
        <Typography variant="h6" sx={{ mt: '10px' }}>
          {selectedRoom?.uploadFiles.length === 0
            ? 'No files to share'
            : 'Shared Attachments'}
        </Typography>
        <Box sx={attachmentBox}>
          <Box sx={attachmentHeader}>
            <Typography component="span">Media</Typography>
            <Typography sx={textBtn} onClick={handleViewAllMedia}>
              View All
            </Typography>
          </Box>
          <ImageList
            sx={{
              width: '100%',
              padding: '5px',
            }}
            cols={2}
            rowHeight={164}
          >
            {selectedRoom?.uploadFiles.map((file, index) => (
              <ImageListItem
                key={file._id}
                onClick={() => handleImageSelect(index)}
                // onClick={() => handleImageSelect(file._id)}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    boxShadow: '0px 0px 2px 1px #2196f3',
                  },
                }}
              >
                <img
                  src={file.cloudinaryUrl}
                  alt={file.name}
                  loading="lazy"
                  style={{
                    height: '150px',
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
          <Box sx={attachmentHeader}>
            <Typography component="span">Files</Typography>
            <Typography sx={textBtn} onClick={handleViewAllFiles}>
              View All
            </Typography>
          </Box>
          <List>
            {['1.pdf', '2.pdf', '3.mp4', '4.mp4'].map((item) => (
              <ListItem
                key={item}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    boxShadow: '0px 0px 2px 1px #BEBEBE',
                    backgroundColor: '#F8F8F8',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <Box sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      color: '#36454F',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    {item}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '13px',
                      color: '#9e9e9e',
                    }}
                  >
                    <Box>file size</Box>
                    <Box>date</Box>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
};

ChatAttachments.propTypes = {
  selectedRoom: PropTypes.array,
};

export default ChatAttachments;
