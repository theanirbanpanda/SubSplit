import React from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.scss';

function Auth() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
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

            <form onSubmit={handleLogin}>
              <TextField 
                label="Email Address" 
                variant="outlined" 
                fullWidth 
                required 
                className="auth-field"
                defaultValue="user@subsplit.com"
              />
              <TextField 
                label="Password" 
                type="password" 
                variant="outlined" 
                fullWidth 
                required 
                className="auth-field-lg"
                defaultValue="password123"
              />
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                size="large"
                className="auth-button"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Auth;
