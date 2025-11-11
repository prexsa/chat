/* eslint-disable */
import React, { createContext, useState, useEffect, useRef } from 'react';
import { Box, Divider } from '@mui/material';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Chat from './Chat';
import Sidebar from './Sidebar';
import AddFriend from '../AddFriend';
import PendingRequests from './PendingRequests';
import CreateGroup from './CreateGroup';
import './Chat.css';
import socketConn from '../../socket';
import useSocket from '../../context/useSocket';
export const FriendContext = createContext();
export const MessagesContext = createContext();
export const SocketContext = createContext();

import Logout from '../Forms/Logout';

const Switch = ({ value, children }) => {
  const matchingChild = children.find((child) => child.props.when === value);
  return matchingChild || null;
};

const Case = ({ children }) => children;
const Default = ({ children }) => children;

const Main = () => {
  const draggerRef = useRef();
  const isResized = useRef(false);
  // const [minWidth, maxWidth, defaultWidth] = [200, 500, 350];
  // const [drawerWidth, setDrawerWidth] = useState(defaultWidth);
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
  const [activeListItem, setActiveListItem] = useState('contacts');

  // const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    // setAnchorEl(null);
  };

  // const open = Boolean(anchorEl);

  const handleClick = (event) => {
    // setAnchorEl(event.currentTarget);
  };
  // const user = JSON.parse(localStorage.getItem('user'))
  const accessToken = localStorage.getItem('accessToken');

  const [socket, setSocket] = useState(() => socketConn(accessToken));

  const handleOnClick = (name) => setActiveListItem(name);

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
  /*
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
  */

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
          <Box
            style={{
              padding: '15px',
              backgroundColor: '#fcfbfc',
              height: '100%',
              // maxWidth: 360,
              width: 300,
              textAlign: 'left',
              borderRight: '2px solid #dedede',
            }}
          >
            <Box
              component={'section'}
              sx={{ borderBottom: '2px solid #dedede', padding: '10px 0' }}
            >
              <h2>Chat App</h2>
            </Box>
            <Box
              component={'section'}
              sx={{ borderBottom: '2px solid #dedede', padding: 2 }}
            >
              <h5>Menu</h5>
              <List component="nav" aria-labelledby="sidebar-nav" dense="true">
                <ListItemButton onClick={() => handleOnClick('add')}>
                  <ListItemIcon>
                    <PeopleAltOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add" />
                </ListItemButton>
                <ListItemButton onClick={() => handleOnClick('groups')}>
                  <ListItemIcon>
                    <GroupAddOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Groups" />
                </ListItemButton>
                <ListItemButton onClick={() => handleOnClick('messages')}>
                  <ListItemIcon>
                    <MessageOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Messages" />
                </ListItemButton>
              </List>
            </Box>
            <Box
              component={'section'}
              sx={{
                // borderBottom: '2px solid #dedede',
                padding: 2,
              }}
            >
              <List component="nav" aria-labelledby="sidebar-nav" dense="true">
                <ListItemButton onClick={() => handleOnClick('profile')}>
                  <ListItemIcon>
                    <AccountCircleOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" />
                </ListItemButton>
              </List>
            </Box>
            <Box id="basic-menu">
              <Logout handleCloseMenu={handleClose} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', width: '100%' }}>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                paddingLeft: '10px',
                height: '100vh',
                // width: { sm: `calc(100% - ${drawerWidth}px)` },
              }}
            >
              <Switch value={activeListItem}>
                <Case when="add">
                  <Box sx={{ padding: 5 }}>
                    <h2>Add</h2>
                    <Box sx={{ textAlign: 'left' }}>
                      <Box sx={{ margin: '25px 0' }}>
                        <h4>Requests</h4>
                        <PendingRequests />
                      </Box>
                      <Box sx={{ margin: '25px 0' }}>
                        <h4>Add to contacts</h4>
                        <AddFriend />
                      </Box>
                      <Divider />
                      <Box>List of contacts</Box>
                    </Box>
                  </Box>
                </Case>
                <Case when="groups">
                  <CreateGroup />
                </Case>
                <Case when="messages">
                  <Chat isGroup={selectedRoom.isGroup} />
                </Case>
                <Case when="profile">
                  <div>Profile</div>
                </Case>

                <Default>
                  <div>dashboard</div>
                </Default>
              </Switch>

              {/*{true ?  : <Video />}*/}
            </Box>
          </Box>
        </MessagesContext.Provider>
      </SocketContext.Provider>
    </FriendContext.Provider>
  );
};

export default Main;
