import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../context/userContext';

function useAuth() {
  const { user } = useUserContext();
  return user && user.loggedIn;
}

function PrivateRoutes() {
  let isAuth = useAuth();
  // for developing
  // isAuth = true;
  return isAuth ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoutes;
