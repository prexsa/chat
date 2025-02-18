import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Box, Button } from '@mui/material';
import { SocketContext, FriendContext } from '../chat/Main';
import { FormInputText } from '../Inputs/FormInputText';
// import EditIcon from '@mui/icons-material/Edit';

const TitleForm = () => {
  const { socket } = useContext(SocketContext);
  const { selectedRoom, setSelectedRoom, setRoomList } =
    useContext(FriendContext);
  const methods = useForm({
    defaultValues: { groupName: selectedRoom.name },
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = methods;
  const onSubmit = async (data) => {
    // setName(data.name)
    // console.log('data: ', data);
    if (selectedRoom.name === data.groupName) return;

    socket.emit(
      'update_group_name',
      { roomId: selectedRoom.roomId, name: data.groupName },
      () => {
        setSelectedRoom((prevState) => ({
          ...prevState,
          name: data.groupName,
        }));
        setRoomList((prevState) => {
          // console.log('prevState: ', prevState);
          return [...prevState].map((room) => {
            // console.log('room: ', room);
            if (room.roomId === selectedRoom.roomId) {
              room.name = data.groupName;
            }
            return room;
          });
        });
      },
    );
  };

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
        label="Group name"
        // defaultValue={selectedRoom.name}
      />
      <Box sx={{ display: 'flex', mt: '20px', columnGap: '15px' }}>
        <Button variant="contained" type="submit" disabled={!isDirty}>
          update
        </Button>
        <Button
          variant="text"
          type="submit"
          onClick={() => reset({ groupName: selectedRoom.name })}
        >
          reset
        </Button>
      </Box>
    </Box>
  );
};

export default TitleForm;
