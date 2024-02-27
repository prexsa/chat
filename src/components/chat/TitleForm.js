/* eslint-disable */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SocketContext, FriendContext } from './Main';
// title, isGroup, channelId,
const TitleForm = ({ roomName }) => {
  const { socket } = useContext(SocketContext);
  const { selectedRoom, setSelectedRoom, setRoomList } =
    useContext(FriendContext);
  const { register, handleSubmit, setValue, getValues, control, reset } =
    useForm({
      defaultValues: { name: selectedRoom.name },
    });
  // console.log('selectedRoom: ', selectedRoom);
  const [show, setShow] = useState(false);
  // console.log('channel: ', selectedRoom);
  const onSubmit = async (data) => {
    // setName(data.name)
    // console.log('data: ', data.name);
    if (selectedRoom.name === data.name) return;
    socket.emit(
      'update_group_name',
      { roomId: selectedRoom.roomId, name: data.name },
      () => {
        setSelectedRoom((prevState) => ({
          ...prevState,
          name: data.name,
        }));
        setRoomList((prevState) => {
          // console.log('prevState: ', prevState);
          return [...prevState].map((room) => {
            // console.log('room: ', room);
            if (room.roomId === selectedRoom.roomId) {
              room.name = data.name;
            }
            return room;
          });
        });
      },
    );
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    setValue('name', selectedRoom.name);
  }, [setValue]);

  // return header only if it is not a group
  if (selectedRoom.isGroup === false) {
    return <h2>{selectedRoom.name}</h2>;
  }

  return (
    <>
      <Typography
        variant="h6"
        onClick={handleShow}
        sx={{ '&:hover': { cursor: 'pointer' } }}
      >
        {roomName}
      </Typography>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Change Group Name</DialogTitle>
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
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '400px' }}
          >
            <Controller
              name="name"
              defaultValue={''}
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth autoComplete="off" />
              )}
            />
            <Box sx={{ display: 'flex', mt: '20px', columnGap: '15px' }}>
              <Button variant="contained" type="submit">
                submit
              </Button>
              <Button variant="text" type="submit" onClick={() => reset()}>
                reset
              </Button>
            </Box>
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

TitleForm.propTypes = {
  roomName: PropTypes.string,
};

export default TitleForm;
