import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../userContext';
import socket from '../socket';
import './ChannelList.css';

function ChannelList({ handleChannel, users, channel }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  // const [users, setUsers] = useState([]);
  // const [newMessages, setNewMessages] = useState(false);
  const username = user.name;
  // console.log('users: ', users)
  const handleOnClick = (user) => {
    handleChannel(user)
  }

  const handleLogOut = () => {
    socket.emit('remove', username)
    navigate('/')
    window.location.reload();
  }

  return (
    <aside className="sidebar">
      <div>{username}</div>
      <h2>Chat Circle</h2>
      {/*<button className="get-users-btn" onClick={handleGetUsers}>Get Users</button>*/}
      <div className="users-container">
        {
          users && users.map((user, index) => {
            // console.log('user: ', user)
            if(channel !== null && channel.id === user.id) {
              user.hasNewMessage = false;
            }
            return (
              <li key={user.id} onClick={() => handleOnClick(user)}>
                <div className='left'>
                  <div className="user-name">
                    {user.name}
                  </div>
                  <div className="user-status">
                    <div className={`icon ${user.connected ? 'connected': ''}`}></div>
                    online
                  </div>

                </div>
                <div className='right'>
                  <div className={`${user.hasNewMessage ? "new-messages" : ""}`}>!</div>
                </div>
              </li>
            )
          })
        }
      </div>
      <button className="logout-btn" onClick={handleLogOut}>logout</button>
    </aside>
  )
}

export default ChannelList;