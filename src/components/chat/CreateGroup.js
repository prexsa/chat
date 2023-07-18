import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaUsers } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FriendContext, SocketContext } from './Chat';

function CreateGroup({ friends }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { setFriendList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [respErr, setRespErr] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRespErr('')
    }, 2000)
  }, [respErr]);

  const handleOnSubmit = data => {
    // console.log('data: ', data)
    if(data.name.trim() === "") return;
    socket.connect();
    socket.emit('create_group', data, (resp) => {
      console.log('resp: ', resp)
      setFriendList(prev => {
        return [resp, ...prev]
      })
    })
  }

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  
  return (
    <div>
      <Button onClick={handleShow} size="sm">
        <div className="btn-icon-txt"><FaUsers /></div>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <h4 className="add-friend-header-txt">Group Name</h4>
            <div className="form-field">
              <input name="name" autoFocus {...register('name', {required: "Name is required."})} />
              {errors?.name && errors?.name.message ? (
                <div className="text-danger">{errors?.name.message}</div>
              ) : null}
            </div>
            {
              respErr === '' ?
                <div className="hidden-txt">hidden</div>
              :
                <div className="text-danger">{respErr}</div>
            }
            <Button type="submit" size="sm">Create</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CreateGroup;