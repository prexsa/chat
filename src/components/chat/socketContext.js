import React, { useContext, useState, useEffect, useRef } from 'react';
import { useUserContext } from '../../userContext';
import socket from '../../socket';


/*
  NOT IN USE
*/
const SocketContext = React.createContext();

const SocketProvider = ({ children }) => {
  // const userRef = useRef(user)
  // const [user, setUser] = useState(null);
  const { user } = useUserContext();
  /*const [username, setUsername] = useState('');
  const [channel, setChannel] = useState(null);
  const channelRef = useRef(channel);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [friendList, setFriendList] = useState([]);*/
  // const [feedback, setFeedback] = useState(false);

  useEffect(() => {
    console.log('SC friendList: ', friendList);
    console.log('SC channel: ', channel)
  },[friendList, channel])

  useEffect(() => {
    socket.connect();
    socket.on('current_user', username => {
      //console.log('usename: ', username)
      setUsername(username)
    })
    socket.on('friends', friendList => {
      console.log('friendList: ', friendList)
      setFriendList(friendList);
    })

    socket.on('connected', (status, username) => {
      console.log('connected')
      setFriendList(prevFriends => {
        return [...prevFriends].map((friend) => {
          if(friend.username === username) {
            friend.connected = status
          }
          return friend;
        })
      })
    })

    socket.on('new_friend', newFriend => {
      // console.log('new_friend: ', newFriend)
      setFriendList(prevFriends => {
        return [newFriend, ...prevFriends]
      })
    })

    socket.on('dm', msg => {
      setMessages(prevMsg => {
        return [...prevMsg, msg]
      })
    })

    socket.on('msg', msgs => {
      setMessages(msgs)
    })

    return () => {
      socket.off("current_user");
      socket.off('friends');
      socket.off('connected');
      socket.off('new_friend');
      socket.off('dm');
      socket.off('msg')
    }
  }, [setFriendList, setMessages, setChannel])

  useEffect(() => {
    console.log('channel: ', channel)
    if(channel !== null) {
      socket.connect();
      // console.log('ehl')
      socket.emit('room_msgs', channel.userID, ({ msgs }) => {
        console.log('cb: ', msgs)
        setMessages(msgs)
      })
    }
  }, [channel])

  socket.on('connect_error', (err) => {
    // console.log('connection err: ', err)
  })

  /*const loginSocket = (username) => {
    setUsername(username)
    const accessToken = localStorage.getItem("accessToken")
    const sessionID = localStorage.getItem("sessionID");
    socket.auth = { username, accessToken, sessionID };
    socket.connect();
    // socket.emit('login', username)
  }*/

  /*const selectChannel = (channel) => {
    // console.log('channel; ', channel)
    setChannel(channel);
    channelRef.current = channel;
    setUsers(prevUsers => {
      prevUsers.map(user => {
        if(user.id === channel.id) {
          user.hasNewMessage = false;
        }
        return user;
      })
      return [...prevUsers]
    })
  }*/

  const clearTypingIndicator = (channel) => {
    socket.emit('typing', {toggleState: false, to: channel.id})
  }

  const sendTypingIndicator = (channel) => {
    // console.log('channel; ', channel)
    socket.emit('typing', {toggleState: true, to: channel.id})
  }

  const handleTypingIndicator = () =>  {
    sendTypingIndicator(channel);
    setTimeout(() => clearTypingIndicator(channel), 2000)
  }

  const logoff = () => {
    socket.disconnect();
  }

  return (
    <SocketContext.Provider
      value={{
        username,
        users,
        messages,
        channel,
        setChannel,
        // feedback,
        // loginSocket,
        // selectChannel,
        handleTypingIndicator,
        logoff,
        // friendList,
        // setFriendList
      }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => {
  return useContext(SocketContext);
}

export { SocketContext, SocketProvider }