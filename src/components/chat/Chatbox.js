import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { SocketContext, MessagesContext } from './Main';
import { Box, Button, TextField, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FileUpload from './FileUpload';
// https://refine.dev/blog/how-to-multipart-file-upload-with-react-hook-form/#create-express-server
// https://www.commoninja.com/blog/handling-multiple-uploads-react-hook-form#Creating-the-Functions-for-Image-Preview-and-Handling-Form-Submission
const Chatbox = ({ userId, from, isGroup, picture }) => {
  // console.log('userID: ', userId)
  const { socket } = useContext(SocketContext);
  const { setMessages } = useContext(MessagesContext);
  const { register, handleSubmit, reset, formState } = useForm();
  const [feedbackToggle, setFeedbackToggle] = useState(false);

  const onSubmit = (data) => {
    // console.log("data: ", data);
    if (data.message.trim() === '') return;
    // console.log('message; ', message)
    const message = {
      to: userId,
      from: from,
      content: data.message,
      isGroup,
    };
    // onMessageSend(message);
    // console.log('message: ', message)
    socket.connect();
    socket.emit('dm', message);
    // console.log('message: ', message)
    setMessages((prevMsg) => {
      return [...prevMsg, message];
    });
  };

  const handleOnKeyDown = (e) => {
    console.log('e: ', e.target.value);
    if (e.key === 'Enter' && e.shiftKey === false) {
      // console.log('target value: ', e.target.value)
      setFeedbackToggle(false);
      const feedback = {
        userId,
        showFeedback: false,
      };
      socket.connect();
      socket.emit('feedback_typing', feedback);
      handleSubmit(onSubmit)();
    }
  };

  const handleOnChange = () => {
    // reset textarea back to original height if message body is empty
    // console.log('e; ', e.target.value)
    // setMessage(e.target.value)
    if (!feedbackToggle) {
      setFeedbackToggle(true);
      const feedback = {
        userId,
        showFeedback: true,
      };
      socket.connect();
      socket.emit('feedback_typing', feedback);
    }
    /*if(e.target.value === "") {
      e.target.style.height = "43px";
      e.target.style.position = 'relative';
      e.target.style.top = '0px';
    }*/
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ message: '' });
    }
  }, [formState, reset]);

  return (
    <div className="chatbox-container">
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
        <FileUpload
          userId={userId}
          from={from}
          isGroup={isGroup}
          picture={picture}
        />
        <Box
          component="form"
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            placeholder="Enter message..."
            InputLabelProps={{ shrink: false }}
            fullWidth
            // multiline
            onKeyDown={handleOnKeyDown}
            type="text"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    endIcon={<SendIcon />}
                  >
                    Send
                  </Button>
                </InputAdornment>
              ),
            }}
            name="message"
            {...register('message', {
              onChange: handleOnChange,
            })}
          />
        </Box>
      </Box>
      <br />
    </div>
  );
};

Chatbox.propTypes = {
  userId: PropTypes.string,
  from: PropTypes.string,
  isGroup: PropTypes.bool,
  picture: PropTypes.string,
};

export default Chatbox;
/*
<form>
  <div className="file-upload">
    <label htmlFor="file">
      <FaPaperclip className="faPaperclip" />
    </label>
    <input 
      type="file" 
      id="file"
      accept="image/png, image/jpeg" 
      name="file" 
      {...register('file', {
        onChange: onChangePicture
      })} 
    />
  </div>
</form>
<form className="textarea-form">
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
*/
