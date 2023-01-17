import { useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
// import { useSocketContext } from './socketContext';
// import socket from '../../socket';
import { SocketContext } from './Chat';
import { MessagesContext } from './Chat';

const MessageSchema = Yup.object({
  message: Yup.string().min(1).max(255)
})

function Chatbox({ userID, from }) {
  // console.log('userID: ', userID)
  const { socket } = useContext(SocketContext);
  // console.log('socket: ', socket)
  const { setMessages } = useContext(MessagesContext);
  // const { onMessageSend, handleTypingIndicator } = useSocketContext();
  return (
    <Formik
      initialValues={{ message: '' }}
      validateSchema={MessageSchema}
      onSubmit={(values, actions) => {
        // console.log('values: ', values)
        if(values.message.length <= 0) return;
        const message = {
          to: userID,
          from: from,
          content: values.message
        }
        // onMessageSend(message);
        // console.log('message: ', message)
        socket.connect();
        socket.emit('dm', message);
        // console.log('message: ', message)
        setMessages(prevMsg => {
          return [...prevMsg, message]
        })
        actions.resetForm();
      }}
    >
      <Form>
        <Field
          as="textarea"
          type="text"
          name="message"
          placeholder="Type your message"
          rows="3"
          autoComplete="off"
        ></Field>
        <button type="submit" size="lg">
          Send
        </button>
      </Form>
    </Formik>
  )
}

export default Chatbox;


/*
  const handleSubmit = (e) => {
    e.preventDefault();
    if(channel === null) return;
    if(inputVal === '') return;
    onMessageSend(inputVal.trim())
    setInputVal("");
  }
  const handleOnChange = (e) => {
    setInputVal(e.target.value);
  }

  const debounce = (cb, delay = 1000) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  }

  const throttle = (cb, delay = 1000) => {
    let shouldWait = false;
    return (...args) => {
      if(shouldWait) return;
      cb(...args);
      shouldWait = true;
      setTimeout(() => {
        shouldWait = false;
      }, delay)
    }
  }

  const onKeyDownHandler = useMemo(
    () => debounce((channel) => {
      // socket.emit('typing', {toggleState: true, to: channel.id})
    }, 1000)
  , [])
*/