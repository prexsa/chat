import React, { useContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { socket } from '../../socket';

const SocketContext = React.createContext();

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    // Establish connection when the application mounts
    socket.connect();

    return () => {
      // Disconnect cleanly when the application unmounts
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
