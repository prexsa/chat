import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Carousel from './Carousel';

const VerticallyCenteredModal = ({ activeindex, images, ...props }) => {
  // console.log('props activeIndex; ', props.activeindex)
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="custom-modal-style"
    >
      <Modal.Header closeButton>
        {/*<Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>*/}
      </Modal.Header>
      <Modal.Body bsPrefix="custom-modal-body">
        <Carousel activeIndex={activeindex} images={images} />
      </Modal.Body>
      {/*<Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>*/}
    </Modal>
  );
};

VerticallyCenteredModal.propTypes = {
  activeindex: PropTypes.number,
  images: PropTypes.array,
};

export default VerticallyCenteredModal;
