import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { isTokenValid } from '../../utils/tokenUtils';

export const PrivateRoute = () => {
  const { isAuthenticated, token, isInitialized, loading } = useSelector((state) => state.auth);
  const currentToken = token || localStorage.getItem('token');
  const hasValidToken = !!currentToken && isTokenValid(currentToken);
  const isAuth = isAuthenticated && hasValidToken;

  if (!isInitialized && loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#09090B',
        }}
      >
        <CircularProgress sx={{ color: '#22c55e' }} />
      </Box>
    );
  }

  return isAuth ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
