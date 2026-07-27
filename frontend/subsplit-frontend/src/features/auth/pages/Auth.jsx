import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import ProfileCompletionForm from '../components/ProfileCompletionForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import ValidationAlert from '../components/ValidationAlert';
import { registerUser, loginUser, clearAuthError } from '../authSlice';

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Mode: 'login' | 'signup' | 'onboarding' | 'forgot_password'
  const [mode, setMode] = useState(location.state?.mode || 'login');

  useEffect(() => {
    if (location.state?.mode) {
      setMode(location.state.mode);
    }
  }, [location.state?.mode]);
  const [successMsg, setSuccessMsg] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Handle Login
  const handleLoginSubmit = async (credentials) => {
    dispatch(clearAuthError());
    const action = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(action)) {
      setSuccessMsg(action.payload?.message || 'Login successful! Welcome back to SubSplit.');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 500);
    }
  };

  // Handle Signup
  const handleSignupSubmit = async (userData) => {
    dispatch(clearAuthError());
    const action = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(action)) {
      setSuccessMsg(action.payload?.message || 'Account created successfully! Please log in.');
      setSnackbarOpen(true);
      setMode('login');
    }
  };

  // Handle Profile Completion
  const handleProfileCompleteSubmit = (profileData) => {
    setSuccessMsg('Profile setup complete! Launching SubSplit...');
    setSnackbarOpen(true);
    setTimeout(() => {
      navigate('/app/dashboard');
    }, 500);
  };

  return (
    <AuthLayout>
      {mode === 'login' && (
        <LoginForm
          onLogin={handleLoginSubmit}
          onSwitchToSignup={() => {
            dispatch(clearAuthError());
            setMode('signup');
          }}
          onSwitchToForgot={() => {
            dispatch(clearAuthError());
            setMode('forgot_password');
          }}
          loading={loading}
          serverError={error}
        />
      )}

      {mode === 'signup' && (
        <SignupForm
          onSignup={handleSignupSubmit}
          onSwitchToLogin={() => {
            dispatch(clearAuthError());
            setMode('login');
          }}
          loading={loading}
          serverError={error}
        />
      )}

      {mode === 'onboarding' && (
        <ProfileCompletionForm
          onComplete={handleProfileCompleteSubmit}
          loading={loading}
        />
      )}

      {mode === 'forgot_password' && (
        <ForgotPasswordForm
          onSwitchToLogin={() => {
            dispatch(clearAuthError());
            setMode('login');
          }}
        />
      )}

      {/* Snackbar Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%', borderRadius: '12px', fontWeight: 600, background: '#22c55e', color: '#fff' }}
        >
          {successMsg}
        </Alert>
      </Snackbar>
    </AuthLayout>
  );
}

export default Auth;
