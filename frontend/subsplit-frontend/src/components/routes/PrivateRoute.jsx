import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateRoute = () => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const isAuth = isAuthenticated || !!token || !!localStorage.getItem('token');

  return isAuth ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
