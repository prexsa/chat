/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import CreateGroup from './CreateGroup';
// import Logout from '../Logout';
import ChannelList from './ChannelList';
import { useUserContext } from '../../userContext';
// import Box from '@mui/material/Box';
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

const Sidebar = () => {
  const { user } = useUserContext();

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
          borderBottom: '1px solid #dedede',
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 30 }} />
        <span>
          {user.fname} {user.lname}
        </span>
        <MoreVertIcon sx={{ marginLeft: 'auto' }} />
      </Box>
      <ChannelList />
    </Box>
  );
};

Sidebar.propTypes = {
  showDrawer: PropTypes.bool,
  setShowDrawer: PropTypes.func,
};

export default Sidebar;

// https://bashooka.com/inspiration/chat-ui-designs/
// https://dribbble.com/shots/3407020-Messenger-Redesign/attachments/744131?mode=media
// https://www.google.com/search?sca_esv=c8404836621fa050&rlz=1C1CHBF_enUS1056US1056&sxsrf=ACQVn08rRo3-Swk-6_liY9VZhYTFQ8YMmA:1706737299588&q=chat+desktop+designs+register+page&tbm=isch&source=lnms&sa=X&ved=2ahUKEwir4N3zy4iEAxUUMEQIHYAiBPcQ0pQJegQIDBAB&biw=1974&bih=1331&dpr=1#imgrc=rEGh0ln3B7hS3M&imgdii=9mUUjVIE-RBI_M
