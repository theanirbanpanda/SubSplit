import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import EmailVerificationForm from '../components/EmailVerificationForm';
import ProfileCompletionForm from '../components/ProfileCompletionForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import ValidationAlert from '../components/ValidationAlert';

function Auth() {
  const navigate = useNavigate();

  // Mode: 'login' | 'signup' | 'verify' | 'onboarding' | 'forgot_password'
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [userEmail, setUserEmail] = useState('user@subsplit.com');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Handle Login
  const handleLoginSubmit = (credentials) => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Login successful! Welcome back to SubSplit.');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 500);
    }, 500);
  };

  // Handle Signup
  const handleSignupSubmit = (userData) => {
    setLoading(true);
    setError(null);
    setUserEmail(userData.email);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Account created! Please verify your email.');
      setSnackbarOpen(true);
      setMode('verify');
    }, 500);
  };

  // Handle Email Verification
  const handleVerifiedSubmit = () => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Email verified successfully!');
      setSnackbarOpen(true);
      setMode('onboarding');
    }, 500);
  };

  // Handle Profile Completion
  const handleProfileCompleteSubmit = (profileData) => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Profile setup complete! Launching SubSplit...');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 500);
    }, 500);
  };

  return (
    <AuthLayout>
      <ValidationAlert
        error={error}
        success={successMsg && !snackbarOpen ? successMsg : null}
        onClose={() => {
          setError(null);
          setSuccessMsg(null);
        }}
      />

      {mode === 'login' && (
        <LoginForm
          onLogin={handleLoginSubmit}
          onSwitchToSignup={() => {
            setError(null);
            setMode('signup');
          }}
          onSwitchToForgot={() => {
            setError(null);
            setMode('forgot_password');
          }}
          loading={loading}
        />
      )}

      {mode === 'signup' && (
        <SignupForm
          onSignup={handleSignupSubmit}
          onSwitchToLogin={() => {
            setError(null);
            setMode('login');
          }}
          loading={loading}
        />
      )}

      {mode === 'verify' && (
        <EmailVerificationForm
          email={userEmail}
          onVerified={handleVerifiedSubmit}
          loading={loading}
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
            setError(null);
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
