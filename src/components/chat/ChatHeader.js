import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupDetails from './GroupDetails';
import LeaveChat from './LeaveChat';
// import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
// import VideoCallIcon from '@mui/icons-material/VideoCall';

const ChatHeader = ({ isGroup, roomName, roomId }) => {
  // console.log('roomDetails: ', roomDetails);
  return (
    <Box sx={{ display: 'flex' }} className="message-panel-header">
      {isGroup ? null : <LeaveChat />}
      <GroupDetails roomId={roomId} isGroup={isGroup} />
      <AccountCircleIcon className="channel-img" />
      <Typography variant="h6">{roomName}</Typography>

      {/*<p style={{ marginLeft: "auto" }}>
          id: {channel?.userId || channel?.roomId}
        </p>*/}
      {/* 
      <Box sx={{ '& > :not(style)': { m: 0.5 }, marginLeft: 'auto' }}>
        <LocalPhoneOutlinedIcon
          onClick={() => console.log('handlePhoneCall')}
          aria-label="phone"
          sx={{
            color: '#9e9e9e',
            backgroundColor: '#ffffff',
            border: '1px solid #9e9e9e',
            borderRadius: '50%',
            boxSizing: 'border-box',
            padding: '4px',
            fontSize: '2rem',
            boxShadow: '0px 0px 1px 1px #9e9e9e',
            '&:hover': {
              color: '#ffffff',
              backgroundColor: '#9e9e9e',
              cursor: 'pointer',
              border: '1px solid #9e9e9e',
              boxShadow: '0px 0px 3px 1px #9e9e9e',
            },
            '&:active': {
              color: '#9e9e9e',
              backgroundColor: '#ffffff',
            },
          }}
        />
        <VideoCallIcon
          onClick={() => console.log('handleVideoCall')}
          aria-label="video"
          sx={{
            color: '#ffffff',
            backgroundColor: '#2196f3',
            border: '1px solid #2196f3',
            borderRadius: '50%',
            boxSizing: 'border-box',
            padding: '4px',
            fontSize: '2rem',
            boxShadow: '0px 0px 1px 1px #2196f3',
            '&:hover': {
              cursor: 'pointer',
              color: '#2196f3',
              backgroundColor: '#fff',
              border: '1px solid #2196f3',
              boxShadow: '0px 0px 3px 1px #2196f3',
            },
            '&:active': {
              color: '#ffffff',
              backgroundColor: '#2196f3',
            },
          }}
        />
      </Box>
      */}
    </Box>
  );
};

ChatHeader.propTypes = {
  isGroup: PropTypes.bool,
  /*roomDetails: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
  }),*/
  roomName: PropTypes.string.isRequired,
  roomId: PropTypes.string.isRequired,
};

export default ChatHeader;
