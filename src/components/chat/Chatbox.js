import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SocketContext } from './Chat';
import { MessagesContext } from './Chat';

function Chatbox({ userID, from }) {
  // console.log('userID: ', userID)
  const { socket } = useContext(SocketContext);
  const { setMessages } = useContext(MessagesContext);
  const { register, handleSubmit, reset, formState } = useForm();
  // const { ref, onChange, ...rest } = register('message');
  // const [message, setMessage] = useState('');
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
    if(e.key === 'Enter' && e.shiftKey === false) {
      // console.log('target value: ', e.target.value)
      handleSubmit(onSubmit)();
    }

    /*const el = e.target;
    const comp = window.getComputedStyle(el, null);
    console.log('comp: ', comp.getPropertyValue('font-size'))*/
    // resize textarea as message body increases
    // const textareaHeight = parseInt(e.target.style.height);
    // e.target.style.height = `${e.target.scrollHeight}px`;
    // console.log('scrollHeight: ', e.target.scrollHeight)
    // e.target.style.overflowY = 'hidden';
    // e.target.style.position = 'relative';
    // e.target.style.top = 43 - e.target.scrollHeight
    // e.target.style.top = `-${Math.floor(e.target.style.fontSize / 2)}px`;
    // e.target.style.top = `${textareaHeight}-${e.target.scrollHeight}px`;
    // console.log('textareaHeight: ', textareaHeight)
    // console.log('e: ',`${e.target.scrollHeight}px`)
    // console.log('value: ', e.target.value)
  }

  const handleOnChange = e => {
    // console.log('e: ', e.target.value)
    // reset textarea back to original height if message body is empty
    // setMessage(e.target.value)
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
        onChange={handleOnChange}
        name="message"
        {...register('message')}
      />
      <input className='chatbox-submit' type="submit" />
    </form>
  )
}

export default Chatbox;
        /*
        {...rest}*/