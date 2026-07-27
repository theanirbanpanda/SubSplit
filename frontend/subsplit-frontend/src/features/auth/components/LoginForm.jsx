import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Stack,
  Divider,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useLogoClick from '../../../hooks/useLogoClick';

function LoginForm({ onLogin, onSwitchToSignup, onSwitchToForgot, loading }) {
  const navigate = useNavigate();
  const handleLogoClick = useLogoClick();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    onLogin({ email, password, rememberMe });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3.5, sm: 4.5 },
        borderRadius: '24px',
        background: '#14161a',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#f3f4f6',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* SubSplit Typographic Wordmark Header */}
      <Box 
        onClick={handleLogoClick}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          gap: 1,
          mb: 2
        }}
      >
        <Box sx={{ 
          width: 28, 
          height: 28, 
          background: '#22c55e', 
          borderRadius: '6px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#09090b'
        }}>
          <Shield size={16} fill="currentColor" />
        </Box>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: '1.45rem',
            color: '#f3f4f6',
            letterSpacing: '-0.04em',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Sub<Box component="span" sx={{ color: '#22c55e' }}>Split</Box>
        </Typography>
      </Box>

      <Box sx={{ mb: 3.5 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.65rem', letterSpacing: '-0.03em', mb: 0.75 }}
        >
          Welcome Back
        </Typography>
        <Typography sx={{ color: '#9ca3af', fontSize: '0.92rem', lineHeight: 1.5 }}>
          Enter your email and password to access your subscription dashboard.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Email Field */}
        <Box mb={2.5}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6', mb: 0.75 }}>
            Email Address
          </Typography>
          <TextField
            fullWidth
            required
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={18} color="#9ca3af" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                background: '#1c1e24',
                color: '#f3f4f6',
                fontSize: '0.92rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: '#2563eb' },
                '&.Mui-focused': { borderColor: '#2563eb', boxShadow: '0 0 0 3px rgba(37,99,235,0.2)' },
              },
            }}
          />
        </Box>

        {/* Password Field */}
        <Box mb={2}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6', mb: 0.75 }}>
            Password
          </Typography>
          <TextField
            fullWidth
            required
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={18} color="#9ca3af" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword(!showPassword)} sx={{ color: '#9ca3af' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                background: '#1c1e24',
                color: '#f3f4f6',
                fontSize: '0.92rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: '#2563eb' },
                '&.Mui-focused': { borderColor: '#2563eb', boxShadow: '0 0 0 3px rgba(37,99,235,0.2)' },
              },
            }}
          />
        </Box>

        {/* Remember me & Forgot Password */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{ color: 'rgba(255,255,255,0.2)', '&.Mui-checked': { color: '#2563eb' } }}
              />
            }
            label={
              <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 500 }}>
                Remember Me
              </Typography>
            }
          />

          <Link
            underline="hover"
            onClick={onSwitchToForgot}
            sx={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
          >
            Forgot Password?
          </Link>
        </Stack>

        {/* Log In Primary CTA */}
        <Button
          fullWidth
          type="submit"
          disabled={loading}
          variant="contained"
          size="large"
          endIcon={<ArrowRight size={18} />}
          sx={{
            fontWeight: 800,
            fontSize: '0.95rem',
            py: 1.3,
            borderRadius: '12px',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 18px rgba(37, 99, 235, 0.4)',
            mb: 2.5,
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              boxShadow: '0 6px 24px rgba(37, 99, 235, 0.55)',
            },
          }}
        >
          {loading ? 'Authenticating...' : 'Log In'}
        </Button>

        {/* Bottom Link */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af' }}>
            Don't have an account?{' '}
            <Link
              underline="hover"
              onClick={onSwitchToSignup}
              sx={{ color: '#2563eb', fontWeight: 800, cursor: 'pointer' }}
            >
              Create one
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default LoginForm;
