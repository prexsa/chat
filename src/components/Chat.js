import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import ChannelList from './ChannelList';
import MessagePanel from './MessagePanel';
import socket from '../socket';
import './Chat.css';

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const [socketID, setSocketID] = useState('');

  useEffect(() => {
    const username = location.state.username;
    socket.emit('login', username)
    socket.emit('connected users', username);
  }, [location]);

  const handleSetSocketID = (socketID) => {
    setSocketID(socketID);
  }

  return (
    <div className="chat-container">
      <ChannelList handleSetSocketID={handleSetSocketID} />
      <MessagePanel socketID={socketID} />
    </div>
  )
}

export default Chat;