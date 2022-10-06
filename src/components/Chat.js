import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import useChat from '../hooks/useChat';
import './Chat.css';
// import { UsersContext } from '../usersContext';

function Chat() {
  const navigate = useNavigate();
  // const { users } = useContext(UsersContext)
  const [inputVal, setInputVal] = useState('');
  // const [users, setUsers] = useState(null)
  const { messages, sendMessage, users, getAllUsers, removeUser } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    // socketRef.current.emit('user', inputVal)
    sendMessage(inputVal);
    setInputVal("");
  }
  const handleOnChange = (e) => {
    setInputVal(e.target.value);
  }

  useEffect(() => {
    getAllUsers()
  }, []);

  const handleLogOut = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    // console.log('user: ', user)
    removeUser(user.id)
  }

  return (
    <div className="chat-container">
      <aside className="sidebar">
        <h2>Chat Circle</h2>
        <div className="users-container">
          {
            users.map((user, index) => {
              return (
                <li key={user.id}>{user.name}</li>
              )
            })
          }
        </div>
        <button className="logout-btn" onClick={handleLogOut}>logout</button>
      </aside>
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
    </div>
  )
}

export default Chat;