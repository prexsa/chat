import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FriendContext } from './Main';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  InputAdornment,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import AddFriendRFH from '../Forms/AddFriend.RFH';
import RequestToConnect from './RequestToConnect';
import CreateGroup from './CreateGroup';

function ChannelList({ user }) {
  const { roomList, setRoomList, selectedRoom, setSelectedRoom } =
    useContext(FriendContext);
  // const { socket } = useContext(SocketContext);
  // const [activeIndex, setActiveIndex] = useState(null);
  const [isActive, setIsActive] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [list, setList] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  const handleChannelSelect = (room) => {
    // console.log('handleChannelSelect, ', room);
    setIsActive(room.roomId);
    setSelectedRoom(room);

    // clear out unreadCount
    setRoomList((prevRoom) => {
      return [...prevRoom].map((room) => {
        if (room.roomId === room.roomId) {
          room.unreadCount = 0;
        }
        return room;
      });
    });
  };

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredRoomsByTermFound = roomList.filter((room) => {
      const found = room.mates.filter((mate) => {
        return mate.fullname.toLowerCase().includes(searchTerm.toLowerCase());
      });
      if (found.length > 0) return room;
    });

    setList([...filteredRoomsByTermFound]);
  };

  const clearRoomSelected = () => {
    setSelectedRoom({});
    setIsActive('');
  };
  // console.log({ selectedRoom, roomList });
  const displayRoommatesName = (roommates) => {
    const filtered = roommates.filter((mate) => mate.userId !== user.userId);
    return filtered[0].fullname;
  };

  const convertToHumanReadable = (unix) => {
    const date = new Date(unix * 1000);
    return date.toLocaleString([], { timeStyle: 'short' });
  };

  const handleTabChange = (e, newValue) => {
    if (newValue === 1) {
      const privateRooms = roomList.filter((room) => !room.isGroup);
      setList([...privateRooms]);
    } else if (newValue === 2) {
      const groupRooms = roomList.filter((room) => room.isGroup);
      setList([...groupRooms]);
    } else {
      setList([...roomList]);
    }
    setTabValue(newValue);
  };

  useEffect(() => {
    if (roomList.length > 0) {
      setList([...roomList]);
    }
  }, [roomList]);

  useEffect(() => {
    if (searchTerm === '') {
      setList([...roomList]);
    }
  }, [searchTerm]);

  // console.log('roomList; ', list);
  return (
    <div className="channel-list-cntr">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          padding: '15px 10px',
          // boxShadow: '1px 1px 4px 1px rgba(192,192,192,0.5)',
          backgroundColor: '#fdfdfe',
        }}
      >
        {roomList && roomList.length > 0 ? (
          <>
            <SearchIcon
              sx={{
                color: 'action.active',
                mr: 1,
                my: 0.5,
              }}
            />
            <TextField
              variant="standard"
              label="Type to search"
              onChange={handleInputChange}
              value={searchTerm}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CloseIcon
                      sx={{
                        '&:hover': {
                          cursor: 'pointer',
                          boxShadow: '0 0 5px 0 rgba(0,0,0,0.5)',
                          borderRadius: '50%',
                        },
                      }}
                      onClick={() => setSearchTerm('')}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </>
        ) : null}
        <AddFriendRFH roomList={roomList} />
      </Box>
      <Button className="btn btn-link" onClick={clearRoomSelected}>
        Clear Message Panel
      </Button>
      <RequestToConnect />
      <CreateGroup />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label="All" aria-controls="tab-panel-all" />
          <Tab label="Private" aria-controls="tab-panel-private" />
          <Tab label="Group" aria-controls="tab-panel-group" />
        </Tabs>
      </Box>

      <List dense={false} sx={{ mt: 2 }}>
        {list &&
          list.map((room) => {
            // console.log('room: ', room);
            // check if room is active, clear out unreadCount
            room.unreadCount =
              room.roomId === selectedRoom.roomId ? 0 : room.unreadCount;

            return (
              <ListItem
                key={room.roomId}
                onClick={() => handleChannelSelect(room)}
                sx={{
                  alignItems: 'center',
                  padding: '18px 10px',
                  // textWrap: 'nowrap',
                  color: '#2c333d',
                  '&.Mui-selected': {
                    backgroundColor: '#f8fbfc',
                    boxShadow: '1px 1px 4px -2px rgba(0,0,0,0.75);',
                    borderRight: '3px solid #2c84f7',
                  },
                  '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: '#dcdcdc',
                    boxShadow: '2px 6px 15px -2px rgba(0,0,0,0.75);',
                  },
                  '&:active': {
                    backgroundColor: 'fbfbf9',
                    boxShadow: '2px 6px 15px -2px rgba(0,0,0,0.75);',
                  },
                }}
                selected={isActive === room.roomId}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ paddingRight: '10px' }}
                  primary={
                    <Typography
                      sx={{
                        textOverflow: 'clip',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                      }}
                    >
                      {room.isGroup
                        ? room.name
                        : displayRoommatesName(room.mates)}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        textOverflow: 'clip',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {room.messages.length > 0
                        ? room.messages[room.messages.length - 1].message
                        : null}
                    </Typography>
                  }
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    // padding: '5px',
                    // marginTop: '5px',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ textWrap: 'nowrap', margin: '5px 0' }}
                  >
                    {room.messages.length > 0
                      ? convertToHumanReadable(
                          room.messages[room.messages.length - 1].date,
                        )
                      : null}
                  </Typography>
                  <Typography variant="caption">
                    {room.unreadCount > 0 ? (
                      room.unreadCount
                    ) : (
                      <CheckIcon sx={{ color: '#0d6efd' }} fontSize="small" />
                    )}
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
      </List>
    </div>
  );
}

ChannelList.propTypes = {
  user: PropTypes.object,
};

export default ChannelList;

// https://www.uplabs.com/posts/chat-ui-design-0b930711-4cfd-4ab4-b686-6e7785624b16
