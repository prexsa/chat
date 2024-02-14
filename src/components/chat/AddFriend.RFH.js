/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { FriendContext, SocketContext } from './Main';
import { useUserContext } from '../../userContext';
import Auth from '../../services/Auth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CustomTabPanel from './CustomTabPanel';
import {
  Box,
  Button,
  OutlinedInput,
  InputLabel,
  FormControl,
  FormHelperText,
  Tabs,
  Tab,
  Typography,
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
  const { user } = useUserContext();
  const [show, setShow] = useState(false);
  const [tabPanel, setTabPanel] = useState(0);
  const [showResp, setShowResp] = useState(false);
  const [isError, setIsError] = useState(false);
  const [respMessage, setRespMessage] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setShowResp(false);
      setRespMessage('');
      setIsError(false);
    }, 4000);
  }, [showResp]);

  const handleSearchSubmit = (data) => {
    // console.log('data: ', data)
    if (data.search.trim() === '') return;
    socket.connect();
    socket.emit('add_friend', data.search, ({ errorMsg, done, newFriend }) => {
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
        setShowResp(true);
        setRespMessage('Friend added');
        reset({ name: '' });
        setTimeout(() => {
          handleClose();
        }, 5000);
      } else {
        setRespMessage(errorMsg);
        reset({ name: '' });
      }
    });
  };

  const handleEmailSubmit = async (data) => {
    const { fname, lname, userId } = user;
    // console.log('user: ', user);
    const body = { userId, email: data.email, fname, lname };
    const resp = await Auth.sendEmail(body);

    if (resp.data.isSuccessful) {
      reset({ email: '' });
    } else {
      setIsError(true);
    }
    setShowResp(true);
    setRespMessage(resp.data.message);
  };
  const handleClose = () => setShow(false);

  const onErrors = (errors) => console.error(errors);

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => setShow(true)}
        fullWidth
        startIcon={<PersonAddIcon />}
      >
        Add Family and Friends
      </Button>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: 'center' }}>Add a friend</DialogTitle>
        <Box
          sx={{ color: `${isError ? 'red' : 'green'}`, textAlign: 'center' }}
        >
          {respMessage}
        </Box>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabPanel} onChange={(e, index) => setTabPanel(index)}>
              <Tab label="Search" aria-controls="tab-panel-search" />
              <Tab label="Email" aria-controls="tab-panel-email" />
            </Tabs>
          </Box>
          <CustomTabPanel value={tabPanel} index={0}>
            <Typography variant="subtitle1">
              Search for family or friends you may know
            </Typography>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(handleSearchSubmit, onErrors)}
            >
              <Box sx={{ margin: '20px 0', width: '400px' }}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  // error={errors?.search}
                  name="name"
                  // onFocus={onFocusHandler}
                >
                  <InputLabel
                    htmlFor="outlined-adornment-password"
                    sx={{ top: '-7px' }}
                  >
                    Search...
                  </InputLabel>
                  <OutlinedInput
                    type="text"
                    size="small"
                    label="search"
                    {...register('search')}
                  />
                  <FormHelperText sx={{ color: 'red' }}>
                    {errors?.search ? errors?.search.message : ''}
                  </FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ marginTop: '20px' }}>
                <Button variant="contained" type="submit" fullWidth>
                  Add
                </Button>
              </Box>
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={tabPanel} index={1}>
            <Typography variant="subtitle1">
              Email a family or friend, and add them to your chat
            </Typography>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(handleEmailSubmit, onErrors)}
            >
              <Box sx={{ margin: '20px 0', width: '400px' }}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  error={errors?.email}
                  name="email"
                  // onFocus={onFocusHandler}
                >
                  <InputLabel
                    htmlFor="outlined-adornment-password"
                    sx={{ top: '-7px' }}
                  >
                    Email
                  </InputLabel>
                  <OutlinedInput
                    type="email"
                    size="small"
                    label="email"
                    {...register('email', {
                      pattern: {
                        value:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: 'Please enter a valid email',
                      },
                    })}
                  />
                  <FormHelperText sx={{ color: 'red' }}>
                    {errors?.email ? errors?.email.message : ''}
                  </FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ marginTop: '20px' }}>
                <Button variant="contained" type="submit" fullWidth>
                  Send
                </Button>
              </Box>
            </Box>
          </CustomTabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
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
