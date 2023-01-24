import { createContext, useState, useEffect } from 'react';
import MessagePanel from './MessagePanel';
import Sidebar from './Sidebar';
import './Chat.css';
import socketConn from '../../socket';
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

  // const user = JSON.parse(localStorage.getItem('user'))
  const accessToken = localStorage.getItem('accessToken');

  const [socket, setSocket] = useState(() => socketConn(accessToken));
  useEffect(() => {
    setSocket(() => socketConn(accessToken));
  }, [accessToken]);
// console.log('socket: ', socket)
  useSocket(setFriendList, setMessages, setUsername, channel, socket);

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
// https://codepen.io/arthak/pen/oWEwqB