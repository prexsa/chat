import React, { useContext } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FriendContext, SocketContext } from '../chat/Main';
import { Box, Button, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchAutoCompleteNoRef from '../Inputs/SearchAutoCompleteNoRef';
import { FormInputText } from '../Inputs/FormInputText';

const Item = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1),
  margin: '3px 0 3px 0',
  textAlign: 'center',
}));

const CreateGroupForm = () => {
  // { handleSubmit, reset, control }
  // const searchRef = useRef();
  const methods = useForm({
    defaultValues: { members: [], groupName: '' },
  });
  // const methods = useForm();
  const { setRoomList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);

  const handleOnSubmit = (data) => {
    // console.log('onSubmit ', data);
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

  const handleReset = () => {
    methods.reset();
  };

  return (
    <Box>
      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={methods.handleSubmit(handleOnSubmit, onErrors)}
        >
          <Box sx={{ my: '20px', width: '400px' }}>
            <Typography variant="subtitle1" sx={{ my: '10px' }}>
              Group name
            </Typography>
            <FormInputText
              name="groupName"
              control={methods.control}
              label={'Group Name'}
            />
          </Box>
          <Box sx={{ my: '20px' }}>
            <Typography variant="subtitle1">Add to group</Typography>
            {/*<AddToGroupForm />*/}
            {/*
            <SearchAutoComplete
              ref={searchRef}
              name={'members'}
              control={methods.control}
              label={'Username or email'}
              isMultiple={true}
              // reset={reset}
              // formSubmitHandler={formSubmitHandler}
            />
            */}
            <SearchAutoCompleteNoRef
              name="members"
              label="Username or email"
              isMultiple={true}
            />
          </Box>
          <Box sx={{ marginTop: '20px' }}>
            <Stack>
              <Item variant="contained" type="submit" fullWidth>
                Create Group
              </Item>
              <Item fullWidth onClick={handleReset}>
                Reset
              </Item>
              {/*
              <Button variant="contained" type="submit" fullWidth>
                Create Group
              </Button>
              <Button variant="contained" fullWidth onClick={handleReset}>
                Reset
              </Button>
              */}
            </Stack>
          </Box>
        </Box>
      </FormProvider>
      {/*
      <Box>
        <SearchAutoCompleteNoRef
          name="members"
          label="Username or email"
          isMultiple={true}
        />
      </Box>
      <RHFAutoCompleteDemo />
      */}
    </Box>
  );
};

export default CreateGroupForm;
