import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './routes/SignIn';
import Chat from './routes/Chat';
import ForgotPassword from './routes/ForgotPassword';
import Signup from './routes/Signup';
import PWReset from './routes/PasswordReset';
// import Main from './components/chat/Main';
import PageNotFound from './components/PageNotFound';
import { ProtectedRoutes } from './routes/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext';
// import Loading from './components/Loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pw-reset" element={<PWReset />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/chat" element={<Chat />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
