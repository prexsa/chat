import { useContext, useEffect, useState } from 'react';
import { FaPaperclip } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { SocketContext, MessagesContext } from './Chat';
// https://refine.dev/blog/how-to-multipart-file-upload-with-react-hook-form/#create-express-server
// https://www.commoninja.com/blog/handling-multiple-uploads-react-hook-form#Creating-the-Functions-for-Image-Preview-and-Handling-Form-Submission
function Chatbox({ userID, from, handleSetPicture }) {
  // console.log('userID: ', userID)
  const { socket } = useContext(SocketContext);
  const { setMessages } = useContext(MessagesContext);
  const { register, handleSubmit, reset, formState } = useForm();
  const [feedbackToggle, setFeedbackToggle] = useState(false);
  // const [picture, setPicture] = useState(null)

  const onSubmit = (data) => {
    console.log('data: ', data)
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
  const onFileSubmit = data => {
    console.log('data: ', data.file)
    console.log('name: ', data.file[0].name)
    /*const formData = new FormData()
    formData.append('file', data.file[0]);
    console.log('formData: ', { formData })*/
    const fileName = data.file[0].name
    const file = data.file[0]
    socket.emit('upload_file', ({ fileName, file }), (resp) => {
      console.log('file upload cb: ', { resp })
    })
  }

  const onChangePicture = (e) => {
    handleSetPicture(URL.createObjectURL(e.target.files[0]))
    // setPicture(URL.createObjectURL(e.target.files[0]))
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
    <>
    {/*<img className="image" style={{width: '100px'}} src={picture && picture} alt="" />*/}
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
    <form onSubmit={handleSubmit(onFileSubmit)}>
      <input 
        type="file" 
        accept="image/png, image/jpeg" 
        name="file" 
        {...register('file', {
          onChange: onChangePicture
        })} 
      />
      <input type="submit" />
      <FaPaperclip />
    </form>
    </>
  )
}

export default Chatbox;