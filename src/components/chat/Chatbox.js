import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import { useSocketContext } from './socketContext';
// import socket from '../../socket';
import { SocketContext } from './Chat';
import { MessagesContext } from './Chat';

/*const MessageSchema = Yup.object({
  message: Yup.string().min(1).max(255)
})*/

function Chatbox({ userID, from }) {
  // console.log('userID: ', userID)
  const { socket } = useContext(SocketContext);
  const { setMessages } = useContext(MessagesContext);
  const { register, handleSubmit, reset, formState, formState: { errors, isSubmitSuccessful }} = useForm();
  const onSubmit = ({ message }) => {
    if(message.trim() === "") return;
    console.log('message; ', message)
  }
  const handleOnKeyDown = e => {
    if(e.key === 'Enter' && e.shiftKey === false) {
      // console.log('target value: ', e.target.value)
      handleSubmit(onSubmit)();
    }
  }

  useEffect(() => {
    if(formState.isSubmitSuccessful) {
      reset({ message: ''})
    }
  }, [formState, reset])
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea
        type="text"
        placeholder="type..."
        onKeyDown={handleOnKeyDown}
        {...register("message")}
      />
      <input className='chatbox-submit' type="submit" />
    </form>
  )
}

export default Chatbox;
/*<Formik
  initialValues={{ message: '' }}
  validateSchema={MessageSchema}
  onSubmit={(values, actions) => {

    console.log('values: ', values.message.trim().length)
    if(values.message.trim() === "") return;
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
{({ handleSubmit }) => (
  <Form
    onSubmit={handleSubmit}
    onKeyDown={e => {
      if(e.key === "Enter") handleSubmit();
    }}
  >
    <Field
      as="textarea"
      type="text"
      // validate={validateEmptyStr}
      name="message"
      placeholder="Type your message"
      rows="3"
      autoComplete="off"
    ></Field>
    <button type="submit">
      Send
    </button>
  </Form>
  )}
</Formik>*/


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