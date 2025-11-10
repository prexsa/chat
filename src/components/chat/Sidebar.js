import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChannelList from './ChannelList';

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

export default Sidebar;
