import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoutes = () => {
  const { token } = useAuth();

  // Redirect to root
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
