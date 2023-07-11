import { useContext, useRef, useEffect, useState } from 'react';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import Chatbox from './Chatbox';
import { useUserContext } from '../../userContext';
import { MessagesContext, FriendContext, SocketContext } from './Chat';

function MessagePanel() {
  const bottomRef = useRef(null);
  const { user } = useUserContext();
  const { messages, feedback } = useContext(MessagesContext);
  const { channel, setFriendList, setChannel } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [picture, setPicture] = useState(null)
// console.log('messages; ', messages)
// console.log('user; ', user)
  useEffect(() => {
    // bottomRef.current?.scrollIntoView({block: "end", behavior: 'smooth'});
    bottomRef.current?.scrollIntoView(false);
  }, [messages, feedback, picture])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({block: 'end', inline: 'nearest'});
  }, [channel])

  const handleClearPicture = () => {
    setPicture(null)
  }

  const handleRemoveChannel = () => {
    console.log('channel: ', channel)
    console.log('user: ', user)
    // if(channel.userID === '') return
    // remove channel from your friend's list
    setFriendList(prevFriends => {
      // console.log('prevFriends: ', prevFriends)
      if(prevFriends === undefined) return
      let index = null;
      for(const [key, { userID, username }] of [...prevFriends].entries()) {
        if(userID === channel.userID && username === channel.username) {
          index = key
        }
      }
      const updatedFriendsList = prevFriends.slice(0, index).concat(prevFriends.slice(index + 1))
      return updatedFriendsList
    })
    socket.connect()
    socket.emit('remove_channel', {
      user: {
        userId: user.userID,
        username: user.username 
      }, 
      channel: {
        channelId: channel.userID,
        channelname: channel.username
      }
    })
    setChannel({ userID: "" })
  }

  return (
    <>
      {
        channel.userID === "" ?
        <div className="message-panel-container">
          <h2>Choose a conversation</h2>
          <h3>Click on an existing chat or click "New Chat" to create a new conversation</h3>
        </div>
        :
        <div className="message-panel-container">
          <header>
            <FaUserCircle className="channel-img" />
            <h2>{channel.username}</h2>
            <div className="message-chanel-actions">
              <div className="leave-icon-container">
                <span data-text="Leave chat" className="tooltip-text bottom left">
                  <FaTimes className="leave-icon" onClick={handleRemoveChannel} />
                </span>
              </div>
            </div>
          </header>
          <div className="message-box-container">
            <ul className="chat">
              {
                messages.map((message, idx) => {
                  // console.log('message: ', message)
                  const isYou = message.from === null || message.from === user.userID;
                  return (
                    <li
                      key={idx}
                      className={`${isYou ? 'you' : ''}`}
                    >
                      <div className={`icon-message-container ${isYou ? "flex-direction-row-reverse" : "flex-direction-row"}`}>
                        <FaUserCircle />
                        <div className="message-container">
                          <div>
                            {message.content}
                          </div>
                        </div>
                      </div>
                      <div>
                        {
                          (isYou) ? null : <div className="chat-username-txt">{channel.username}</div>
                        }
                      </div>
                    </li>
                  )
                })
              }
              <li ref={bottomRef}></li>
              <li ref={bottomRef}>
                <img className="image" style={{width: '100px'}} src={picture && picture} alt="" onClick={handleClearPicture} />
              </li>
              <li ref={bottomRef}>{feedback ? `${user.username} is typing...` : ''}</li>
            </ul>
          </div>
          <footer>
            <Chatbox userID={channel.userID} from={user.userID} handleSetPicture={setPicture} />
          </footer>
        </div>
      }
    </>
  )
}

export default MessagePanel;