import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button } from '@mui/material';
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

  return <Button 
    // className="logout-btn" 
    variant="contained"
    onClick={() => handleLogout()}
    disableElevation
    fullWidth
    sx={{ backgroundColor: 'grey', borderRadius: '0' }}
    >
      logout
    </Button>
}

export default Logout;