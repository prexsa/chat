import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { socketService } from '../services/socketService';

// For testing
import { useAuth } from './AuthContext';

// Business Logic Layer

const SocketContext = React.createContext();

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [channels, setChannels] = useState([]);
  const [users, setUsers] = useState([]);

  // const [feedbackText, setFeedbackText] = useState('');

  const requestChannelList = () => {
    if (socket) {
      socket.emit('get_channels');
    }
  };

  // For development
  /*
   */
  useEffect(() => {
    // console.log({ token });
    if (token) {
      connectSocket(token);
    }
  }, [token]);

  useEffect(() => {
    if (!socket) return;
    // Establish connection when the application mounts
    socket.connect();
    socket.on('connect', () => {
      console.log('Connect to WebSocket server');
      socket.emit('get_channels');
      requestChannelList();
    });

    socket.on('channel_list', (data) => {
      // console.log('channel_list: ', data);
      setChannels([...data]);
    });

    socket.on('search_users_results', (users) => {
      console.log('users: ', { users });
      setUsers(users);
    });

    /*
    socket?.on('server:message', (rawPayload) => {
      if (rawPayload.roomId === activeRoom) {
        setMessages((prev) => [...prev, rawPayload.message]);
      }
    });
    */

    // Clean up connection when the provider unmounts
    return () => {
      // socket?.off('server:message', callback); // Cleanup
      // Disconnect cleanly when the application unmounts
      socket.off('connect');
      socket.off('channel_list');
      socket.off('search_users_results');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [socket]);

  const connectSocket = (token) => {
    const newSocket = socketService(token);
    setSocket(newSocket);
  };

  const mapUserIdToName = (messages, members) => {
    // console.log({ members });
    return messages.map((msg) => {
      const user = members.find((m) => m.userId === msg.userId);
      // Add username to message obj
      msg.username = user.fullname;
      return msg;
    });
  };

  const changeRoom = (index) => {
    setActiveRoom(channels[index]);
    // console.log('channels[index] ', channels[index]);
    const mapNameToUserId = mapUserIdToName(
      channels[index].messages,
      channels[index].mates,
    );
    // console.log({ mapNameToUserId });
    setMessages(mapNameToUserId); // Clear chat state for new room
  };

  // Search user's database for matching input values
  const searchForUsers = (inputValue) => {
    // console.log('searchForUsers: ', inputValue);
    if (inputValue.trim().length < 0) return;
    socket.emit('search_users', inputValue);
  };

  const addMembers = (members) => {
    console.log('SocketContext ', { members });
    socket.on('add_member', { members }, () => {
      console.log('add_members callback ');
    });
  };

  const sendRequest = (members) => {
    console.log({ members });
    socket.emit('send_request', members, (cb) => {
      console.log('cb send_request ', cb);
      // setFeedbackText(cb.message);
    });
  };

  /*
  const submitMessage = (text) => {
    if (!test.trim()) return; // No empty text allowed

    const payload = { text, roomId: activeRoom };
    socketService?.on('client:message', payload);
  };
  */

  return (
    <SocketContext.Provider
      value={{
        connectSocket,
        activeRoom,
        channels,
        messages,
        changeRoom,
        addMembers,
        searchForUsers,
        sendRequest,
        // feedbackText,
        // setFeedbackText,
        users,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook for clean, effortless imports in components
export const useChat = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
