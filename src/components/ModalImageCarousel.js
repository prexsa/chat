import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from './chat/Modal';
import { NoTransitionCarousel } from './Carousel';

export const ModalImageCarousel = ({
  open,
  onClose,
  images,
  selectedImageId,
}) => {
  // console.log('images: ', images, 'selectedImageId: ', selectedImageId);
  return (
    <Modal open={open} onClose={onClose} title={'Shared Images'}>
      <NoTransitionCarousel imageId={selectedImageId} images={images} />
    </Modal>
  );
};

ModalImageCarousel.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  images: PropTypes.array,
  selectedImageId: PropTypes.string,
};
