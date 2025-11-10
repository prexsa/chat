import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import CreateGroup from './CreateGroup';
import ChannelList from './ChannelList';
// import { useUserContext } from '../../context/userContext';

const Sidebar = ({ user }) => {
  // const { user } = useUserContext();

  return (
    <Box
      sx={{
        // padding: '10px',
        borderRight: '1px solid #dedede',
        // width: 350,
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
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          // onClick={handleClick}
        >
          <MoreVertIcon sx={{ marginLeft: 'auto' }} />
        </Button>
      </Box>
      <ChannelList user={user} />
    </Box>
  );
};

Sidebar.propTypes = {
  user: PropTypes.object,
};

export default Sidebar;
