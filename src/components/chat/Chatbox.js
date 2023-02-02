import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SocketContext, MessagesContext } from './Chat';

function Chatbox({ userID, from }) {
  // console.log('userID: ', userID)
  const { socket } = useContext(SocketContext);
  const { setMessages } = useContext(MessagesContext);
  const { register, handleSubmit, reset, formState } = useForm();
  const [feedbackToggle, setFeedbackToggle] = useState(false);
  const onSubmit = (data) => {
    // console.log('data: ', data)
    if(data.message.trim() === "") return;
    // console.log('message; ', message)
    const message = {
      to: userID,
      from: from,
      content: data.message
    }
    // onMessageSend(message);
    // console.log('message: ', message)
    socket.connect();
    socket.emit('dm', message);
    // console.log('message: ', message)
    setMessages(prevMsg => {
      return [...prevMsg, message]
    })
  }

  const handleOnKeyDown = e => {
    // console.log('e: ', e.target.value)
    if(e.key === 'Enter' && e.shiftKey === false) {
      // console.log('target value: ', e.target.value)
      setFeedbackToggle(false);
      const feedback = {
        userID,
        showFeedback: false
      }
      socket.connect();
      socket.emit('feedback_typing', feedback)
      handleSubmit(onSubmit)();
    }
  }

  const handleOnChange = e => {
    // reset textarea back to original height if message body is empty
    // setMessage(e.target.value)
    if(!feedbackToggle) {
      setFeedbackToggle(true);
      const feedback = {
        userID,
        showFeedback: true
      }
      socket.connect();
      socket.emit('feedback_typing', feedback)
    }
    if(e.target.value === "") {
      e.target.style.height = "43px";
      e.target.style.position = 'relative';
      e.target.style.top = '0px';
    }
  }

  useEffect(() => {
    if(formState.isSubmitSuccessful) {
      reset({ message: ''})
    }
  }, [formState, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea
        className="chatbox-textarea"
        type="text"
        placeholder="type..."
        onKeyDown={handleOnKeyDown}
        // onChange={handleOnChange}
        name="message"
        {...register('message', {
          onChange: handleOnChange
        })}
      />
      <input className='chatbox-submit' type="submit" />
    </form>
  )
}

export default Chatbox;