/* eslint-disable */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useUserContext } from '../../userContext';
import { FriendContext, SocketContext } from './Main';
import CloseIcon from '@mui/icons-material/Close';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const LeaveChat = ({ isGroup, userId }) => {
  const { user } = useUserContext();
  const { selectedRoom, setRoomList, setSelectedRoom } =
    useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [show, setShow] = useState(false);

  const leaveChat = () => {
    console.log({ user, selectedRoom });
    socket.connect();
    socket.emit(
      'leave_chat',
      {
        hostUserId: user.userId,
        userIdToRemove: userId,
        roomId: selectedRoom.roomId,
      },
      ({ roomId, userIdToRemove }) => {
        console.log({ roomId, userIdToRemove });
        setRoomList((prevRooms) => {
          return [...prevRooms].filter((room) => room.roomId !== roomId);
        });
        handleClose();
        setSelectedRoom({});
      },
    );
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  // sx={{ marginLeft: "auto" }}
  return (
    <Box>
      <IconButton onClick={handleShow} size="sm">
        <MoreVertIcon />
      </IconButton>

      <Dialog
        open={show}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'xs'}
      >
        <DialogTitle>Leave Chat</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <div className="leave-icon-container">
            <Button
              size="small"
              onClick={leaveChat}
              color="error"
              fullWidth
              startIcon={<ExitToAppIcon />}
            >
              Leave
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

LeaveChat.propTypes = {
  isGroup: PropTypes.bool,
  userId: PropTypes.string.isRequired,
};

export default LeaveChat;
/*
<div className="message-chanel-actions">
  <div className="leave-icon-container">
  {
    // remove option for owner to leave their own group
    channel.isGroup &&
    <span data-text="Leave chat" className="tooltip-text bottom left">
      <ExitToAppIcon className="leave-icon" onClick={handleLeaveGroup} />
    </span>
  }
    <span data-text="Delete" className="tooltip-text bottom left">
      <CloseIcon className="leave-icon" onClick={handleRemoveChannel} />
    </span>
  </div>
</div>
*/
