import { useEffect, useRef } from 'react';
// import socket from '../../socket';
// import { FriendContext } from './Chat';

const useSocket = (setFriendList, setMessages, setUsername, channel, socket) => {
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

    socket.on('channel_msgs', msg => {
      // console.log('channel_msgs: ', msg)
      // setMessages(msg);
    })

    socket.on('all_messages', msgs => {
      // console.log('all_messages: ', msgs)
      setMessages(msgs)
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
      socket.off('msg')
    }
  }, [setFriendList, setMessages, setUsername, socket])

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