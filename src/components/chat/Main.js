import React, { createContext, useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import Chat from './Chat';
import Sidebar from './Sidebar';
import './Chat.css';
import socketConn from '../../socket';
import useSocket from '../../context/useSocket';
export const FriendContext = createContext();
export const MessagesContext = createContext();
export const SocketContext = createContext();

const Main = () => {
  const draggerRef = useRef();
  const isResized = useRef(false);
  const [minWidth, maxWidth, defaultWidth] = [200, 500, 350];
  const [drawerWidth, setDrawerWidth] = useState(defaultWidth);
  const [roomList, setRoomList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState({
    name: '',
    roomId: '',
    connected: '',
    unreadCount: '',
    lastestMessage: '',
    isGroup: false,
    mates: [],
  });
  const [user, setUser] = useState('');
  const [feedback, setFeedback] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  // const [editProfile, setEditProfile] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  // const user = JSON.parse(localStorage.getItem('user'))
  const accessToken = localStorage.getItem('accessToken');

  const [socket, setSocket] = useState(() => socketConn(accessToken));

  useEffect(() => {
    // console.log('roomList: ', roomList)
    // console.log('chat: ', { channel })
  }, [selectedRoom]);

  useEffect(() => {
    setSocket(() => socketConn(accessToken));
  }, [accessToken]);
  // console.log('socket: ', socket)
  useSocket(
    setRoomList,
    setMessages,
    setUser,
    selectedRoom,
    setSelectedRoom,
    setFeedback,
    setSearchOptions,
    setPendingRequests,
    socket,
  );

  // listener to resize sidebar
  useEffect(() => {
    window.addEventListener('mousemove', (e) => {
      // console.log(e.movementX);
      if (!isResized.current) return;
      setDrawerWidth((previousWidth) => {
        const newWidth = previousWidth + e.movementX / 2;
        const isWidthInRange = newWidth >= minWidth && newWidth <= maxWidth;

        return isWidthInRange ? newWidth : previousWidth;
      });
    });
  }, [setDrawerWidth, isResized]);

  useEffect(() => {
    window.addEventListener('mouseup', () => {
      isResized.current = false;
    });
  }, []);

  // const editToggleHandler = () => setEditProfile(!editProfile);
  // const drawerWidth = 300;
  return (
    <FriendContext.Provider
      value={{
        roomList,
        setRoomList,
        selectedRoom,
        setSelectedRoom,
        user,
        searchOptions,
        setSearchOptions,
        pendingRequests,
        setPendingRequests,
      }}
    >
      <SocketContext.Provider value={{ socket }}>
        <MessagesContext.Provider value={{ messages, setMessages, feedback }}>
          <Box sx={{ display: 'flex' }}>
            <Box
              id="testing"
              sx={{
                display: { xs: 'none', sm: 'block' },
                width: `${drawerWidth / 16}rem`,
              }}
            >
              <Sidebar showDrawer={showDrawer} setShowDrawer={setShowDrawer} />
            </Box>
            {/*  A div used as a right-side border to resize the sidebar */}
            <Box
              ref={draggerRef}
              onMouseDown={() => (isResized.current = true)}
              sx={{
                width: '5px',
                height: '100%',
                backgroundColor: '#ededed',
                '&:hover': {
                  cursor: 'ew-resize',
                  backgroundColor: '#1976d2',
                },
              }}
            ></Box>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                paddingLeft: '10px',
                height: '100vh',
                width: { sm: `calc(100% - ${drawerWidth}px)` },
              }}
            >
              <Chat isGroup={selectedRoom.isGroup} />
              {/*{true ?  : <Video />}*/}
            </Box>
          </Box>
        </MessagesContext.Provider>
      </SocketContext.Provider>
    </FriendContext.Provider>
  );
};

export default Main;

{
  /*<Box
              component="nav"
              sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
              aria-label="mailbox folders"
            >
            </Box>*/
}
{
  /* The implementation can be swapped with js to avoid SEO duplication of links. */
}

{
  /*
            <Drawer
              onMouseDown={() => (isResized.current = true)}
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  // width: '300px',
                  width: `${drawerWidth / 16}rem`,
                  borderRight: '5px solid blue',
                  '&:hover': {
                    cursor: 'ew-resize',
                  },
                },
              }}
              open
            >
              <Box
                ref={draggerRef}
                // onMouseDown={() => (isResized.current = true)}
              >
                <Sidebar
                  showDrawer={showDrawer}
                  setShowDrawer={setShowDrawer}
                />
              </Box>
            </Drawer>
            */
}
// https://codesandbox.io/p/sandbox/zen-silence-njx9xx?file=%2Fsrc%2FDemo.js%3A33%2C25
// https://stackademic.com/blog/building-a-resizable-sidebar-component-with-persisting-width-using-react-tailwindcss
// https://stackblitz.com/edit/react-2h1g6x?file=ResponsiveDrawer.js
