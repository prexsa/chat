import React, { useContext, useState } from 'react';
import { FriendContext, SocketContext } from './Main';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Autocomplete, TextField, Typography } from '@mui/material';
import AddFriendRFH from './AddFriend.RFH';

const movies = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
];

function ChannelList() {
  const { friendList, setFriendList, channel, setChannel } =
    useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [activeIndex, setActiveIndex] = useState(null);

  const onChannelSelect = (channelObj, index) => {
    // console.log('channel: ', channelObj)
    setActiveIndex(index);
    setChannel({
      ...channelObj,
      username: channelObj?.username || channelObj?.title,
      isGroup: channelObj.hasOwn('roomId'),
      // checks whether channel is a group, group has 'roomId' instead of 'userId'
    });
    if (channelObj.userId === '' && index === null) return;
    // get messages for channel
    setFriendList((prevFriends) => {
      return [...prevFriends].map((friend) => {
        if (friend.userId === channelObj.userId) {
          socket.connect();
          // socket.emit('clear_unread_count', { roomId: channelObj.userID })
          socket.emit('handle_room_selected', {
            channelId: channelObj?.userId || channelObj?.roomId,
            isGroup: channelObj.hasOwn('roomId'),
          });
        }
        return friend;
      });
    });
  };

  const setBadgeCSS = (value) => {
    return Number(value) < 10 ? 'badge' : 'badge double-digits';
  };
  // console.log('friendList: ', friendList);
  if (friendList.length <= 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1">
          Your friend&apos;s list is empty
        </Typography>
        <Typography variant="subtitle2">
          Add friends to your chat with the button below
        </Typography>
        <Box sx={{ mt: 5 }}>
          <AddFriendRFH />
        </Box>
      </Box>
    );
  }

  return (
    <div className="channel-list-cntr">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          padding: '15px 10px',
          // borderBottom: '1px solid',
          // borderTop: '1px solid',
          // backgroundColor: '#fbfcf8',
          boxShadow: '1px 1px 4px 1px rgba(192,192,192,0.5)',
        }}
      >
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
              label="Search contact..."
            />
          )}
        />
        <AddIcon
          sx={{
            color: 'action.active',
            mx: 1,
            border: '1px solid',
            borderRadius: '5px',
            fontSize: '30px',
            boxShadow:
              'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
            '&:hover': {
              // borderColor: 'primary.main',
              // color: 'primary.main',
              cursor: 'pointer',
              boxShadow: '2px 2px 12px -2px rgba(0,0,0,0.75);',
            },
          }}
        />
      </Box>
      <button
        className="btn btn-link"
        onClick={() => onChannelSelect({ userId: '' }, null)}
      >
        Clear Message Panel
      </button>
      <ul>
        {friendList &&
          friendList.map((friend, index) => {
            // console.log("friend: ", friend);
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
    </div>
  );
}

export default ChannelList;

// https://www.uplabs.com/posts/chat-ui-design-0b930711-4cfd-4ab4-b686-6e7785624b16

/*

<List dense={false} sx={{ mt: 2 }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(
          (value) => {
            return (
              <ListItem
                key={value}
                onClick={() => handleChannelSelect(value)}
                sx={{
                  alignItems: 'flex-start',
                  color: '#2c333d',
                  '&.Mui-selected': {
                    backgroundColor: '#f8fbfc',
                    boxShadow: '1px 1px 4px -2px rgba(0,0,0,0.75);',
                    borderRight: '2px solid #2c84f7',
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
                selected={isActive === value}
              >
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Single-line item"
                  secondary={'Secondary text'}
                />
                <ListItemText
                  primary="time"
                  sx={{
                    marginLeft: 'auto',
                    textAlign: 'right',
                    justifyContent: 'top',
                    color: '#2c333d',
                    fontWeight: 500,
                    fontSize: 16,
                  }}
                />
              </ListItem>
            );
          },
        )}
      </List>

*/
