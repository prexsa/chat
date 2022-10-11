import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import socket from '../socket';
import './ChannelList.css';

function ChannelList({ handleSetSocketID }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);

  const handleOnClick = (userSocketID) => {
    handleSetSocketID(userSocketID)
  }

  const handleLogOut = () => {
    const username = location.state.username;
    socket.emit('remove', username)
    navigate('/')
    window.location.reload();
  }

  useEffect(() => {
    socket.on('user connected', async function(user) {
      console.log('user: 2', user)
      setUsers([...users, user])
    })

    socket.on('connected users', async function(connectedUsers) {
      console.log('users: ', connectedUsers)
      const username = location.state.username;
      const removeSelf = connectedUsers.filter(user => user.name !== username)

      setUsers([...removeSelf])
    })
  }, [users])

  return (
    <aside className="sidebar">
      <div>{location.state.username}</div>
      <h2>Chat Circle</h2>
      {/*<button className="get-users-btn" onClick={handleGetUsers}>Get Users</button>*/}
      <div className="users-container">
        {
          users.map((user, index) => {
            console.log('user: ', user)
            return (
              <li key={user.id} onClick={() => handleOnClick(user.id)}>
                <div className="user-name">
                  {user.name}
                </div>
                <div className="user-status">
                  <div className={`icon ${user.connected ? 'connected': ''}`}></div>
                  online
                </div>
                <div className="new-messages"></div>
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