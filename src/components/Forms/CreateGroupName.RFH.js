import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';
import { FriendContext, SocketContext } from '../chat/Main';
import { Box, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import { FormInputText } from '../Inputs/FormInputText';

const Item = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1),
  margin: '3px 0 3px 0',
  textAlign: 'center',
}));

const CreateGroupName = ({ disableToggle, resetToggle }) => {
  // { handleSubmit, reset, control }
  // const searchRef = useRef();
  const methods = useForm({
    defaultValues: { groupName: '' },
  });
  const [btnToggle, setBtnToggle] = React.useState(false);
  // const methods = useForm();
  const { setRoomList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);

  const handleOnSubmit = (data) => {
    // methods.reset();
    console.log({ methods });
    // If 'roomId' exist and groupName is empty, revert groupName to latest

    socket.connect();
    socket.emit('create_group_name', data, (resp) => {
      // methods.reset();
      // console.log({ resp });
      setRoomList((prevState) => {
        return [resp.room, ...prevState];
      });
    });

    disableToggle();
  };

  const onErrors = (errors) => {
    console.error(errors);
  };

  const handleReset = () => {
    methods.reset();
    resetToggle();
  };

  // watch groupName to enable/disable create button
  useEffect(() => {
    const groupName = methods.watch('groupName');
    if (groupName && groupName.length > 0) {
      setBtnToggle(false);
    } else {
      setBtnToggle(true);
    }
  }, [methods.watch('groupName')]);

  return (
    <Box>
      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={methods.handleSubmit(handleOnSubmit, onErrors)}
        >
          <Box sx={{ my: '20px', width: '600px' }}>
            {/*<Typography variant="subtitle1" sx={{ my: '10px' }}>
              Group name
            </Typography>
            <FormInputText
              name="groupName"
              control={methods.control}
              label={'Group Name'}
              variant="standard"
            />*/}
            <Box sx={{ display: 'flex', alignItems: 'end', columnGap: '20px' }}>
              <Box>Group Name:</Box>
              <Box sx={{ width: '300px' }}>
                <FormInputText
                  name="groupName"
                  control={methods.control}
                  label={'Add a group name'}
                  variant="standard"
                  size="small"
                />
              </Box>
            </Box>
          </Box>
          <Box sx={{ marginTop: '20px' }}>
            <Stack>
              <Item
                variant="contained"
                type="submit"
                fullWidth
                disabled={btnToggle}
              >
                Create
              </Item>
              <Item fullWidth onClick={handleReset}>
                Reset
              </Item>
            </Stack>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  );
};

CreateGroupName.propTypes = {
  disableToggle: PropTypes.func,
  resetToggle: PropTypes.func,
};

export default CreateGroupName;
