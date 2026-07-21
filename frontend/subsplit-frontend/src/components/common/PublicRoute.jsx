import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../../constants';

const PublicRoute = () => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  if (isAuthenticated && token) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
