import React from 'react';
import io  from "socket.io-client";

const SocketContext = React.createContext();

const SocketProvider = ({ children }) => {
  const socket = io("http://localhost:9000");

  const registerSocket = (username) => {
    socket.emit('login', username)
  }

  return (
    <SocketContext.Provider
      value={{
      socket,
      registerSocket
      }}
        >
      {children}
    </SocketContext.Provider>
  )
}

export { SocketContext, SocketProvider}