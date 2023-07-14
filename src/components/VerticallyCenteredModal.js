import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function VerticallyCenteredModal(props) {
  console.log('props; ', { props })
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="custom-modal-style"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body bsPrefix="custom-modal-body">
        <img
          className="modal-image" 
          src={props.images[0]} 
          alt="" 
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VerticallyCenteredModal;