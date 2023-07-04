import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FriendContext, SocketContext } from './Chat';

function AddFriend() {
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
    socket.emit("add_friend", data.name, ({ errorMsg, done, newFriend }) => {
      console.log('add_friend: ', done,'errorMsg: ', errorMsg, ' new: ', newFriend)
      if(done) {
        setFriendList(currFriendList => [newFriend, ...currFriendList])
        reset({ name: ''})
        handleClose();
      } else {
        setRespErr(errorMsg);
        reset({ name: '' })
      }
    })
  }

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  return (
    <div>
      <Button onClick={handleShow} size="sm">
        <div className="btn-icon-txt"><FaPlus />Add a friend</div>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a friend</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <h4 className="add-friend-header-txt">Add a friend</h4>
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
            <Button type="submit" size="sm">Add</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AddFriend;