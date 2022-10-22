import { useState, useEffect, useContext } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { UserContext } from '../userContext';
import ChannelList from './ChannelList';
import MessagePanel from './MessagePanel';
import socket from '../socket';
import './Chat.css';

function Chat() {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [channel, setChannel] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const username = location.state.username;

  useEffect(() => {
    console.log('login')
    socket.emit('login', username)
    // return () => socket.off('login')
  }, [username]);

  useEffect(() => {
    console.log('connected')
    if(user) {
      socket.emit('connected users', username);
    }
    // return () => socket.off('connected users')
  }, [user])

/*  useEffect(() => {
    socket.on('user connected', async function(user) {
      console.log('user: 2', user)
      setUsers([...users, user])
    })

    socket.on('connected users', async function(connectedUsers) {
      console.log('users: ', connectedUsers)
      const removeSelf = connectedUsers.filter(user => user.name !== username)
      const connectedFirst = removeSelf.sort((a, b) => b.connected - a.connected)
      setUsers([...connectedFirst])
    })

    /*return () => {
      socket.off('user connected')
      socket.off('connected users')
    }
  }, [users])*/

  useEffect(() => {
    // console.log('private msg')
    socket.on('user connected', function(user) {
      // console.log('user: 2', user)
      setUsers(prevUsers => [...prevUsers, user])
    })

    socket.on('connected users', function(connectedUsers) {
      // console.log('users: ', connectedUsers)
      const removeSelf = connectedUsers.filter(user => user.name !== username)
      const connectedFirst = removeSelf.sort((a, b) => b.connected - a.connected)
      setUsers([...connectedFirst])
    })

    socket.on('private msg', handleIncomingMessages)
    // return () => socket.disconnect();
  }, [socket])

  const handleIncomingMessages = ({ from, msg, to }) => {
    console.log('from: ', from, 'msg: ', msg, 'to: ', to)
    setMessages(prevMsgs => [...prevMsgs, { from, msg, to }])
    setUsers(prevUsers => {
      prevUsers.map(user => {
        if(user.id === from) {
          user.hasNewMessage = true;
        }
      })
      return [...prevUsers]
    })
  }

  /*useEffect(() => {
    console.log('messages: ', messages)
  }, [messages])*/

/*
  useEffect(() => {
    if(channel !== null) {
      const fetchChannelMsgs = async () => {
        const response = await axios.post('http://localhost:9000/api/channel-messages', { userID: channel.id })
        const data = response.data;
        console.log('response: ', data)
        setMessages([...data.messages])
      }

      fetchChannelMsgs().catch(error => console.log('error: ', error))
    }
  },[channel])*/

  const handleChannel = (channel) => {
    // console.log('channel; ', channel)
    setChannel(channel);
    setUsers(prevUsers => {
      prevUsers.map(user => {
        if(user.id === channel.id) {
          user.hasNewMessage = false;
        }
      })
      return [...prevUsers]
    })
  }

  /*const handleAlertNewMsgs = (userID) => {
    // setNewMessageAlert(userID)
  }*/

  /*const handleClickMe = async () => {
    const response = await axios.get('http://localhost:9000/api/messages')
    console.log('messageStore: ', messages)
  }*/

  if(!user) return;

  return (
    <div className="chat-container">
      {/*<button onClick={handleClickMe}>click me</button>*/}
      <ChannelList handleChannel={handleChannel} users={users} channel={channel} />
      <MessagePanel channel={channel} messages={messages} />
    </div>
  )
}

export default Chat;