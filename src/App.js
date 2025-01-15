import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import PWReset from './pages/PasswordReset';
// import UsernameRFH from './components/Username.RFH';
import Main from './components/chat/Main';
import PageNotFound from './components/PageNotFound';
import PrivateRoutes from './PrivateRoutes';
import { UserProvider } from './context/userContext';
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
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pw-reset" element={<PWReset />} />
          {/*<Route path="/create-username" element={<UsernameRFH />} />*/}
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
