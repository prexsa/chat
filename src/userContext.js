import React, { useState, useEffect } from 'react';
import socket from './socket';

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    socket.on('sender', async function(user) {
      // console.log('sender: ', user)
      setUser({
        id: user.id,
        name: user.name
      })
    })
  }, [user]);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider}