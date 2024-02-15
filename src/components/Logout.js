import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { SocketContext } from './chat/Main';

function Logout({ handleCloseMenu }) {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  const handleLogout = () => {
    handleCloseMenu();
    localStorage.removeItem('accessToken');
    socket.connect();
    socket.emit('logoff');
    navigate('/');
  };

  return (
    <Button
      variant="text"
      onClick={() => handleLogout()}
      disableElevation
      fullWidth
    >
      logout
    </Button>
  );
}

Logout.propTypes = {
  handleCloseMenu: PropTypes.func,
};

export default Logout;
