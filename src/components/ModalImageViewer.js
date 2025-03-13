import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Modal } from './Modal';
import { NoTransitionCarousel } from './Carousel';

const StandardImageList = ({ images, selectImage }) => {
  // console.log('images: ', images.images);
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {images.map((item, itemIndex) => (
        <ImageListItem key={itemIndex}>
          <img
            // srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={item.cloudinaryUrl}
            alt={item.name}
            loading="lazy"
            onClick={() => selectImage(itemIndex)}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export const ModalImageViewer = ({ open, onClose, images, imgIndex }) => {
  const [imageIndex, setImageIndex] = useState(imgIndex);

  useEffect(() => {
    setImageIndex(imgIndex);
  }, [imgIndex]);

  const handleImageSelect = (index) => {
    setImageIndex(index);
  };

  return (
    <Modal open={open} onClose={onClose} title={'Images'}>
      <Box>
        {imageIndex == null ? (
          <StandardImageList images={images} selectImage={handleImageSelect} />
        ) : (
          <NoTransitionCarousel imageIndex={imageIndex} images={images} />
        )}
      </Box>
    </Modal>
  );
};

ModalImageViewer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  images: PropTypes.array,
  imgIndex: PropTypes.number,
};

StandardImageList.propTypes = {
  images: PropTypes.array,
  selectImage: PropTypes.func,
};

// https://dribbble.com/shots/23544133-Web-Chat-UI
