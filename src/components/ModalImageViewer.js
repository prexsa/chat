import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Modal } from './Modal';
import { NoTransitionCarousel } from './Carousel';

const StandardImageList = ({ images, selectImage, index }) => {
  // console.log('images: ', images.images);
  const [isSelected, setIsSelected] = useState(index);

  useEffect(() => {
    // console.log({ index });
    setIsSelected(index);
  }, [index]);
  // console.log({ isSelected });
  return (
    <ImageList
      sx={{ width: 500, maxHeight: '800px', p: '2px' }}
      cols={3}
      //rowHeight={164}
    >
      {images.map((item, itemIndex) => (
        <ImageListItem
          key={itemIndex}
          sx={{
            // m: '1px',
            border: `${isSelected == itemIndex ? '4px solid #2c84f7' : '2px solid transparent'}`,
            '&:hover': { cursor: 'pointer', border: '4px solid #2c84f7' },
          }}
        >
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

export const ModalImageViewer = ({
  open,
  onClose,
  images,
  imgIndex,
  isMultiple = true,
}) => {
  const [imageIndex, setImageIndex] = useState(imgIndex);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setImageIndex(imgIndex);
    // console.log({ images, imgIndex });
  }, [imgIndex]);

  useEffect(() => {
    setTitle(images[imageIndex]?.name);
  }, [images[imageIndex]?.name]);

  const handleImageSelect = (index) => {
    // console.log('imageIndex: ', index);
    setImageIndex(index);
  };

  const handleOnClose = () => {
    setImageIndex('');
    setTitle('');
    onClose();
  };
  // console.log({ images, imgIndex });
  return (
    <Modal
      open={open}
      onClose={handleOnClose}
      title={title === '' ? 'Images' : title}
    >
      <Box sx={{ display: 'flex' }}>
        {isMultiple ? (
          <>
            <Box sx={{ px: '5px', mx: '10px' }}>
              <StandardImageList
                images={images}
                selectImage={handleImageSelect}
                index={imageIndex}
              />
            </Box>
            <NoTransitionCarousel
              imageIndex={imageIndex}
              images={images}
              handleActiveState={handleImageSelect}
            />
          </>
        ) : (
          <Box sx={{ margin: '0 auto' }}>
            <img src={images[imageIndex]?.cloudinaryUrl} loading="lazy" />
            <p>{title}</p>
          </Box>
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
  isMultiple: PropTypes.bool,
};

StandardImageList.propTypes = {
  images: PropTypes.array,
  selectImage: PropTypes.func,
  index: PropTypes.number,
};

// https://dribbble.com/shots/23544133-Web-Chat-UI
