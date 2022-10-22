import { useState, useContext } from 'react';
import { UserContext } from '../userContext';
import socket from '../socket';
// import axios from 'axios';
import './MessagePanel.css';

function MessagePanel({ channel, messages }) {
  // console.log('channel: ', channel)
  // console.log('messages: ', messages)
  const { user } = useContext(UserContext);
  /*const username = user.name;*/
  const [inputVal, setInputVal] = useState('');
// console.log('user: ', user)
  const handleSubmit = (e) => {
    e.preventDefault();
    if(channel === null) return;
    if(inputVal === '') return;
    // setMessages([...messages, inputVal])
    // console.log('channel: ', channel)
    // handleEmit({ to: channel.id, msg: inputVal })
    socket.emit('private msg', { to: channel.id, msg: inputVal });
    setInputVal("");
  }
  const handleOnChange = (e) => {
    setInputVal(e.target.value);
  }

  return (
    <div className="chat-box">
      <div className="chat-header">
        {
          channel && <h2>{channel.name}</h2>
        }
      </div>
      <ul className="message-container">
        {
          messages && messages.map((msg, index) => {
            // console.log('msg: ', msg)
            // console.log('channel ', channel)
            // console.log('msg.from === channel.id ', channel !== null && msg.from === channel.id)
            // console.log('msg.from === user.id ', msg.from === user.id)
            if(channel !== null && msg.from === channel.id) {
              return (
                <li key={index}>
                  <img className="message-img" alt="" src={"./connect.svg"} />
                  <div className="message-text">
                    {msg.msg}
                  </div>
                </li>
              )
            }
            if(msg.from === user.id && channel.id === msg.to) {
              return (
                <li key={index}>
                  <img className="message-img" alt="" src={"./connect.svg"} />
                  <div className="message-text">
                    {msg.msg}
                  </div>
                </li>
              )
            }
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