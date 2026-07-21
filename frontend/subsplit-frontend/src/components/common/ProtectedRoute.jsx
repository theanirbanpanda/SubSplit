import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';

const ProtectedRoute = () => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !token) {
    return <Navigate to={ROUTES.AUTH} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
