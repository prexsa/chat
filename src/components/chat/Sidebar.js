import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import ChannelList from './ChannelList';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Badge from '@mui/material/Badge';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';

export default function Sidebar() {
  const [searchTerm, setSearchTerm] = useState('');

  /*
  const handleClear = () => {
    setSearchTerm('');
    // if (onSearch) onSearch('');
  };
  */

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    // if (onSearch) onSearch(e.target.value);
  };
  return (
    <React.Fragment>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={handleChange}
          /*
              inputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClear}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              */
        />
      </Box>

      <Divider />
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Brunch this weekend?"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: 'text.primary', display: 'inline' }}
                >
                  Ali Connors
                </Typography>
                {" — I'll be in your neighborhood doing errands this…"}
              </React.Fragment>
            }
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gridTemplateRows: 'auto auto',
              width: '100%',
            }}
          >
            {/* Quadrant 1: Top-Left */}
            <Box sx={{ alignSelf: 'flex-start' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Name
              </Typography>
            </Box>

            {/* Quadrant 2: Top-Right */}
            <Box sx={{ justifySelf: 'flex-end', alignSelf: 'flex-start' }}>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                11:11
              </Typography>
            </Box>

            {/* Quadrant 3: Bottom-Left */}
            <Box sx={{ alignSelf: 'flex-end' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1, // Limits the text to exactly 3 lines
                }}
              >
                Gonna head out for a drive, wanna join?
                slfj;aslfjsaldfkjas;ldfkjas;flksajdf;laksj;l
              </Typography>
            </Box>

            {/* Quadrant 4: Bottom-Right */}
            <Box
              sx={{
                justifySelf: 'flex-end',
                alignSelf: 'flex-start',
                marginRight: '10px',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                <Badge badgeContent={3} color="primary"></Badge>
              </Typography>
            </Box>
          </Box>
        </ListItem>
      </List>
      <IconButton
        onClick={() => alert('Create a new chat')}
        sx={{
          position: 'absolute',
          bottom: '30px',
          right: '20px',
        }}
      >
        <AddCircleIcon color="primary" sx={{ fontSize: 50 }} />
      </IconButton>
    </React.Fragment>
  );
}

/*

const Sidebar = ({ user }) => {
  return (
    <Box
      sx={{
        borderRight: '1px solid #dedede',
        height: '100%',
        backgroundColor: '#fdfdfe',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0px 15px 15px',
          borderBottom: '1px solid #dedede',
          backgroundColor: '#f0f2f6',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            columnGap: '5px',
            alignItems: 'center',
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 40 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
            {user.fname} {user.lname}
          </Typography>
        </Box>
      </Box>
      <ChannelList user={user} />
    </Box>
  );
};

Sidebar.propTypes = {
  user: PropTypes.object,
};

*/
