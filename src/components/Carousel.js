import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'react-bootstrap';
import { Box } from '@mui/system';

/*********************
 * 
  CSS File: App.css
  Next/Prev arrow positioning are adjusted to sit outside the borders
  of the image, instead of on the image
 * 
***********************/

export const NoTransitionCarousel = ({
  imageIndex,
  images,
  handleActiveState,
}) => {
  const handleSelect = (nextIndex) => {
    handleActiveState(nextIndex);
  };

  /*
  useEffect(() => {
    const activeIndex = images.map((image) => image._id).indexOf(imageIndex);
    setIndex(activeIndex);
  }, [imageIndex]);
*/
  // console.log('images: ', images)
  return (
    <Carousel
      interval={null}
      activeIndex={imageIndex}
      slide={false}
      onSelect={handleSelect}
      indicators={false}
      // onSlide={(eventkey, e) => console.log({ eventkey, e })}
    >
      {images &&
        images.map((image, imgIndex) => {
          return (
            <Carousel.Item key={imgIndex}>
              <img
                className="modal-image"
                src={image.cloudinaryUrl}
                alt={image.name}
              />
              <Box sx={{ textAlign: 'center', my: 1, fontSize: '18px' }}>
                {image.name}
              </Box>
            </Carousel.Item>
          );
        })}
    </Carousel>
  );
};

NoTransitionCarousel.propTypes = {
  imageIndex: PropTypes.number,
  images: PropTypes.array,
  handleActiveState: PropTypes.func,
};
