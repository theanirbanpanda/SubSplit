import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PublicRoute = () => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const isAuth = isAuthenticated || !!token || !!localStorage.getItem('token');

  return isAuth ? <Navigate to="/app/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
