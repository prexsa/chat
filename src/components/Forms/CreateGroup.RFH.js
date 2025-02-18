import React, { useContext } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FriendContext, SocketContext } from '../chat/Main';
import { Box, Button, Typography } from '@mui/material';
import SearchAutoComplete from '../Inputs/SearchAutoComplete';
import { FormInputText } from '../Inputs/FormInputText';

const CreateGroupForm = () => {
  // { handleSubmit, reset, control }
  const methods = useForm({
    defaultValues: { members: null, groupName: '' },
  });
  const { setRoomList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);

  const handleOnSubmit = (data) => {
    socket.connect();
    socket.emit('create_group', data, (resp) => {
      methods.reset();
      setRoomList((prevState) => {
        return [resp.room, ...prevState];
      });
    });
  };

  const onErrors = (errors) => {
    console.error(errors);
  };

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={methods.handleSubmit(handleOnSubmit, onErrors)}
      >
        <Box sx={{ margin: '20px 0', width: '400px' }}>
          <FormInputText
            name={'groupName'}
            control={methods.control}
            label={'Group Name'}
          />
        </Box>
        <Box sx={{ my: '20px' }}>
          <Typography variant="subtitle1">Add to group</Typography>

          <SearchAutoComplete
            name={'members'}
            control={methods.control}
            label={'Username or email'}
            isMultiple={true}
            // reset={reset}
            // formSubmitHandler={formSubmitHandler}
          />
        </Box>
        <Box sx={{ marginTop: '20px' }}>
          <Button variant="contained" type="submit" fullWidth>
            Create Group
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default CreateGroupForm;
