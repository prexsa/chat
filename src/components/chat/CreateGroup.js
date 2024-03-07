import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FriendContext, SocketContext } from './Main';
import GroupIcon from '@mui/icons-material/Group';
import { Box, Button, Typography } from '@mui/material';
import { SearchAutoComplete } from '../form-component/SearchAutoComplete';
import { FormInputText } from '../form-component/FormInputText';
import { Modal } from './Modal';

const CreateGroup = () => {
  const { handleSubmit, reset, control } = useForm({
    defaultValues: { members: null, groupName: '' },
  });
  const { setRoomList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [show, setShow] = useState(false);

  const handleOnSubmit = (data) => {
    socket.connect();
    socket.emit('create_group', data, (resp) => {
      reset();
      setRoomList((prevState) => {
        return [resp.room, ...prevState];
      });
      handleClose();
    });
  };

  const handleClickOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  const onErrors = (errors) => {
    console.error(errors);
  };

  return (
    <div>
      <Button
        size="small"
        onClick={handleClickOpen}
        fullWidth
        startIcon={<GroupIcon />}
      >
        Create group
      </Button>
      <Modal open={show} onClose={handleClose} title={'Create Group'}>
        <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
          Add a group name and members.
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleOnSubmit, onErrors)}
        >
          <Box sx={{ margin: '20px 0', width: '400px' }}>
            <FormInputText
              name={'groupName'}
              control={control}
              label={'Group Name'}
            />
          </Box>
          <Box sx={{ my: '20px' }}>
            <Typography variant="subtitle1">Add to group</Typography>
            <SearchAutoComplete
              name={'members'}
              control={control}
              label={'Username or email'}
              // formSubmitHandler={formSubmitHandler}
            />
          </Box>
          <Box sx={{ marginTop: '20px' }}>
            <Button variant="contained" type="submit" fullWidth>
              Create Group
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateGroup;
