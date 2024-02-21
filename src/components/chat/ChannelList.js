/* eslint-disable */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { FriendContext, SocketContext } from './Main';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Button,
  Autocomplete,
  Tooltip,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Snackbar,
} from '@mui/material';
import AddFriendRFH from './AddFriend.RFH';
import RequestToConnect from './RequestToConnect';

const movies = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
];

function ChannelList({ user }) {
  const { roomList, setRoomList, selectedRoom, setSelectedRoom } =
    useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  // const [activeIndex, setActiveIndex] = useState(null);
  const [isActive, setIsActive] = useState('');

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

  roomList.filter((room) => {
    const roommates = room.mates;
  });

  const clearRoomSelected = () => {
    setSelectedRoom({ userId: '' });
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
            <Autocomplete
              freeSolo
              options={movies}
              sx={{ width: 250 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Search friends..."
                />
              )}
            />
          </>
        ) : null}
        <AddFriendRFH roomList={roomList} />
      </Box>
      <Button className="btn btn-link" onClick={clearRoomSelected}>
        Clear Message Panel
      </Button>
      <RequestToConnect />
      <List dense={false} sx={{ mt: 2 }}>
        {roomList &&
          roomList.map((room) => {
            // console.log('room: ', room);
            // check if room is active, clear out unreadCount
            room.unreadCount =
              room.roomId === selectedRoom.roomId ? 0 : room.unreadCount;

            return (
              <ListItem
                key={room.roomId}
                onClick={() => handleChannelSelect(room)}
                sx={{
                  alignItems: 'flex-start',
                  padding: '18px 10px',
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
                  sx={{ my: 0 }}
                  primary={displayRoommatesName(room.mates)}
                  secondary={
                    room.messages.length > 0
                      ? room.messages[room.messages.length - 1].message
                      : null
                  }
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    // margin: '6px 0',
                  }}
                >
                  <Typography variant="caption">
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

/*
<ul>
        {roomList &&
          roomList.map((friend, index) => {
            console.log('friend: ', friend);
            // clear unreadCount if channel is active
            if (friend.userId === channel.userId) {
              friend.unreadCount = 0;
            }
            return (
              <li
                className={`${
                  activeIndex === index ? 'active-list-item' : ''
                } list-item-cntr`}
                key={friend?.userId || friend?.roomId}
                onClick={() => onChannelSelect(friend, index)}
              >
                <AccountCircleIcon className="faUserCicle-channelList" />
                <div className="list-item-right">
                  <div className="list-item-right-header">
                    <h3 className="header-item-name">
                      {friend?.username || friend?.title}
                    </h3>
                    <div className="header-item-time">10:30 PM</div>
                  </div>
                  <div className="message-alerts">
                    <p className="snippet">
                      {friend.isImage
                        ? '"image.^/jpg/png/"'
                        : friend.latestMessage}
                    </p>
                    <div className="newMessages">
                      {friend.unreadCount === '0' ||
                      friend.unreadCount === 0 ? (
                        <CheckIcon className="faCheck-img" />
                      ) : (
                        <span className={setBadgeCSS(friend.unreadCount)}>
                          {friend.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>

*/
