import { useState, useContext } from 'react';
// import { useNavigate } from "react-router-dom";
// import { SocketContext } from '../socketContext'
import useChat from '../hooks/useChat';
import './Logon.css';

function Logon() {
  // const navigate = useNavigate();
  // const socket = useContext(SocketContext);
  const { join, success, resetSuccess } = useChat();
  const [inputVal, setInputVal] = useState('');

  const handleOnChange = (e) => {
    setInputVal(e.target.value);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    join(inputVal);
    // navigate('/chat')
    setInputVal('')
  }
  return (
    <div className="logon-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a username"
          value={inputVal}
          onChange={handleOnChange}
        />
        <button>join</button>
      </form>
    </div>
  )
}

export default Logon;