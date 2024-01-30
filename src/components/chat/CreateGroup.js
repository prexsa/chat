import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FriendContext, SocketContext } from './Main';
import GroupIcon from '@mui/icons-material/Group';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Box,
  Button,
  OutlinedInput,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';

function CreateGroup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { setFriendList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [showResp, setShowResp] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowResp('');
    }, 2000);
  }, [showResp]);

  const handleOnSubmit = (data) => {
    // console.log('data: ', data)
    if (data.name.trim() === '') return;
    socket.connect();
    socket.emit('create_group', data, (resp) => {
      console.log('resp: ', resp);
      reset({ name: '' });
      setShow(false);
      setFriendList((prev) => {
        return [resp, ...prev];
      });
    });
  };

  const handleClickOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  const onErrors = (errors) => console.error(errors);

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
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Create group</DialogTitle>
        <DialogContent>
          <Box sx={{ color: 'red' }}>{showResp}</Box>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(handleOnSubmit, onErrors)}
          >
            <Box sx={{ margin: '20px 0', width: '400px' }}>
              <FormControl
                variant="outlined"
                fullWidth
                // error={usrNameError.hasError}
                name="name"
                // onFocus={onFocusHandler}
              >
                <InputLabel
                  htmlFor="outlined-adornment-password"
                  sx={{ top: '-7px' }}
                >
                  Add a title
                </InputLabel>
                <OutlinedInput
                  type="text"
                  size="small"
                  label="Username or email"
                  {...register('name', { required: true })}
                />
                <FormHelperText id="component-error-text">
                  {errors?.name ? errors?.name.message : ''}
                </FormHelperText>
              </FormControl>
            </Box>
            <Box sx={{ marginTop: '20px' }}>
              <Button variant="contained" type="submit" fullWidth>
                Create
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {/*<Button onClick={handleClose}>Subscribe</Button>*/}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateGroup;
