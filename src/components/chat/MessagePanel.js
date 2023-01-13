import { useContext, useRef, useEffect } from 'react';
import { FaChrome, FaEmpire } from 'react-icons/fa';
import Chatbox from './Chatbox';
import { MessagesContext, FriendContext } from './Chat';

function MessagePanel() {
  const bottomRef = useRef(null);
  const { messages } = useContext(MessagesContext);
  const { channel } = useContext(FriendContext);
  const user = JSON.parse(localStorage.getItem('user'));
  // console.log('channel: ', channel)
  // console.log('messages: ', messages)
  useEffect(() => {
    // console.log('bottomRef: ', bottomRef.current)
    bottomRef.current?.scrollIntoView({ block: "end", behavior: 'smooth'});
  }, [messages])
  return (
    <div className="chat-box">
      {
        channel == null ?
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <h2>Choose a conversation</h2>
          <h3>Click on an existing chat or click "New Chat" to create a new conversation"</h3>
        </div>
        :
        <div>
          <header>
            <FaEmpire className="channel-img" />
            <h2>{channel.username}</h2>
          </header>
          <ul className="chat">
            {
              messages &&
              messages.filter(
                msg => (msg.to === channel.userID || msg.from === channel.userID)
                ).map((message, idx) => {
                // console.log('message: ', message)
                return (
                  <li
                    key={idx}
                    ref={bottomRef}
                    className={`${message.from === null || message.from === user.userID ? 'you' : ''}`}
                  >
                    <FaChrome />
                    <div className="message-container">
                      <div>
                        {message.content}
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <footer>
            {/*<div id="feedback">{ feedback ? 'is typing...': '' }</div>*/}
            <Chatbox userID={channel.userID} from={user.userID} />
          </footer>
        </div>
      }
    </div>
  )
}

export default MessagePanel;