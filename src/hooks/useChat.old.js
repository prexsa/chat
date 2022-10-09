import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const useChat = () => {
  const navigate = useNavigate();
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

    socketRef.current.on('remove', async function() {
      const removedUser = await localStorage.removeItem('user');
      navigate('/')
      window.location.reload();
    })
    // close the connection
    // return () => socketRef.current.close();
  }, [users]);


  useEffect(() => {
    socketRef.current.on('user connected', async function(user) {
      console.log('user: 2', user)
      setUsers([...users, user])
    })

    socketRef.current.on('connected users', async function(connectedUsers) {
      console.log('users: ', users)
      setUsers([...connectedUsers])
    })

    socketRef.current.on('private msg', function({ from, msg }) {
      console.log('from: ', from, ' msg: ', msg)
    })

  }, [])

  useEffect(() => {
    socketRef.current.on('private msg', function({ from, msg }) {
      console.log('from: ', from, ' msg: ', msg)
    })
  }, [messages])

  const sendMessage = (msg) => {
    // console.log('msg: ', msg)
    socketRef.current.emit('chat', msg)
  }

  const join = (username) => {
    // console.log('username: ', username)
    socketRef.current.emit('login', username)
  }

  const joinPrivateMsg = (userSocketID, msg) => {
    socketRef.current.emit('private msg', { to: userSocketID, msg });
  }

  const getConnectedUsers = (username) => {
    socketRef.current.emit('connected users', username);
  }

  const getAllUsers = () => {
    // console.log('username: ', username)
    socketRef.current.emit('all users');
  }

  const removeUser = (username) => {
    socketRef.current.emit('remove', username)
  }

  return { messages, sendMessage, join, users, getConnectedUsers, getAllUsers, removeUser, joinPrivateMsg };
}

export default useChat;