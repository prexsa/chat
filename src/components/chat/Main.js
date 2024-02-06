/* eslint-disable */
import React, { createContext, useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Button,
  Drawer,
  Toolbar,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Chat from './Chat';
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
  }, [channel]);

  useEffect(() => {
    setSocket(() => socketConn(accessToken));
  }, [accessToken]);
  // console.log('socket: ', socket)
  useSocket(
    setFriendList,
    setMessages,
    setUsername,
    channel,
    setChannel,
    setFeedback,
    socket,
  );

  const editToggleHandler = () => setEditProfile(!editProfile);
  const drawerWidth = 300;
  return (
    <FriendContext.Provider
      value={{ friendList, setFriendList, channel, setChannel, username }}
    >
      <SocketContext.Provider value={{ socket }}>
        <MessagesContext.Provider value={{ messages, setMessages, feedback }}>
          <Box sx={{ display: 'flex' }}>
            <Box
              component="nav"
              sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
              aria-label="mailbox folders"
            >
              {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: drawerWidth,
                  },
                }}
                open
              >
                <Sidebar
                  showDrawer={showDrawer}
                  setShowDrawer={setShowDrawer}
                />
              </Drawer>
            </Box>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                // p: 3,
                height: 'auto',
                width: { sm: `calc(100% - ${drawerWidth}px)` },
              }}
            >
              <Chat isGroup={channel.isGroup} />
              {/*
              showDrawer ? (
                <Box sx={{ textAlign: 'Left', padding: '50px' }}>
                  <Button
                    aria-label="back"
                    size="small"
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => setShowDrawer(false)}
                  >
                    Back
                  </Button>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      marginTop: '25px',
                    }}
                  >
                    Profile
                    <IconButton
                      sx={{ marginLeft: '5px' }}
                      color="primary"
                      onClick={editToggleHandler}
                    >
                      <EditIcon sx={{ fontSize: '14px' }} />
                    </IconButton>
                  </Box>
                  <Profile editProfile={editProfile} />
                </Box>
              ) : (
                <Chat isGroup={channel.isGroup} />
              )
              */}
            </Box>
          </Box>
        </MessagesContext.Provider>
      </SocketContext.Provider>
    </FriendContext.Provider>
  );
};

export default Main;

// https://codesandbox.io/p/sandbox/zen-silence-njx9xx?file=%2Fsrc%2FDemo.js%3A33%2C25
