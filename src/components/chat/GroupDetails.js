/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';
import { FriendContext, SocketContext } from '../chat/Main';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Box, Button, IconButton, Typography, Divider } from '@mui/material';
import { Modal } from './Modal';
import List from '../List';

import SearchAutoComplete from '../Inputs/SearchAutoComplete';
import TitleForm from '../Forms/TitleForm';

// import CreateGroupForm from '../Forms/CreateGroup.RFH';

const GroupDetails = ({ isGroup, roomId }) => {
  /*const { handleSubmit, reset, control } = useForm({
    defaultValues: { search: null },
  });*/
  const methods = useForm();
  const { selectedRoom, setSelectedRoom, setRoomList } =
    useContext(FriendContext);
  const { socket } = useContext(SocketContext);

  const [show, setShow] = useState(false);
  const [members, setMembers] = useState([]);
  // console.log('members: ', members);

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
        reset();
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

  const handleDeleteGroup = () => {
    socket.connect();
    socket.emit(
      'delete_group',
      { roomId: selectedRoom.roomId },
      ({ roomId }) => {
        setSelectedRoom({});
        setRoomList((prevState) => {
          return [...prevState].filter((room) => room.roomId !== roomId);
        });
      },
    );
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    // reset();
    setShow(false);
  };

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
      <Modal open={show} onClose={handleClose} title={'Group Details'}>
        <Box sx={{ mb: '20px' }}>
          <Typography variant="subtitle1" sx={{ my: '12px' }}>
            Group name
          </Typography>
          <TitleForm />
        </Box>
        <Divider />

        <Box sx={{ my: '20px' }}>
          <Typography variant="subtitle1">Add to group</Typography>
          <FormProvider {...methods}>
            <Box
              component="form"
              onSubmit={methods.handleSubmit(formSubmitHandler, onErrors)}
            ></Box>
            <SearchAutoComplete
              name={'search'}
              control={methods.control}
              label={'Name or email'}
            />
            <Box sx={{ marginTop: '20px' }}>
              <Button variant="contained" type="submit" fullWidth>
                Add
              </Button>
            </Box>
          </FormProvider>
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
            // groupAdmin={groupAdmin}
          />
        </Box>
        <Divider />
        <Box sx={{ mt: '10px' }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleDeleteGroup}
          >
            Delete Group
          </Button>
        </Box>
      </Modal>
    </>
  );
};

GroupDetails.propTypes = {
  isGroup: PropTypes.bool,
  roomId: PropTypes.string.isRequired,
};

export default GroupDetails;
