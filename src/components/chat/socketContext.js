import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { useUserContext } from '../../userContext';
import socket from '../../socket';

const SocketContext = React.createContext();

const SocketProvider = ({ children }) => {
  const { user } = useUserContext();
  // const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [channel, setChannel] = useState(null);
  const channelRef = useRef(channel);
  const userRef = useRef(user)
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState(false);
  const [friendList, setFriendList] = useState([])
// console.log('user: ', user)
  /*useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    const accessToken = localStorage.getItem("accessToken")
// console.log('sessionID: ', sessionID)
// console.log('accessToken: ', accessToken)
    if(sessionID) {
      socket.auth = { sessionID, accessToken };
      socket.connect();
    }

    socket.on('session', ({ sessionID, userID, username }) => {
      // console.log('session')
      localStorage.setItem("sessionID", sessionID)
      socket.auth = { sessionID };
      socket.userID = userID;
      // console.log('sessionID: ', sessionID)
      // console.log('socket: ', socket)
    })
  }, [user]);*/

  useEffect(() => {
    socket.connect();
    socket.on('current_user', username => {
      // console.log('usename: ', username)
      setUsername(username)
    })
    socket.on('friends', friendList => {
      console.log('friendList: ', friendList)
      setFriendList(friendList);
    })

    socket.on('connected', (status, username) => {
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
  }, [setFriendList])

  const initReactiveProperties = (user) => {
    user.hasNewMessage = false;
  }

  useEffect(() => {
    socket.on('connnect', () => {
      setUsers(prevUsers => {
        console.log('connect users: ', prevUsers)
        prevUsers.forEach((user) => {
          if(user.self) {
            user.connected = true;
          }
        });
        return [...prevUsers]
      })
    });

    socket.on('disconnect', () => {
      // console.log('disconnect: ')
      setUsers(prevUsers => {
        // console.log('disconnect user: ', prevUsers)
        prevUsers.forEach((user) => {
          if(user.self) {
            user.connected = false;
          }
        });
        return [...prevUsers];
      })
    })

    socket.on('users', (users) => {
      // console.log('users: ', users)
      // console.log('socket: ', socket)
      users.forEach((user) => {
        user.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
        });

        user.self = user.userID === socket.userID;
        initReactiveProperties(user);
        /*setUsers(prevState => {
          console.log('prevState; 1', prevState)
          for(let i = 0; i < prevState.length; i++) {
            const existingUser = prevState[i];
            console.log('existingUser: ', existingUser)
            if(existingUser.userID === user.userID) {
              existingUser.connected = user.connected;
              existingUser.messages = user.messages;
              return;
            }
          }
          console.log('prevState; 2', prevState)
          return [...prevState]
        })*/
      });
      // put the current user first, and then sort by username
      const sortedUsers = users.sort((a, b) => {
        if(a.self) return -1;
        if(b.self) return 1;
        if(a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      })
      // console.log('sortedUsers :', sortedUsers)
      // setUsers(prevUsers => [...prevUsers, ...users])
      setUsers([...sortedUsers])
    })
  }, [])

  useEffect(() => {
    // console.log('private msg')
    socket.on('user connected', (user) => {
      // console.log('user connected: ', user)
      // console.log('user: 2', user)
      setUsers(prevState => {
        const index = prevState.findIndex(prev => prev.userID === user.userID);
        if(index < 0) {
          prevState.push(user)
        }
        for(let i = 0; i < prevState.length; i++) {
          const existingUser = prevState[i];
          if(existingUser.userID === user.userID) {
            existingUser.connected = true;
            break;
          }
        }
        // initReactiveProperties(user);
        return [...prevState]
      })
    })

    socket.on('user disconnected', (id) => {
      console.log('user disconnected ', id)
      setUsers(prevUsers => {
        console.log('prevUsers; ', prevUsers)
        if(prevUsers !== undefined || Array.isArray(prevUsers)) {
          console.log('prevUsers: ', prevUsers)
          for(let i = 0; i < prevUsers.length; i++) {
            const user = prevUsers[i];
            if(user.userID === id) {
              user.connected = false;
              break;
            }
          }
          console.log('prevUsers: ', prevUsers)
          return [...prevUsers];
        }
      })
    })

    socket.on('private msg', handleIncomingMessages)
    return () => socket.disconnect();
  }, [socket])

  useEffect(() => {
    socket.on('typingResp', ({toggleState, to}) => {
      // console.log('toggleState: ', toggleState, ' to; ', to)
      // console.log('channel: ', channelRef.current)
      // console.log('user: ', userRef.current)
      // const channel = JSON.parse(localStorage.getItem('channel'))
      if(userRef.current !== null && userRef.current.id === to) {
        setFeedback(toggleState)
      }
    })

    return () => socket.close();
  }, [socket])

  useEffect(() => {
    // console.log('user: ', user)
    // console.log('users; ', users)
    // console.log('channelRef : ', channelRef.current)
    // console.log('channel: ', channel)
    // console.log({user, users, channelRef, channel})
  }, [user, users])

  socket.on('connect_error', (err) => {
    // console.log('connection err: ', err)
  })

  const handleIncomingMessages = ({ from, msg, to, fromName }) => {
    console.log('from: ', from, 'msg: ', msg, 'to: ', to)
    // setMessages(prevMsgs => [...prevMsgs, { from, msg, to, fromName }])
    // console.log('channelRef : ', channelRef.current)
    // console.log('useRef: ', userRef.current)
    setUsers(prevUsers => {
      /*prevUsers.map(user => {
        // console.log('user: ', user)
        const fromSelf = socket.userID === from;
        if(user.userID === to || user.userID === from) {
          user.messages.push({
            from,
            msg,
            to,
            fromName
          })
        }

        if(user !== channelRef.current) {
          user.hasNewMessage = true;
        }
      })*/
      for(let i = 0; i < prevUsers.length; i++) {
        const user = prevUsers[i];
        const fromSelf = socket.userID === from;
        if(user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            msg,
            fromSelf,
          });
          if(user !== channelRef.current) {
            user.hasNewMessage = true;
          }
          break;
        }
      }
console.log('prevUsers: ', prevUsers)
      return [...prevUsers]
    })
  }

  const loginSocket = (username) => {
    setUsername(username)
    const accessToken = localStorage.getItem("accessToken")
    const sessionID = localStorage.getItem("sessionID");
    socket.auth = { username, accessToken, sessionID };
    socket.connect();
    // socket.emit('login', username)
  }

  const selectChannel = (channel) => {
    // console.log('channel; ', channel)
    setChannel(channel);
    channelRef.current = channel;
    setUsers(prevUsers => {
      prevUsers.map(user => {
        if(user.id === channel.id) {
          user.hasNewMessage = false;
        }
      })
      return [...prevUsers]
    })
  }

  const onMessageSend = (msg) => {
    // console.log('channel: onMessageSend', channel)
    socket.emit('private msg', { to: channel.userID, msg: msg });
    setChannel(prevState => {
      // console.log('prevState; ', prevState)
      prevState.messages.push({
        to: channel.userID,
        msg: msg,
        fromSelf: true
      })
      return prevState;
    })
  }

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
        feedback,
        loginSocket,
        selectChannel,
        onMessageSend,
        handleTypingIndicator,
        logoff,
        friendList,
        setFriendList
      }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => {
  return useContext(SocketContext);
}

export { SocketContext, SocketProvider }