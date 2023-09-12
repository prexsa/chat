import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import { useSocketContext } from './socketContext';
// import socket from '../../socket';
import { SocketContext } from "./Chat";
import { MessagesContext } from "./Chat";

/*const MessageSchema = Yup.object({
  message: Yup.string().min(1).max(255)
})*/

function Chatbox({ userID, from }) {
  // console.log('userID: ', userID)
  const textareaRef = useRef(null);
  const { socket } = useContext(SocketContext);
  const { setMessages } = useContext(MessagesContext);
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm();
  const [message, setMessage] = useState("");
  const onSubmit = ({ message }) => {
    if (message.trim() === "") return;
    // console.log('message; ', message)
  };
  const handleOnKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      // console.log('target value: ', e.target.value)
      handleSubmit(onSubmit)();
    }
    // resize textarea as message body increases
    const textareaHeight = parseInt(e.target.style.height);
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.position = "relative";
    // e.target.style.top = `-${Math.floor(e.target.style.fontSize / 2)}px`;
    // e.target.style.top = `${textareaHeight}-${e.target.scrollHeight}px`;
    // console.log('textareaHeight: ', textareaHeight)
    // console.log('e: ',`${e.target.scrollHeight}px`)
    // console.log('value: ', e.target.value)
  };

  const handleOnChange = (e) => {
    // console.log('e: ', e.target.value)
    // reset textarea back to original height if message body is empty
    setMessage(e.target.value);
    if (e.target.value === "") {
      e.target.style.height = "43px";
      e.target.style.position = "relative";
      e.target.style.top = "0px";
    }
  };

  useEffect(() => {
    textareaRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    console.log("textareaRef: ", textareaRef.cu);
  }, [message]);

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ message: "" });
    }
  }, [formState, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea
        inputRef={textareaRef}
        type="text"
        placeholder="type..."
        onKeyDown={handleOnKeyDown}
        {...register("message", {
          onChange: handleOnChange,
        })}
      />
      <input className="chatbox-submit" type="submit" />
    </form>
  );
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
