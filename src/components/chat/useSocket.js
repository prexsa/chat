import { useEffect, useRef } from 'react';

const useSocket = (setFriendList, setMessages, setUsername, channel, setFeedback, socket) => {
  // const { channel } = useContext(FriendContext);
  // console.log('channel: ', channel)
  // console.log('socket: ', socket)
  const channelRef = useRef(channel);
  channelRef.current = channel;
  useEffect(() => {
    socket.connect();
    if(socket.connected) {
      // socket will not reconnect after disconnect or logoff
      // if socket.connect === true, close and open connection
      socket.close();
      socket.open();
    }
    // console.log('connect', () => console.log('connect to socket server'))
    socket.on('current_user', username => {
      //console.log('usename: ', username)
      setUsername(username)
    })
    socket.on('friends', friendList => {
      // console.log('friendList: ', friendList)
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

    socket.on('remove_from_chat', ({ roomId, usernameToRemove}) => {
      // console.log('remove_from_chat: ', { roomId, usernameToRemove })
      setFriendList(prevFriends => {
        // console.log('prevFriends: ', prevFriends)
        if(prevFriends === undefined) return
        let index = null;
        for(const [key, { userID, username }] of [...prevFriends].entries()) {
          if(userID === roomId && username === usernameToRemove) {
            index = key
          }
        }
        const updatedFriendsList = prevFriends.slice(0, index).concat(prevFriends.slice(index + 1))
        return updatedFriendsList
      })
    })

    socket.on('dm', msg => {
      // console.log('ms: ', msg)
      // console.log('dm channel: ', channel)
      setFriendList(prevFriends => {
        // console.log('prevFriends: ', prevFriends)
        // console.log('channel: ', channelRef)
        return [...prevFriends].map(friend => {
          if(
            (channelRef.current === null && friend.userID === msg.from) ||
            (channelRef.current !== null && channelRef.current.userID !== msg.from && friend.userID === msg.from)
            ){
            friend.hasNewMessage = true;
          }
          return friend;
        })
      })
      setMessages(prevMsg => {
        return [...prevMsg, msg]
      })
    })

    socket.on('unread-count', ({ userId, count }) => {
      // console.log('unread-count: ', { userId, count })
      setFriendList(prevFriends => {
        return [...prevFriends].map(friend => {
          if(friend.userID === userId) {
            friend.unreadCount = count
          }
          return friend
        })
      })
    })

    socket.on('all_messages', msgs => {
      // console.log('all_messages: ', msgs)
      setMessages(msgs)
    })

    socket.on('room_msgs', msgs => {
      // console.log('msgs: ', msgs)
      setMessages(msgs)
    })

    socket.on('typing_feedback', feedbackToggle => {
      // console.log('typing_feedback: ', feedbackToggle)
      setFeedback(feedbackToggle)
    })

    socket.on('connection_error', () => {
      console.log('socket connection error')
    })

    return () => {
      socket.off("current_user");
      socket.off('friends');
      socket.off('connected');
      socket.off('new_friend');
      socket.off('dm');
      socket.off('msg');
      socket.off('remove_from_chat')
    }
  }, [setFriendList, setMessages, setUsername, socket, setFeedback])

  /*useEffect(() => {
    // console.log('channel: ', channel)
    if(channel !== null) {
      socket.connect();
      socket.emit('channel_msgs', channel.userID, ({ msgs }) => {
        console.log('cb: ', msgs)
        setMessages(msgs)
      })
    }
  }, [channel])*/
}

export default useSocket;