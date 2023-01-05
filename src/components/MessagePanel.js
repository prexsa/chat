import { useState, useMemo, useEffect } from 'react';
import { useSocketContext } from '../socketContext';
import { FaChrome, FaEmpire } from 'react-icons/fa';

function MessagePanel({ lastMessageRef }) {
  const { user, channel, messages, feedback, onMessageSend, handleTypingIndicator } = useSocketContext();
  const [inputVal, setInputVal] = useState('');
  // console.log('channel: ', channel)
  // console.log('user: ', user)
  const handleSubmit = (e) => {
    e.preventDefault();
    if(channel === null) return;
    if(inputVal === '') return;
    onMessageSend(inputVal.trim())
    setInputVal("");
  }
  const handleOnChange = (e) => {
    setInputVal(e.target.value);
  }

  const handleOnKeyDown = () => {
    // if(channel === null) return;
    // socket.emit('typing', {toggleState: true, to: channel.id})
      /*setTimeout(() => {
        // socket.emit('typing', {toggleState: false, to: channel.id})
      }, 500)*/
      // handleTypingIndicator()
    // onKeyDownHandler(channel)
  }

  const debounce = (cb, delay = 1000) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  }

  const throttle = (cb, delay = 1000) => {
    let shouldWait = false;
    return (...args) => {
      if(shouldWait) return;
      cb(...args);
      shouldWait = true;
      setTimeout(() => {
        shouldWait = false;
      }, delay)
    }
  }

  const onKeyDownHandler = useMemo(
    () => debounce((channel) => {
      // socket.emit('typing', {toggleState: true, to: channel.id})
    }, 1000)
  , [])

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
              channel !== null && channel.messages.map((msg, idx) => {
                // console.log('mes: ', msg)
                return (
                  <li key={idx} className={`${msg.fromSelf ? 'you' : ''}`}>
                    {/*<img alt="" src={"./connect.svg"} />*/}
                    <FaChrome />
                    <div className="message-container">
                      <div>
                        {msg.msg}
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <footer>
            <div id="feedback">{ feedback ? 'is typing...': '' }</div>
            <form onSubmit={handleSubmit}>
              <textarea
                type="text"
                id="input"
                value={inputVal}
                placeholder="Type your message"
                rows="3"
                autoComplete="off"
                onChange={handleOnChange}
                // onKeyDown={handleOnKeyDown}
              ></textarea>
              <input id="submit" type="submit" value="Send" />
              {/*<button>Send</button>*/}
            </form>
          </footer>
        </div>
      }
    </div>
  )
}

export default MessagePanel;