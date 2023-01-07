import { Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup'
import ChatProvider from './components/chat/ChatProvider';
import './App.css';
import { UserProvider } from './userContext';
// const socket = io(); // if FrontEnd on same domain as server
function App() {
  return (
    <UserProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/chat" element={<ChatProvider />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
