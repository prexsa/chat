import { useState, useEffect, useRef } from 'react';
import io  from "socket.io-client";
import './App.css';
// const socket = io(); // if FrontEnd on same domain as server

function App() {
  const [inputVal, setInputVal] = useState('');
  // const [socket, setSocket] = useState(null);
  // const [list, setList] = useState([]);
  const socketRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    socketRef.current.emit('user', inputVal)
    setInputVal("");
  }
  const handleOnChange = (e) => {
    setInputVal(e.target.value);
  }

  useEffect(() => {
    socketRef.current = io("http://localhost:9000");

    socketRef.current.on('user', function(msg) {
      console.log('msg: ', msg)
      // setList([...list, ...[msg]])
    })
    // close the connection
    return () => socketRef.current.close();
  }, []);

  return (
    <div className="app">
      <div>
        <form onSubmit={handleSubmit} >
          <input type="text" className="input" placeholder="your username" value={inputVal} onChange={handleOnChange} />
        </form>
        <button>send</button>
      </div>
      {inputVal}
    </div>
  );
}

export default App;
