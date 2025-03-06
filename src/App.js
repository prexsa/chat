import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './routes/Login';
import ForgotPassword from './routes/ForgotPassword';
import Signup from './routes/Signup';
import PWReset from './routes/PasswordReset';
import Main from './components/chat/Main';
import PageNotFound from './components/PageNotFound';
import PrivateRoutes from './routes/PrivateRoutes';
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
          <Route path="/signup" element={<Signup />} />
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
