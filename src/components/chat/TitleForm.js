/* eslint-disable */
import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';
import { SocketContext, FriendContext } from './Main';
// title, isGroup, channelId,
const TitleForm = ({ roomName }) => {
  const { socket } = useContext(SocketContext);
  const { selectedRoom, setSelectedRoom, setRoomList } =
    useContext(FriendContext);
  const { handleSubmit, setValue, control, reset } = useForm({
    defaultValues: { name: selectedRoom.name },
  });
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

  useEffect(() => {
    setValue('name', selectedRoom.name);
  }, [setValue]);

  // return header only if it is not a group
  if (selectedRoom.isGroup === false) {
    return <h2>{selectedRoom.name}</h2>;
  }

  return (
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
          <TextField
            {...field}
            fullWidth
            autoComplete="off"
            label="Group Name"
          />
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
  );
};

TitleForm.propTypes = {
  roomName: PropTypes.string,
};

export default TitleForm;
