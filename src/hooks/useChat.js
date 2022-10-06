import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { UsersContext } from '../usersContext';

const useChat = () => {
  const navigate = useNavigate();
  // const { users, setUsers } = useContext(UsersContext)
  const [messages, setMessages] = useState([]);
  const [users, setUsers ] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:9000");

    socketRef.current.on('chat', function(msg) {
      // console.log('msg: ', msg)
      setMessages(messages => [...messages, msg])
      // setList([...list, ...[msg]])
    });

    socketRef.current.on('users', function(loginUsers) {
      console.log('usrs: ', loginUsers)
      setUsers([...users, ...loginUsers])
    })

    socketRef.current.on('login', async function(users) {
      console.log('users: ', users)
      const stored = await localStorage.setItem('user', JSON.stringify(users))
      navigate('/chat')
    })

    socketRef.current.on('remove', async function() {
      const removedUser = await localStorage.removeItem('user');
      navigate('/')
    })

    // close the connection
    return () => socketRef.current.close();
  }, []);

  useEffect(() => {
    console.log('messages: ', messages)
  }, [messages])

  const sendMessage = (msg) => {
    // console.log('msg: ', msg)
    socketRef.current.emit('chat', msg)
  }

  const join = (username) => {
    // console.log('username: ', username)
    socketRef.current.emit('login', username)
  }

  const getAllUsers = () => {
    socketRef.current.emit('users');
  }

  const removeUser = (id) => {
    socketRef.current.emit('remove', id)
  }

  return { messages, sendMessage, join, users, getAllUsers, removeUser };
}

export default useChat;