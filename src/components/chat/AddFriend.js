import { useState, useContext, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
// import socket from '../../socket';
import { FriendContext } from "./Chat";
import { SocketContext } from "./Chat";
// import { useSocketContext } from './socketContext';
// console.log('socket: ', socket)
const AddFriendSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

function AddFriend() {
  const { setFriendList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 2000);
  }, [error]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div>
      <Button onClick={handleShow} size="sm">
        <div className="btn-icon-txt">
          <FaPlus />
          Add a friend
        </div>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a friend</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ name: "" }}
            validateSchema={AddFriendSchema}
            onSubmit={(values, actions) => {
              if (values.name.trim() === "") return;
              socket.connect();
              socket.emit(
                "add_friend",
                values.name,
                ({ errorMsg, done, newFriend }) => {
                  console.log(
                    "add_friend: ",
                    done,
                    "errorMsg: ",
                    errorMsg,
                    " new: ",
                    newFriend,
                  );
                  if (done) {
                    setFriendList((currFriendList) => [
                      newFriend,
                      ...currFriendList,
                    ]);
                    handleClose();
                  } else {
                    setError(errorMsg);
                  }
                  actions.resetForm();
                },
              );
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <h4 className="add-friend-header-txt">Add a friend</h4>
                <div className="form-field">
                  <Field name="name" autoFocus />
                  {errors.name && touched.name ? (
                    <div className="feedback">{errors.name}</div>
                  ) : null}
                </div>
                {error === "" ? (
                  <div className="hidden-txt">hidden</div>
                ) : (
                  <div className="feedback">{error}</div>
                )}
                <Button type="submit" size="sm">
                  Add
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddFriend;
