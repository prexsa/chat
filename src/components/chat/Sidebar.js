/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Autocomplete,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import AddFriendRFH from './AddFriend.RFH';
// import CreateGroup from './CreateGroup';
// import Logout from '../Logout';
// import ChannelList from './ChannelList';
// import { useUserContext } from '../../userContext';
// import Box from '@mui/material/Box';
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const movies = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
];

// https://bashooka.com/inspiration/chat-ui-designs/
// https://dribbble.com/shots/3407020-Messenger-Redesign/attachments/744131?mode=media
// https://www.google.com/search?sca_esv=c8404836621fa050&rlz=1C1CHBF_enUS1056US1056&sxsrf=ACQVn08rRo3-Swk-6_liY9VZhYTFQ8YMmA:1706737299588&q=chat+desktop+designs+register+page&tbm=isch&source=lnms&sa=X&ved=2ahUKEwir4N3zy4iEAxUUMEQIHYAiBPcQ0pQJegQIDBAB&biw=1974&bih=1331&dpr=1#imgrc=rEGh0ln3B7hS3M&imgdii=9mUUjVIE-RBI_M

const Sidebar = () => {
  const [isActive, setIsActive] = useState(false);

  const handleChannelSelect = (index) => {
    console.log('handleChannelSelect, ', index);
    setIsActive(index);
  };

  return (
    <Box
      sx={{
        // padding: '10px',
        borderRight: '1px solid #dedede',
        // width: 350,
        height: '100%',
        backgroundColor: '#ffffff',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          // justifyContent: 'space-between',
          padding: '20px 15px',
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 30 }} />
        <span>User</span>
        <MoreVertIcon sx={{ marginLeft: 'auto' }} />
      </Box>
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
    </Box>
  );
};
/*
const Sidebar = ({ showDrawer, setShowDrawer }) => {
  // const user = JSON.parse(localStorage.getItem('user'))
  // console.log('user ;', user)

  return (
    <aside>
      <Logout />
      <header className="sidebar-header">
        <AccountCircleIcon />
        <div className="username" onClick={() => setShowDrawer(!showDrawer)}>
          {user?.username ? user.username : 'default'}
        </div>
      </header>
      <Box sx={{ margin: '10px', padding: '5px', textAlign: 'left' }}>
        <AddFriendRFH />
        <CreateGroup />
      </Box>
      <ChannelList />
    </aside>
  );
};
*/
Sidebar.propTypes = {
  showDrawer: PropTypes.bool,
  setShowDrawer: PropTypes.func,
};

export default Sidebar;
