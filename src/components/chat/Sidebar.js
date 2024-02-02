import React from 'react';
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

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

// https://dribbble.com/shots/5478210-Desktop-Chat-Application
// https://www.google.com/search?sca_esv=c8404836621fa050&rlz=1C1CHBF_enUS1056US1056&sxsrf=ACQVn08rRo3-Swk-6_liY9VZhYTFQ8YMmA:1706737299588&q=chat+desktop+designs+register+page&tbm=isch&source=lnms&sa=X&ved=2ahUKEwir4N3zy4iEAxUUMEQIHYAiBPcQ0pQJegQIDBAB&biw=1974&bih=1331&dpr=1#imgrc=rEGh0ln3B7hS3M&imgdii=9mUUjVIE-RBI_M

const Sidebar = () => {
  return (
    <Box
      sx={{
        padding: '10px',
        borderRight: '1px solid #dedede',
        // width: 350,
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
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
            <TextField {...params} variant="standard" label="Search..." />
          )}
        />
        <AddIcon
          sx={{
            color: 'action.active',
            mx: 1,
            border: '1px solid',
            borderRadius: '5px',
            fontSize: '30px',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
            },
          }}
        />
      </Box>
      <List dense={false} sx={{ mt: 2 }}>
        {generate(
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Single-line item"
              secondary={'Secondary text'}
            />
            <ListItemText primary="time" />
          </ListItem>,
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
