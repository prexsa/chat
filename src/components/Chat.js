import { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { useSocketContext } from '../socketContext';
import ChannelList from './ChannelList';
import MessagePanel from './MessagePanel';
import './Chat.css';

function Chat() {
  // const lastMessageRef = useRef();
  const location = useLocation();
  const { loginSocket, user } = useSocketContext();
  const username = location.state.username;
// console.log('user: ', user)
  useEffect(() => {
    // console.log('how oftern')
    loginSocket(username)
  }, [username])

  if(!user) return;

  return (
    <div className="chat-container">
      {/*<button onClick={handleClickMe}>click me</button>*/}
      <aside>
        <ChannelList />
      </aside>
      <main>
        <MessagePanel />
      </main>
    </div>
  )
}

export default Chat;

// https://codepen.io/robinllopis/pen/mLrRRB
// https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/