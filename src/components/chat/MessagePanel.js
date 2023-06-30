import { useContext, useRef, useEffect } from 'react';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import Chatbox from './Chatbox';
import { useUserContext } from '../../userContext';
import { MessagesContext, FriendContext, SocketContext } from './Chat';

function MessagePanel() {
  const bottomRef = useRef(null);
  const { user } = useUserContext();
  const { messages, feedback } = useContext(MessagesContext);
  const { channel } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    // bottomRef.current?.scrollIntoView({block: "end", behavior: 'smooth'});
    bottomRef.current?.scrollIntoView(false);
  }, [messages, feedback])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({block: 'end', inline: 'nearest'});
  }, [channel])

  const handleRemoveChannel = () => {
    console.log('channel: ', channel)
    console.log('user: ', user)
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
  }

  return (
    <>
      {
        channel == null ?
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
          <ul className="chat">
            {
              messages &&
              messages.filter(
                msg => (msg.to === channel.userID || msg.from === channel.userID)
                ).map((message, idx) => {
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
            <li ref={bottomRef} id="feedback">{feedback ? `${user.username} is typing...` : ''}</li>
          </ul>
          <footer>
            <Chatbox userID={channel.userID} from={user.userID} />
          </footer>
        </div>
      }
    </>
  )
}

export default MessagePanel;