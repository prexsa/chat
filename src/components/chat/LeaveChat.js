import React, { useContext, useState } from 'react';
import { useUserContext } from '../../userContext';
import { FriendContext, SocketContext } from './Main';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Button, IconButton } from '@mui/material';
import { Modal } from './Modal';

const LeaveChat = () => {
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
        // userIdToRemove: userId,
        roomId: selectedRoom.roomId,
      },
      ({ roomId }) => {
        console.log({ roomId });
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
      <Modal open={show} onClose={handleClose} title={'Leave Chat'}>
        <Box sx={{ width: '400px' }}>
          <Button
            size="small"
            onClick={leaveChat}
            color="error"
            fullWidth
            startIcon={<ExitToAppIcon />}
          >
            Leave
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default LeaveChat;
