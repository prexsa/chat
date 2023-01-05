import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Chat from './components/Chat';
import Signup from './components/Signup'
import './App.css';
// const socket = io(); // if FrontEnd on same domain as server
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
