import { useContext, useState } from "react";
import { FriendContext, SocketContext } from "./Main";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckIcon from "@mui/icons-material/Check";

function ChannelList() {
  const { friendList, setFriendList, channel, setChannel } =
    useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [activeIndex, setActiveIndex] = useState(null);

  const onChannelSelect = (channelObj, index) => {
    // console.log('channel: ', channelObj)
    setActiveIndex(index);
    setChannel({
      ...channelObj,
      username: channelObj?.username || channelObj?.title,
      isGroup: channelObj.hasOwnProperty("roomId"),
      // checks whether channel is a group, group has 'roomId' instead of 'userId'
    });
    if (channelObj.userId === "" && index === null) return;
    // get messages for channel
    setFriendList((prevFriends) => {
      return [...prevFriends].map((friend) => {
        if (friend.userId === channelObj.userId) {
          socket.connect();
          // socket.emit('clear_unread_count', { roomId: channelObj.userID })
          socket.emit("handle_room_selected", {
            channelId: channelObj?.userId || channelObj?.roomId,
            isGroup: channelObj.hasOwnProperty("roomId"),
          });
        }
        return friend;
      });
    });
  };

  const setBadgeCSS = (value) => {
    return Number(value) < 10 ? "badge" : "badge double-digits";
  };
  // console.log('friendList: ', friendList)
  return (
    <div className="channel-list-cntr">
      <button
        className="btn btn-link"
        onClick={() => onChannelSelect({ userId: "" }, null)}
      >
        Clear Message Panel
      </button>
      <ul>
        {friendList &&
          friendList.map((friend, index) => {
            // console.log(friend)
            // clear unreadCount if channel is active
            if (friend.userId === channel.userId) {
              friend.unreadCount = 0;
            }
            return (
              <li
                className={`${
                  activeIndex === index ? "active-list-item" : ""
                } list-item-cntr`}
                key={friend?.userId || friend?.roomId}
                onClick={() => onChannelSelect(friend, index)}
              >
                <AccountCircleIcon className="faUserCicle-channelList" />
                <div className="list-item-right">
                  <div className="list-item-right-header">
                    <h3 className="header-item-name">
                      {friend?.username || friend?.title}
                    </h3>
                    <div className="header-item-time">10:30 PM</div>
                  </div>
                  <div className="message-alerts">
                    <p className="snippet">{friend.latestMessage}</p>
                    <div className="newMessages">
                      {friend.unreadCount === "0" ||
                      friend.unreadCount === 0 ? (
                        <CheckIcon className="faCheck-img" />
                      ) : (
                        <span className={setBadgeCSS(friend.unreadCount)}>
                          {friend.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default ChannelList;

// https://www.uplabs.com/posts/chat-ui-design-0b930711-4cfd-4ab4-b686-6e7785624b16
