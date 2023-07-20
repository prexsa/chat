import { useContext, useState } from 'react';
import { FaUserCircle, FaCheck } from 'react-icons/fa';
import { FriendContext, SocketContext } from "./Chat";

function ChannelList() {
  const { friendList, setFriendList, channel, setChannel } = useContext(FriendContext);
  // const { messages } = useContext(MessagesContext);
  const { socket } = useContext(SocketContext);
  const [activeIndex, setActiveIndex] = useState(null);

  const onChannelSelect = (channelObj, index) => {
    // console.log('channel: ', channelObj)
    setActiveIndex(index)
    setChannel({
      ...channelObj, 
      username: channelObj?.username || channelObj?.title
    })
    if(channelObj.userId === "" && index === null) return;
    // get messages for channel
    setFriendList(prevFriends => {
      return [...prevFriends].map(friend => {
        if(friend.userId === channelObj.userId) {
          // friend.hasNewMessage = false;
          // friend.unreadCount = 0;
          // console.log('friend: ', friend)
          socket.connect();
          // socket.emit('clear_unread_count', { roomId: channelObj.userID })
          socket.emit('handle_room_selected', { channelId: channelObj.userId })
        }
        return friend;
      })
    })
  }

  const setBadgeCSS = (value) => {
    return Number(value) < 10 ? 'badge' : 'badge double-digits';
  }
// console.log('friendList: ', friendList)
  return (
    <div className="channel-list-cntr">
      <button className="btn btn-link" onClick={() => onChannelSelect({ userId: "" }, null)}>Clear Message Panel</button>
      <ul>
        {
          friendList && friendList.map((friend, index) => {
            // console.log(friend)
            // clear unreadCount if channel is active
            if(friend.userId === channel.userId) {
              friend.unreadCount = 0
            }
            return (
              <li
                className={`${activeIndex === index ? 'active-list-item': ''} list-item-cntr`}
                key={friend?.userId || friend?.roomId}
                onClick={() => onChannelSelect(friend, index)}
              >
                {/*<span className={`status ${friend.connected === 'true' ? 'green' : 'orange'}`}></span>*/}
                {/*<FaUserCircle className={`faUserCicle-channelList ${friend.connected === 'true' ? 'green-border' : 'orange-border'}`} />*/}
                <FaUserCircle className="faUserCicle-channelList" />
                <div className="list-item-right">
                  <div className="list-item-right-header">
                    <h3 className="header-item-name">{friend?.username || friend?.title}</h3>
                    <div className="header-item-time">10:30 PM</div>
                  </div>
                  <div className="message-alerts">
                    <p className="snippet">{friend.latestMessage}</p>
                    <div className="newMessages">
                    {
                      friend.unreadCount === '0' || friend.unreadCount === 0 ?
                      <FaCheck className="faCheck-img" />
                      :
                      <span className={setBadgeCSS(friend.unreadCount)}>{friend.unreadCount}</span>
                    }
                      </div>
                    {/*<div className={`newMessages ${friend?.hasNewMessage === true ? 'show' : 'hide'}`}>!</div>*/}
                  </div>
                </div>
              </li>
            )
          })
        }
        {/*<li className={`list-item-cntr`}>
          <FaUserCircle className="faUserCicle-channelList" />
          <div className="list-item-right">
            <div className="list-item-right-header">
              <h3 className="header-item-name">Victoria</h3>
              <div className="header-item-time">10:30 PM</div>
            </div>
            <div className="message-alerts">
              <p className="snippet">
                Have a great time driving up to the PNW, and visiting the area. Be safe. I hope you enjoy driving your Brabus
              </p>
              <div className={`newMessages`}><span className="badge">9</span></div>
            </div>
          </div>
        </li>
        <li className={`list-item-cntr`}>
          <FaUserCircle className="faUserCicle-channelList" />
          <div className="list-item-right">
            <div className="list-item-right-header">
              <h3 className="header-item-name">Shara</h3>
              <div className="header-item-time">10:30 PM</div>
            </div>
            <div className="message-alerts">
              <p className="snippet">
                Have a great time driving up to the PNW, and visiting the area. Be safe. I hope you enjoy driving your Brabus
              </p>
              <div className={`newMessages`}><span className="badge double-digits">29</span></div>
            </div>
          </div>
        </li>*/}
      </ul>
    </div>
  )
}

export default ChannelList;

// https://www.uplabs.com/posts/chat-ui-design-0b930711-4cfd-4ab4-b686-6e7785624b16