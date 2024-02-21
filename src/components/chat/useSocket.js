/* eslint-disable */
import { useEffect, useRef } from 'react';

const useSocket = (
  setRoomList,
  setMessages,
  setUser,
  selectedRoom,
  setSelectedRoom,
  setFeedback,
  setSearchOptions,
  setPendingRequests,
  socket,
) => {
  // const { channel } = useContext(FriendContext);
  // console.log('channel: ', channel)
  // console.log('socket: ', socket)
  const selectedRoomRef = useRef(selectedRoom);
  selectedRoomRef.current = selectedRoom;
  useEffect(() => {
    socket.connect();
    if (socket.connected) {
      // socket will not reconnect after disconnect or logoff
      // if socket.connect === true, close and open connection
      socket.close();
      socket.open();
    }
    // console.log('connect', () => console.log('connect to socket server'))
    socket.on('current_user', (username) => {
      // console.log('usename: ', username);
      setUser(username);
    });
    socket.on('roomList', (roomList) => {
      // console.log('roomList: ', roomList);
      setRoomList(roomList);
    });

    socket.on('connected', (status, userId) => {
      setRoomList((prevFriends) => {
        return [...prevFriends].map((friend) => {
          if (friend.userId === userId) {
            friend.connected = status;
          }
          return friend;
        });
      });
    });

    socket.on('new_friend', (newFriend) => {
      // console.log('new_friend: ', newFriend)
      setRoomList((prevFriends) => {
        return [newFriend, ...prevFriends];
      });
    });

    socket.on('requests_to_connect', ({ mappedNameToUserId }) => {
      // const { username, userId } = userInfo;
      // console.log('userInfo: ', mappedNameToUserId);
      setPendingRequests((prevState) => {
        // check for duplicates
        const set = new Set(prevState.map(({ userId }) => userId));
        const combined = [
          ...prevState,
          ...mappedNameToUserId.filter(({ userId }) => !set.has(userId)),
        ];
        // console.log('combined:', combined);
        return [...combined];
      });
    });

    socket.on('request_accepted', (updatedUserRecord) => {
      console.log('updatedUserRecord ', updatedUserRecord);
    });

    socket.on('remove_from_chat', ({ roomId, usernameToRemove }) => {
      // console.log('remove_from_chat: ', { roomId, usernameToRemove })
      setRoomList((prevFriends) => {
        // console.log('prevFriends: ', prevFriends)
        if (prevFriends === undefined) return;
        let index = null;
        for (const [key, { userId, username }] of [...prevFriends].entries()) {
          if (userId === roomId && username === usernameToRemove) {
            index = key;
          }
        }
        const updatedFriendsList = prevFriends
          .slice(0, index)
          .concat(prevFriends.slice(index + 1));
        return updatedFriendsList;
      });
    });

    socket.on('dm', (msg) => {
      console.log('ms: ', msg);
      const { date, message, userId, roomId } = msg;

      setRoomList((prevRoom) => {
        return [...prevRoom].map((room) => {
          if (room.roomId === roomId) {
            room.messages.push({ date, message, userId });
            room.hasNewMessage = true;
            room.unreadCount = room.hasOwnProperty('unreadCount')
              ? room.unreadCount + 1
              : 1;
          }
          return room;
        });
      });

      return;
      // console.log('dm channel: ', channelRef.current)
      if (selectedRoomRef.current.userId === msg.from) {
        socket.emit('clear_unread_count', { roomId: msg.from });
      }
      // socket.emit('handle_room_selected', { channelId: channelObj.userID })
      setRoomList((prevFriends) => {
        // console.log('prevFriends: ', prevFriends)
        // console.log('channel: ', channelRef)
        return [...prevFriends].map((friend) => {
          // if channel is active
          if (msg.isGroup) {
            if (friend.roomId === msg.to) {
              friend.latestMessage = msg.content;
            }
          } else {
            if (msg.from === friend.userId) {
              friend.latestMessage = msg.content;
            }
          }
          return friend;
        });
      });
      // console.log('channelRef: ', channelRef)
      // if incoming messages matches active channel, add messages to message array
      if (msg.isGroup) {
        if (msg.to === selectedRoomRef.current.roomId) {
          setMessages((prevMsg) => {
            return [...prevMsg, msg];
          });
        }
      } else {
        if (msg.from === selectedRoomRef.current.userId) {
          setMessages((prevMsg) => {
            return [...prevMsg, msg];
          });
        }
      }
    });

    socket.on('update_group_name', ({ roomId, updatedTitle }) => {
      // update channel title, if active
      if (selectedRoomRef.current.roomId === roomId) {
        setSelectedRoom((prevState) => ({
          ...prevState,
          title: updatedTitle,
        }));
      }
      setRoomList((prevFriends) => {
        return [...prevFriends].map((friend) => {
          // console.log('update_group_name: ', friend)
          if (friend.roomId === roomId) {
            friend.title = updatedTitle;
          }
          return friend;
        });
      });
    });

    socket.on('unread-count', ({ userId, count }) => {
      // console.log('unread-count: ', { userId, count })
      setRoomList((prevFriends) => {
        return [...prevFriends].map((friend) => {
          if (friend.userId === userId) {
            friend.unreadCount = count;
          }
          return friend;
        });
      });
    });

    socket.on('all_messages', (msgs) => {
      // console.log('all_messages: ', msgs)
      setMessages(msgs);
    });

    socket.on('room_msgs', (msgs) => {
      // console.log('msgs: ', msgs)
      setMessages(msgs);
    });

    socket.on('typing_feedback', (feedbackToggle) => {
      // console.log('typing_feedback: ', feedbackToggle)
      setFeedback(feedbackToggle);
    });

    socket.on('connection_error', () => {
      console.log('socket connection error');
    });

    return () => {
      socket.off('current_user');
      socket.off('friends');
      socket.off('connected');
      socket.off('new_friend');
      socket.off('dm');
      socket.off('msg');
      socket.off('remove_from_chat');
      socket.off('unread-count');
      socket.off('update_group_name');
      socket.off('search_users_db');
      socket.off('requests_to_connect');
    };
  }, [
    setRoomList,
    setMessages,
    setUser,
    socket,
    setFeedback,
    selectedRoomRef,
    setSelectedRoom,
  ]);

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
};

export default useSocket;
