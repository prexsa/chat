/* eslint-disable */
import React, { useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { FriendContext, SocketContext } from './Main';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  IconButton,
  InputLabel,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
} from '@mui/material';
import List from '../List';

import SearchAutoComplete from './Forms/SearchAutoComplete';
import TitleForm from './TitleForm';

const GroupDetails = ({ isGroup, roomId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { selectedRoom, setSelectedRoom, setRoomList } =
    useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [showResp, setShowResp] = useState('');
  const [show, setShow] = useState(false);
  const [groupAdmin, setGroupAdmin] = useState({ userId: '', username: '' });
  const [members, setMembers] = useState([]);
  // console.log({ groupDetails })
  useEffect(() => {
    setTimeout(() => {
      setShowResp('');
    }, 2000);
  }, [showResp]);
  /*
  useEffect(() => {
    socket.on('exit_group_chat', ({ roomId }) => {
      // console.log('exit_group_chat: ', { roomId, userId })
      // remove group chat from user's channel list
      setRoomList((prevFriends) => {
        return [...prevFriends].filter((friend) => friend?.roomId !== roomId);
      });
    });
    return () => socket.off('exit_group_chat');
  }, [socket, setRoomList]);
*/
  const formSubmitHandler = (data) => {
    // console.log('data: ', data);
    const {
      search: { userId },
    } = data;
    socket.connect();
    socket.emit(
      'add_to_group',
      { roomId, userId },
      ({ newGroupMember: { userId, fullname } }) => {
        // console.log('resp: ', resp);
        if (userId !== '') {
          const member = { fullname, userId };
          setMembers((prev) => [...prev, member]);
        }
      },
    );
  };

  const handleRemoveMember = (userId, index) => {
    console.log({ userId, index });
    setMembers(members.filter((member, idx) => idx !== index));
    socket.connect();
    socket.emit('leave_group', { roomId: selectedRoom.roomId, userId }, () => {
      setSelectedRoom({});
      setRoomList((prevState) => {
        return [...prevState].filter(
          (room) => room.roomId !== selectedRoom.roomId,
        );
      });
    });
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const onErrors = (errors) => console.error(errors);

  useEffect(() => {
    if (isGroup) {
      // console.log('selectedRoom: ', selectedRoom.mates);
      const members = selectedRoom.mates;
      setMembers([...members]);
    }
  }, [isGroup]);

  if (!isGroup) return;

  return (
    <>
      <IconButton onClick={handleShow} size="sm">
        <GroupAddIcon />
      </IconButton>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Group Details</DialogTitle>
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
        <DialogContent sx={{ padding: '0px 24px' }}>
          <Box sx={{ color: 'red' }}>{showResp}</Box>
          <Box sx={{ mb: '20px' }}>
            <Typography variant="subtitle1" sx={{ my: '12px' }}>
              Group name
            </Typography>
            <TitleForm />
          </Box>
          <Divider />
          <Box sx={{ my: '20px' }}>
            <Typography variant="subtitle1">Add to group</Typography>
            <SearchAutoComplete formSubmitHandler={formSubmitHandler} />
          </Box>
          <Divider />
          <Box
            sx={{
              marginTop: '25px',
              padding: '10px 5px',
            }}
          >
            <h4>Members</h4>
            <List
              members={members}
              onClickDelete={handleRemoveMember}
              groupAdmin={groupAdmin}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {/*<Button onClick={handleClose}>Subscribe</Button>*/}
        </DialogActions>
      </Dialog>
    </>
  );
};

GroupDetails.propTypes = {
  isGroup: PropTypes.bool,
  roomId: PropTypes.string.isRequired,
};

export default GroupDetails;
