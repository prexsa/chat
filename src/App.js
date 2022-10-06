import { Routes, Route } from "react-router-dom";
import Logon from './components/Logon';
import Chat from './components/Chat';
import './App.css';
// const socket = io(); // if FrontEnd on same domain as server
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Logon />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
