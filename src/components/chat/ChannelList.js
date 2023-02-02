import { useContext, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FriendContext, SocketContext } from "./Chat";

function ChannelList() {
  const { friendList, setFriendList, setChannel } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [activeIndex, setActiveIndex] = useState(null);

  const onChannelSelect = (channel, index) => {
    // console.log('channel: ', channel)
    setActiveIndex(index)
    setChannel(channel)
    if(channel === null && index === null) return;
    setFriendList(prevFriends => {
      return [...prevFriends].map(friend => {
        if(friend.userID === channel.userID) {
          friend.hasNewMessage = false;
          socket.connect();
          socket.emit('clear_has_new_message', channel.userID)
        }
        return friend;
      })
    })
  }

  return (
    <>
      <h2>Chat Circle</h2>
      <button onClick={() => onChannelSelect(null, null)}>Clear Message Panel</button>
      <ul>
        {
          friendList && friendList.map((friend, index) => {
            return (
              <li
                className={`${activeIndex === index ? 'active-list-item': ''}`}
                key={friend.userID}
                onClick={() => onChannelSelect(friend, index)}
              >
                <span className={`status ${friend.connected === 'true' ? 'green' : 'orange'}`}></span>
                <FaUserCircle />
                <div>
                  <h2>{friend.username}</h2>
                </div>
                <div className={`newMessages ${friend?.hasNewMessage === true ? 'show' : 'hide'}`}>!</div>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

export default ChannelList;