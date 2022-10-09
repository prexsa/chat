import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import socket from '../socket';

const useChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [users, setUsers ] = useState([]);


  const sendMessage = (msg) => {
    // console.log('msg: ', msg)
    // socketRef.current.emit('chat', msg)
  }

  const join = (username) => {
    socket.auth = {username: username}
    socket.connect();
    /*setTimeout(() => {
      socket.disconnect()
    }, 1000)*/
  }

  const getAllUsers = () => {

  }

  const removeUser = (id) => {

  }

  return { messages, sendMessage, join, users, getAllUsers, removeUser };
}

export default useChat;