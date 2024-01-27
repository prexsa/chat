import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// import Signup from './components/Signup'
// import LoginRFH from "./components/Login.RFH";
import SignupRFH from './components/Signup.RFH';
import ForgotPasswordRFH from './components/ForgotPassword.RFH';
import PwResetRFH from './components/PasswordReset.RFH';
import UsernameRFH from './components/Username.RFH';
import Main from './components/chat/Main';
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
          <Route path="/" element={<Login />} />
          {/*<Route path="/loading" element={<Loading />} />*/}
          <Route path="/register" element={<SignupRFH />} />
          <Route path="/forgot-password" element={<ForgotPasswordRFH />} />
          <Route path="/pw-reset" element={<PwResetRFH />} />
          <Route path="/create-username" element={<UsernameRFH />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/chat" element={<Main />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
