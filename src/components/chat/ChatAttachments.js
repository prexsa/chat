import React, { useState, useEffect } from 'react';
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
import { ModalFileViewer, formatDate, formatSize } from '../ModalFileViewer';

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
  const [imgIndex, setImgIndex] = useState(null);
  const [showFiles, setShowFiles] = useState(false);
  const [fileIndex, setFileIndex] = useState(null);
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  // console.log('selectedRoom: ', selectedRoom);
  useEffect(() => {
    // parse message for images/files
    const newImages = [];
    const newFiles = [];

    selectedRoom?.uploadFiles.map((file) => {
      // console.log('file: ', file);
      const imageFileTypes = ['jpg', 'jpeg', 'png'];
      const parseForFileType = file.name.split('.').pop();

      if (
        imageFileTypes.indexOf(file?.type) >= 0 ||
        imageFileTypes.indexOf(parseForFileType) >= 0
      ) {
        // setImages([file]);
        newImages.push(file);
      } else {
        // setFiles([file]);
        newFiles.push(file);
      }
    });

    setImages([...newImages]);
    setFiles([...newFiles]);
  }, [selectedRoom?.uploadFiles]);

  const handleImageSelect = (imageId) => {
    setShowImages(true);
    setImgIndex(imageId);
  };

  const handleFileSelect = (index) => {
    setShowFiles(true);
    setFileIndex(index);
  };

  const handleModalClose = () => {
    setShowImages(false);
    setShowFiles(false);
    setImgIndex(0);
  };

  // filters out files that have been deleted
  const updateFileState = (fileId) => {
    setFiles((prevState) => prevState.filter((file) => file._id !== fileId));
  };

  const handleViewAllMedia = () => setShowImages(true);
  // console.log('imgIndex: ', imgIndex);
  const handleViewAllFiles = () => setShowFiles(true);
  return (
    <>
      {showFiles && (
        <ModalFileViewer
          open={showFiles}
          onClose={handleModalClose}
          files={files}
          fileIndex={fileIndex}
          updateParentFileState={updateFileState}
        />
      )}
      {showImages && (
        <ModalImageViewer
          open={showImages}
          onClose={handleModalClose}
          images={images}
          imgIndex={imgIndex}
        />
      )}
      <Box>
        {images.length === 0 ? null : (
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
              {images.slice(0, 3).map((file, index) => (
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
          </Box>
        )}
        {files.length === 0 ? null : (
          <Box sx={attachmentBox}>
            <Box sx={attachmentHeader}>
              <Typography component="span">Files</Typography>
              <Typography sx={textBtn} onClick={handleViewAllFiles}>
                View All
              </Typography>
            </Box>
            <List>
              {files.slice(0, 3).map((file, index) => (
                <ListItem
                  key={index}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                      boxShadow: '0px 0px 2px 1px #BEBEBE',
                      backgroundColor: '#F8F8F8',
                    },
                  }}
                  onClick={() => handleFileSelect(index)}
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
                      {file.name}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '13px',
                        color: '#9e9e9e',
                      }}
                    >
                      <Box>{formatSize(file.size)}</Box>
                      <Box>{formatDate(file.createdAt)}</Box>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </>
  );
};

ChatAttachments.propTypes = {
  selectedRoom: PropTypes.array,
};

export default ChatAttachments;
