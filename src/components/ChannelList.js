import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import socket from '../socket';

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
      console.log('users: ', users)
      setUsers([...connectedUsers])
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
            return (
              <li key={user.id} onClick={() => handleOnClick(user.id)}>{user.name}</li>
            )
          })
        }
      </div>
      <button className="logout-btn" onClick={handleLogOut}>logout</button>
    </aside>
  )
}

export default ChannelList;