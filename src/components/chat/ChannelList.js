import { useContext } from 'react';
import { FriendContext, MessagesContext, SocketContext } from "./Chat";
// import socket from '../../socket';

function ChannelList() {
  const { friendList, setFriendList, channel, setChannel } = useContext(FriendContext);
  // const { socket } = useContext(SocketContext);
// console.log('friendList: ', friendList)
  const onChannelSelect = channel => {
    // console.log('channel: ', channel)
    setChannel(channel)
    setFriendList(prevFriends => {
      return [...prevFriends].map(friend => {
        if(friend.userID === channel.userID) {
          friend.hasNewMessage = false;
        }
        return friend;
      })
    })
    // socket.emit('channel_msgs', channel.userID)
  }

  return (
    <>
    <button onClick={() => setChannel(null)}>Clear Message Panel</button>
    <ul>
      {
        friendList && friendList.map((friend, index) => {
          // console.log('friend: ', friend)
          return (
            <li key={friend.userID} onClick={() => onChannelSelect(friend)}>
              <img
                src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg"
                alt=""
              />
              <div>
                <h2>{friend.username}</h2>
                <h3>
                  <span className={`status ${friend.connected === 'true' ? 'green' : 'orange'}`}></span>
                  offline
                </h3>
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