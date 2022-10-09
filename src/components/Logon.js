import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Logon.css';

function Logon() {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState('');

  const handleOnChange = (e) => {
    setInputVal(e.target.value);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:9000/api/check-username', {username: inputVal})
    // console.log('response: ', response.data)
    const { exist } = response.data;
    if(!exist) {
      // localStorage.setItem('username', inputVal)
      setInputVal('')
      navigate('/chat', { state: { username: inputVal }})
    }
  }

  const handleClear = async () => {
    const response = await axios.get('http://localhost:9000/api/clear')
    console.log('response: ', response.data.users)
  }

  const handleGetAllUsers = async () => {
    const response = await axios.get('http://localhost:9000/api/get-users')
    console.log('response: ', response.data.users)
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
      <button onClick={handleGetAllUsers}>get all users</button>
      <button onClick={handleClear}>clear</button>
    </div>
  )
}

export default Logon;