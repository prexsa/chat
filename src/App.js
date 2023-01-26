import { Routes, Route } from "react-router-dom";
// import Login from './components/Login';
// import Signup from './components/Signup'
import LoginRFH from './components/Login.RFH';
import SignupRFH from './components/Signup.RFH'
import Chat from './components/chat/Chat';
import PageNotFound from './components/PageNotFound';
import PrivateRoutes from './components/PrivateRoutes';
import { UserProvider } from './userContext';
// import Loading from './components/Loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <UserProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<LoginRFH />} />
          {/*<Route path="/loading" element={<Loading />} />*/}
          <Route path="/register" element={<SignupRFH />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/chat" element={<Chat />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
