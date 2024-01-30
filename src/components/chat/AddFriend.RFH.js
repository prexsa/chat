import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FriendContext, SocketContext } from './Main';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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

function AddFriend() {
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
    }, 4000);
  }, [showResp]);

  const handleOnSubmit = (data) => {
    // console.log('data: ', data)
    if (data.name.trim() === '') return;
    socket.connect();
    socket.emit('add_friend', data.name, ({ errorMsg, done, newFriend }) => {
      console.log(
        'add_friend: ',
        done,
        'errorMsg: ',
        errorMsg,
        ' new: ',
        newFriend,
      );
      if (done) {
        setFriendList((currFriendList) => [newFriend, ...currFriendList]);
        setShowResp('Friend added');
        reset({ name: '' });
        setTimeout(() => {
          handleClose();
        }, 5000);
      } else {
        setShowResp(errorMsg);
        reset({ name: '' });
      }
    });
  };

  const handleClickOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  const onErrors = (errors) => console.error(errors);

  // const onFocusHandler = e => console.log('onFocusHandler')

  return (
    <div>
      <Button
        size="small"
        onClick={handleClickOpen}
        fullWidth
        startIcon={<PersonAddIcon />}
      >
        Add Friend
      </Button>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Add a friend</DialogTitle>
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
                  Username or email
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
                Add
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

export default AddFriend;
/*<form >
    <h4 className="add-friend-header-txt">Add a friend</h4>
    <div className="form-field">
      <input name="name" autoFocus {...register('name', {required: "Name is required."})} />
      {errors?.name && errors?.name.message ? (
        <div className="text-danger">{errors?.name.message}</div>
      ) : null}
    </div>
    {
      respErr === '' ?
        <div className="hidden-txt">hidden</div>
      :
        <div className="text-danger">{respErr}</div>
    }
    <Button type="submit" size="sm" variant="contained">Add</Button>
  </form>*/
