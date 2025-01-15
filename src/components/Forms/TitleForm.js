import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button } from '@mui/material';
import { SocketContext, FriendContext } from '../chat/Main';
import { FormInputText } from '../Inputs/FormInputText';

const TitleForm = () => {
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
      <FormInputText
        name={'groupName'}
        control={control}
        label={'Group Name'}
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

export default TitleForm;
