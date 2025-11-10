/* eslint-disable */
import React, { Fragment, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { FriendContext } from './Main';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Button,
  Typography,
  List,
  ListItemButton,
  // ListItemText,
  ListItemAvatar,
  Avatar,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
/*
import AddFriend from '../AddFriend';
import PendingRequests from './PendingRequests';
import CreateGroup from './CreateGroup';
*/
import SearchChat from './SearchChat';

function ChannelList({ user }) {
  const { roomList, setRoomList, selectedRoom, setSelectedRoom } =
    useContext(FriendContext);
  const [isActive, setIsActive] = useState('');

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

  // console.log('roomList; ', list);
  return (
    <div className="channel-list-cntr">
      <Button className="btn btn-link" onClick={clearRoomSelected}>
        Clear Message Panel
      </Button>

      {roomList.length > 0 && (
        <SearchChat roomList={roomList} setList={setList} user={user} />
      )}
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

      <List
        dense={false}
        sx={{
          mt: 2,
          width: '100%',

          bgcolor: 'background.paper',
        }}
      >
        {list &&
          list.map((room) => {
            // console.log('room: ', room);
            // check if room is active, clear out unreadCount
            room.unreadCount =
              room.roomId === selectedRoom.roomId ? 0 : room.unreadCount;

            return (
              <Fragment key={room.roomId}>
                <ListItemButton
                  // key={room.roomId}
                  onClick={() => handleChannelSelect(room)}
                  sx={{
                    alignItems: 'center',
                    padding: '18px 10px',
                    // textWrap: 'nowrap',
                    color: '#2c333d',
                    '&.Mui-selected': {
                      backgroundColor: '#f6f6f6',
                      boxShadow: '1px 1px 4px -2px rgba(0,0,0,0.75);',
                    },
                    '&:hover': {
                      cursor: 'pointer',
                      backgroundColor: '#dcdcdc',
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
                  <Box
                    className="channel-list-message-container"
                    sx={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box className="left-side-div name-and-latest-message">
                      <Typography
                        sx={{
                          textOverflow: 'clip',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          color: 'text.primary',
                          display: 'inline',
                          fontWeight: 'bold',
                          letterSpacing: '0.4px',
                        }}
                      >
                        {room.isGroup
                          ? room.name
                          : displayRoommatesName(room.mates)}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          textOverflow: 'clip',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {room.messages.length > 0 ? (
                          room.messages[room.messages.length - 1].message
                        ) : (
                          <Box
                            sx={{
                              visibility: 'hidden',
                              color: '#8C8C8C',
                              fontWeight: 500,
                              fontSize: 14,
                            }}
                          >
                            Empty
                          </Box>
                        )}
                      </Typography>
                    </Box>

                    <Box
                      className="right-side-div"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        // width: '30%',
                      }}
                    >
                      <Typography
                        className="time-container"
                        variant="caption"
                        sx={{
                          textWrap: 'nowrap',
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#8C8C8C',
                        }}
                      >
                        {room.messages.length > 0
                          ? convertToHumanReadable(
                              room.messages[room.messages.length - 1].date,
                            )
                          : null}
                      </Typography>
                      <Typography
                        className="message-indicator"
                        variant="caption"
                      >
                        {room.unreadCount > 0 ? (
                          room.unreadCount
                        ) : (
                          <CheckIcon
                            sx={{ color: '#0d6efd' }}
                            fontSize="small"
                          />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </ListItemButton>
                <Divider component="li" />
              </Fragment>
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

// https://dribbble.com/shots/22135190-Floakly-Messaging
