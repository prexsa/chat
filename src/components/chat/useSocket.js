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
      setRoomList((prevState) => {
        return [newFriend, ...prevState];
      });
    });

    socket.on('update_new_group_member_roomlist', ({ roomRecord }) => {
      // console.log('update_new_group_member_roomlist: ', roomRecord);
      setRoomList((prevState) => {
        // check if roomId exists
        // console.log('prevState: ', prevState);
        const roomId = roomRecord.roomId;
        if (prevState === undefined) return;
        const exist = prevState.filter((room) => room.roomId === roomId);
        // console.log('exist; ', exist);
        if (exist.length === 0) {
          return [roomRecord, ...prevState];
        }
      });
    });

    socket.on('new_group_created', ({ roomRecord }) => {
      // console.log('roomRecord: ', roomRecord);
      setRoomList((prevState) => {
        return [roomRecord, ...prevState];
      });
    });

    socket.on(
      'new_member_added_to_group',
      ({ roomId, newMemberProfile: { userId, fullname } }) => {
        // check if room is active
        // console.log('new_member_added_to_group: ', { userId, fullname });
        if (selectedRoom.roomId === roomId) {
          // console.log('is it selected');
          setSelectedRoom((prevState) => {
            // console.log((prevState.messages = [...prevState.messages, msg]));
            return (prevState.mates = [...prevState.mates, newMemberProfile]);
          });
        }
        // update roomlist
        setRoomList((prevState) => {
          return [...prevState].map((room) => {
            if (room.roomId === roomId) {
              room.mates.push(newMemberProfile);
            }
            return room;
          });
        });
      },
    );

    socket.on('update_group_name', ({ roomId, name }) => {
      // update channel title, if active
      if (selectedRoomRef.current.roomId === roomId) {
        setSelectedRoom((prevState) => ({
          ...prevState,
          name: name,
        }));
      }
      setRoomList((prevState) => {
        return [...prevState].map((room) => {
          // console.log('update_group_name: ', friend)
          if (room.roomId === roomId) {
            room.name = name;
          }
          return room;
        });
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
        return combined;
      });
    });

    socket.on('request_accepted', (updatedUserRecord) => {
      console.log('updatedUserRecord ', updatedUserRecord);
    });

    socket.on('remove_from_chat', ({ roomId, userIdToRemove }) => {
      console.log('remove_from_chat: ', { roomId, userIdToRemove });

      setRoomList((prevState) => {
        const filtered = prevState.filter((room) => room.roomId !== roomId);
        // console.log('filtered: ', filtered);
        return filtered;
      });
      /*setRoomList((prevFriends) => {
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
      });*/
    });

    socket.on('left_group_chat', ({ roomId, userId }) => {
      setRoomList((prevState) => {
        return [...prevState].map((room) => {
          if (room.roomId === roomId) {
            room.mates = room.mates.filter((mate) => mate.userId !== userId);
          }
          return room;
        });
      });
    });

    socket.on('dm', (msg) => {
      // console.log('ms: ', msg);
      const { date, message, userId, roomId } = msg;
      // check if the user is currently selected
      // console.log('selectedRoom: ', selectedRoom);
      if (selectedRoom.roomId === roomId) {
        // console.log('is it selected');
        setSelectedRoom((prevState) => {
          // console.log((prevState.messages = [...prevState.messages, msg]));
          return (prevState.messages = [...prevState.messages, msg]);
        });
      }

      setRoomList((prevRoom) => {
        return [...prevRoom].map((room) => {
          if (room.roomId === roomId) {
            room.messages.push({ date, message, userId });
            room.hasNewMessage = true;
            const unreadCount =
              room.hasOwnProperty('unreadCount') &&
              room.unreadCount !== undefined
                ? room.unreadCount + 1
                : 1;
            room.unreadCount = unreadCount;
          }
          return room;
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
      socket.off('update_new_group_member_roomlist');
      socket.off('new_member_added_to_group');
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
