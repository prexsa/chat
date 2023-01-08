import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import socket from '../../socket';
import { useSocketContext } from './socketContext';
// console.log('socket: ', socket)
const AddFriendSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required')
})

function AddFriend() {
  const { user, users, channel, selectChannel, logoff, setFriendList } = useSocketContext();
  const [error, setError] = useState("");
  return (
    <Formik
      initialValues={{ name: ''}}
      validateSchema={AddFriendSchema}
      onSubmit={(values, actions) => {
        // console.log('values: ', values)
        socket.connect();
        socket.emit("add_friend", values.name, ({ errorMsg, done, newFriend}) => {
          console.log('add_friend: ', done,'errorMsg: ', errorMsg, ' new: ', newFriend)
          if(done) {
            actions.resetForm()
            setFriendList(currFriendList => [newFriend, ...currFriendList])
          } else {
            setError(errorMsg)
          }
        })
      }}
    >
    {({ errors, touched }) => (
      <Form>
        <div>{error}</div>
        <div className="form-field">
          <label htmlFor="username">Add a friend</label>
          <Field name="name" />
          {errors.name && touched.name ? (
            <div className="feedback">{errors.name}</div>
          ) : null}
        </div>
        <button type="submit">Submit</button>
      </Form>
    )}
    </Formik>
  )
}

export default AddFriend;