import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isTokenValid } from '../../utils/tokenUtils';

export const PublicRoute = () => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const currentToken = token || localStorage.getItem('token');
  const hasValidToken = !!currentToken && isTokenValid(currentToken);
  const isAuth = isAuthenticated && hasValidToken;

  return isAuth ? <Navigate to="/app/marketplace" replace /> : <Outlet />;
};

export default PublicRoute;
