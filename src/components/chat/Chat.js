import { createContext, useState, useEffect } from 'react';
import { SocketProvider } from './socketContext';

import MessagePanel from './MessagePanel';
import Sidebar from './Sidebar';
import './Chat.css';
import socket from '../../socket';
import useSocket from './useSocket';
// import { useUserContext } from '../../userContext';
export const FriendContext = createContext();
export const MessagesContext = createContext();
export const SocketContext = createContext();
// console.log('socketConn: ', socketConn)
// console.log('socket: ', socket)
function Main() {
  const [friendList, setFriendList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState(null);
  const [username, setUsername] = useState('');

  const user = JSON.parse(localStorage.getItem('user'))
  /*const [socket, setSocket] = useState(() => socketConn(user));
  useEffect(() => {
    setSocket(() => socketConn(user));
  }, []);*/

  useSocket(setFriendList, setMessages, setUsername, channel);

  return (
    <FriendContext.Provider value={{ friendList, setFriendList, channel, setChannel }}>
      <SocketContext.Provider value={{ socket }}>
        <div className="chat-container">
          <Sidebar />
          <main>
            <MessagesContext.Provider value={{ messages, setMessages }}>
              <MessagePanel />
            </MessagesContext.Provider>
          </main>
        </div>
      </SocketContext.Provider>
    </FriendContext.Provider>
  )
}

export default Main;

// https://codepen.io/robinllopis/pen/mLrRRB
// https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/