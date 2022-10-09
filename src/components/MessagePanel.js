import { useState, useEffect } from 'react';
import socket from '../socket';

function MessagePanel({ socketID }) {
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('private msg', { to: socketID, msg: inputVal });
    setInputVal("");
  }
  const handleOnChange = (e) => {
    setInputVal(e.target.value);
  }
  useEffect(() => {
    socket.on('private msg', function({ from, msg }) {
      console.log('from: ', from, ' msg: ', msg)
      setMessages([...messages, msg])
    })
  }, [messages])

  return (
    <div className="chat-box">
      <ul className="message-container">
        {
          messages.map((msg, index) => {
            return (
              <li key={index}>{msg}</li>
            )
          })
        }
      </ul>
      <div className="footer">
        <div id="feedback"></div>
        <form id="form" onSubmit={handleSubmit}>
          <span>
            <input
              type="text"
              id="input"
              value={inputVal}
              autoComplete="off"
              onChange={handleOnChange}
            />
          </span>
          <button>Send</button>
        </form>
      </div>
    </div>
  )
}

export default MessagePanel;