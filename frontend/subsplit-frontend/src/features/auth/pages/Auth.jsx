import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Container, Alert, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../authSlice';
import { ROUTES } from '../../../constants';
import '../styles/auth.scss';

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleInputChange = (setter) => (e) => {
    if (error) dispatch(clearAuthError());
    setter(e.target.value);
  };

  return (
    <Box className="auth-container">
      <Container maxWidth="xs">
        <Card elevation={0} className="auth-card">
          <CardContent>
            <Box className="auth-header">
              <Box className="auth-logo">
                S
              </Box>
              <Typography variant="h5" className="auth-title">Welcome to SubSplit</Typography>
              <Typography variant="body2" className="auth-subtitle">Settle your shared bills hassle-free</Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <TextField 
                label="Email Address" 
                variant="outlined" 
                fullWidth 
                required 
                className="auth-field"
                value={email}
                onChange={handleInputChange(setEmail)}
                disabled={loading}
              />
              <TextField 
                label="Password" 
                type="password" 
                variant="outlined" 
                fullWidth 
                required 
                className="auth-field-lg"
                value={password}
                onChange={handleInputChange(setPassword)}
                disabled={loading}
              />
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                size="large"
                className="auth-button"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link to={ROUTES.REGISTER} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Auth;
