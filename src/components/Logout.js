import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
// import socket from '../socket';
import { SocketContext } from './chat/Chat';

function Logout() {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext)

  const handleLogout = () => {
    /*const sessionID = localStorage.getItem("sessionID");
    localStorage.removeItem("sessionID")*/
    localStorage.removeItem("accessToken")
    // console.log('logoff')
    socket.connect();
    socket.emit('logoff')
    // logoff();
    // socket.emit('logoff', sessionID)
    navigate('/')
    // window.location.reload();
  }

  return <button className="logout-btn" onClick={() => handleLogout()}>logout</button>
}

export default Logout;