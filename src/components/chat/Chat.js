import { createContext, useState, useEffect } from 'react';
import { Box, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessagePanel from './MessagePanel';
import Sidebar from './Sidebar';
import Profile from '../Profile.RFH';
import './Chat.css';
import socketConn from '../../socket';
import useSocket from './useSocket';
export const FriendContext = createContext();
export const MessagesContext = createContext();
export const SocketContext = createContext();

// console.log('socketConn: ', socketConn)
// console.log('socket: ', socket)
const Main = () => {
  const [friendList, setFriendList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState({
    username: '',
    userId: '',
    connected: '',
    unreadCount: '',
    lastestMessage: '',
    isGroup: false,
  });
  const [username, setUsername] = useState('');
  const [feedback, setFeedback] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  // const user = JSON.parse(localStorage.getItem('user'))
  const accessToken = localStorage.getItem('accessToken');

  const [socket, setSocket] = useState(() => socketConn(accessToken));

  useEffect(() => {
    // console.log('friendList: ', friendList)
    // console.log('chat: ', { channel })
  }, [channel])

  useEffect(() => {
    setSocket(() => socketConn(accessToken));
  }, [accessToken]);
// console.log('socket: ', socket)
  useSocket(setFriendList, setMessages, setUsername, channel, setChannel, setFeedback, socket);

  const editToggleHandler = () => setEditProfile(!editProfile);

  return (
    <FriendContext.Provider value={{ friendList, setFriendList, channel, setChannel, username }}>
      <SocketContext.Provider value={{ socket }}>
        <div className="chat-container">
          <MessagesContext.Provider value={{ messages, setMessages, feedback }}>
            <Sidebar showDrawer={showDrawer} setShowDrawer={setShowDrawer} />
            <main>
            {
              showDrawer ?
              <Box sx={{ textAlign: 'Left', padding: '50px' }}>
                <Button aria-label="back" size="small" color="primary" startIcon={<ArrowBackIcon />} onClick={() => setShowDrawer(false)}>
                  Back
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginTop: '25px' }}>
                  Profile 
                  <IconButton sx={{ marginLeft: '5px' }} color="primary" onClick={editToggleHandler}>
                    <EditIcon sx={{ fontSize: '14px' }} />
                  </IconButton>
                </Box>
                <Profile editProfile={editProfile} />
              </Box>
              :
              <MessagePanel isGroup={channel.isGroup} />
            }
            </main>
          </MessagesContext.Provider>
        </div>
      </SocketContext.Provider>
    </FriendContext.Provider>
  )
}

export default Main;