import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Container, Alert, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../authSlice';
import { ROUTES, MESSAGES } from '../../../constants';
import '../styles/auth.scss';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!fullName || !email || !password) {
      setValidationError(MESSAGES.ERRORS.REQUIRED_FIELDS);
      return;
    }

    if (password !== confirmPassword) {
      setValidationError(MESSAGES.ERRORS.PASSWORDS_DONT_MATCH);
      return;
    }

    if (password.length < 6) {
      setValidationError(MESSAGES.ERRORS.PASSWORD_MIN_LENGTH);
      return;
    }

    const result = await dispatch(
      registerUser({
        fullName,
        email,
        phone,
        password,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleInputChange = (setter) => (e) => {
    if (error) dispatch(clearAuthError());
    if (validationError) setValidationError('');
    setter(e.target.value);
  };

  const displayError = validationError || error;

  return (
    <Box className="auth-container">
      <Container maxWidth="xs">
        <Card elevation={0} className="auth-card">
          <CardContent>
            <Box className="auth-header">
              <Box className="auth-logo">
                S
              </Box>
              <Typography variant="h5" className="auth-title">Create Account</Typography>
              <Typography variant="body2" className="auth-subtitle">Join SubSplit to manage & split expenses</Typography>
            </Box>

            {displayError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {displayError}
              </Alert>
            )}

            <form onSubmit={handleRegister}>
              <TextField 
                label="Full Name *" 
                variant="outlined" 
                fullWidth 
                required 
                className="auth-field"
                value={fullName}
                onChange={handleInputChange(setFullName)}
                disabled={loading}
              />
              <TextField 
                label="Email Address *" 
                type="email"
                variant="outlined" 
                fullWidth 
                required 
                className="auth-field"
                value={email}
                onChange={handleInputChange(setEmail)}
                disabled={loading}
              />
              <TextField 
                label="Phone Number" 
                variant="outlined" 
                fullWidth 
                className="auth-field"
                value={phone}
                onChange={handleInputChange(setPhone)}
                disabled={loading}
              />
              <TextField 
                label="Password *" 
                type="password" 
                variant="outlined" 
                fullWidth 
                required 
                className="auth-field"
                value={password}
                onChange={handleInputChange(setPassword)}
                disabled={loading}
              />
              <TextField 
                label="Confirm Password *" 
                type="password" 
                variant="outlined" 
                fullWidth 
                required 
                className="auth-field-lg"
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
                <Link to={ROUTES.AUTH} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Register;
