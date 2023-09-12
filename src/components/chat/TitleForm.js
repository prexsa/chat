import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { SocketContext, FriendContext } from "./Main";
// title, isGroup, channelId,
export const TitleForm = ({ toggleExpand, setToggleExpand }) => {
  const { socket } = useContext(SocketContext);
  const { channel, setFriendList, setChannel } = useContext(FriendContext);
  const { register, handleSubmit, setValue, getValues } = useForm({
    mode: "onChange",
  });
  // console.log('channel: ', channel)
  const onSubmit = async (data) => {
    // setName(data.name)
    socket.emit(
      "change_group_title",
      { channelId: channel.roomId, title: data.name },
      ({ resp }) => {
        // console.log('resp: ', resp )
        // console.log('channelId: ', channelId)
        setValue("name", data.name);
        setChannel((prevState) => ({
          ...prevState,
          title: data.name,
        }));
        setFriendList((prevFriends) => {
          return [...prevFriends].map((friend) => {
            if (friend.roomId === channel.roomId) {
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
    const value = getValues("name");
    if (value !== channel.title) {
      setValue("name", channel.title);
    }
  }, [channel, getValues, setValue]);

  // return header only if it is not a group
  if (channel.isGroup === false) {
    return <h2>{channel.username}</h2>;
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
              {...register("name", { value: channel?.title })}
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
        <h2 onClick={() => setToggleExpand(!toggleExpand)}>{channel?.title}</h2>
      )}
    </>
  );
};

export default TitleForm;
