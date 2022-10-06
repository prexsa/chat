import React from 'react';
import io  from "socket.io-client";

const SocketContext = React.createContext();

const SocketProvider = ({ children }) => {
  const socket = io("http://localhost:9000");

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export { SocketContext, SocketProvider}