import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { SocketContext, FriendContext } from './Main';
// title, isGroup, channelId,
const TitleForm = ({ toggleExpand, setToggleExpand }) => {
  const { socket } = useContext(SocketContext);
  const { selectedRoom, setSelectedRoom, setRoomList } =
    useContext(FriendContext);
  const { register, handleSubmit, setValue, getValues } = useForm({
    mode: 'onChange',
  });
  // console.log('channel: ', selectedRoom);
  const onSubmit = async (data) => {
    // setName(data.name)
    socket.emit(
      'change_group_title',
      { channelId: selectedRoom.roomId, title: data.name },
      () => {
        // console.log('resp: ', resp )
        // console.log('channelId: ', channelId)
        setValue('name', data.name);
        setSelectedRoom((prevState) => ({
          ...prevState,
          title: data.name,
        }));
        setRoomList((prevFriends) => {
          return [...prevFriends].map((friend) => {
            if (friend.roomId === selectedRoom.roomId) {
              friend.title = data.name;
            }
            return friend;
          });
        });
      },
    );
  };

  useEffect(() => {
    // console.log('value: ', getValues('name'))
    // update group title
    const value = getValues('name');
    if (value !== selectedRoom.title) {
      setValue('name', selectedRoom.title);
    }
  }, [selectedRoom, getValues, setValue]);

  // return header only if it is not a group
  if (selectedRoom.isGroup === false) {
    return <h2>{selectedRoom.name}</h2>;
  }

  return (
    <>
      {toggleExpand ? (
        <div className="title-form-input-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id="name"
              name="name"
              size="small"
              fullWidth
              autoComplete="off"
              {...register('name', { value: selectedRoom?.title })}
            />
            <div className="title-form-btn-container">
              <input type="submit" />
              <input
                type="reset"
                onClick={() => setToggleExpand(!toggleExpand)}
              />
            </div>
          </form>
          {/*name && <div>Submitted: {name}</div>*/}
        </div>
      ) : (
        <h2 onClick={() => setToggleExpand(!toggleExpand)}>
          {selectedRoom?.title}
        </h2>
      )}
    </>
  );
};

TitleForm.propTypes = {
  toggleExpand: PropTypes.bool,
  setToggleExpand: PropTypes.func,
};

export default TitleForm;
