import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'react-bootstrap';

export const NoTransitionCarousel = ({ imageId, images }) => {
  const [index, setIndex] = useState(0);
  // console.log('activeIndex: ', activeIndex)
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    const activeIndex = images.map((image) => image._id).indexOf(imageId);
    setIndex(activeIndex);
  }, [imageId]);
  // console.log('images: ', images)
  return (
    <Carousel
      interval={null}
      activeIndex={index}
      slide={false}
      onSelect={handleSelect}
      indicators={false}
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
              <div>Name: {image.name}</div>
            </Carousel.Item>
          );
        })}
    </Carousel>
  );
};

NoTransitionCarousel.propTypes = {
  imageId: PropTypes.string,
  images: PropTypes.array,
};
