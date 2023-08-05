import { useEffect, useRef } from 'react';

const useSocket = (setFriendList, setMessages, setUsername, channel, setChannel, setFeedback, socket) => {
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
      // console.log('usename: ', username)
      setUsername(username)
    })
    socket.on('friends', friendList => {
      // console.log('friendList: ', friendList)
      setFriendList(friendList);
    })

    socket.on('connected', (status, userId) => {
      setFriendList(prevFriends => {
        return [...prevFriends].map((friend) => {
          if(friend.userId === userId) {
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

    socket.on('remove_from_chat', ({ roomId, usernameToRemove, isGroup }) => {
      // console.log('remove_from_chat: ', { roomId, usernameToRemove })
      setFriendList(prevFriends => {
        // console.log('prevFriends: ', prevFriends)
        if(prevFriends === undefined) return
        let index = null;
        for(const [key, { userId, username }] of [...prevFriends].entries()) {
          if(userId === roomId && username === usernameToRemove) {
            index = key
          }
        }
        const updatedFriendsList = prevFriends.slice(0, index).concat(prevFriends.slice(index + 1))
        return updatedFriendsList
      })
    })

    socket.on('dm', msg => {
      // console.log('ms: ', msg)
      // console.log('dm channel: ', channelRef.current)
      if(channelRef.current.userId === msg.from) {
        socket.emit('clear_unread_count', { roomId: msg.from })
      }
      // socket.emit('handle_room_selected', { channelId: channelObj.userID })
      setFriendList(prevFriends => {
        // console.log('prevFriends: ', prevFriends)
        // console.log('channel: ', channelRef)
        return [...prevFriends].map(friend => {
          // if channel is active
          if(msg.isGroup) {
            if(friend.roomId === msg.to) {
              friend.latestMessage = msg.content
            }
          } else {
            if(msg.from === friend.userId) {
              friend.latestMessage = msg.content
            }
          }
          return friend;
        })
      })
// console.log('channelRef: ', channelRef)
      // if incoming messages matches active channel, add messages to message array
      if(msg.isGroup) {
        if(msg.to === channelRef.current.roomId) {
          setMessages(prevMsg => {
            return [...prevMsg, msg]
          })
        }
      } else {
        if(msg.from === channelRef.current.userId) {
          setMessages(prevMsg => {
            return [...prevMsg, msg]
          })
        }
      }
    })

    socket.on('update_group_name', ({ roomId, updatedTitle }) => {
      // update channel title, if active
      if(channelRef.current.roomId === roomId) {
        setChannel(prevState => ({
          ...prevState,
          title: updatedTitle
        }))
      }
      setFriendList(prevFriends => {
        return [...prevFriends].map(friend => {
          // console.log('update_group_name: ', friend)
          if(friend.roomId === roomId) {
            friend.title = updatedTitle;
          }
          return friend
        })
      })
    })

    socket.on('unread-count', ({ userId, count }) => {
      // console.log('unread-count: ', { userId, count })
      setFriendList(prevFriends => {
        return [...prevFriends].map(friend => {
          if(friend.userId === userId) {
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
      socket.off('unread-count')
      socket.off('update_group_name')
    }
  }, [setFriendList, setMessages, setUsername, socket, setFeedback, channelRef, setChannel])

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