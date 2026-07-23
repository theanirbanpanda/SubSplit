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
  LinearProgress,
} from '@mui/material';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

function SignupForm({ onSignup, onSwitchToLogin, loading }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Simple Password Strength
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 40;
    if (/[A-Z]/.test(password)) score += 30;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 30;
    return score;
  };

  const strengthScore = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms & Privacy Policy.');
      return;
    }
    onSignup({ fullName, email, password });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3.5, sm: 4.5 },
        borderRadius: '24px',
        background: '#111114',
        border: '1px solid #2A2A30',
        color: '#ffffff',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, color: '#ffffff', fontSize: '1.65rem', letterSpacing: '-0.03em', mb: 0.75 }}
        >
          Create Your Account
        </Typography>
        <Typography sx={{ color: '#A1A1AA', fontSize: '0.92rem', lineHeight: 1.5 }}>
          Join thousands of smart savers and start splitting subscription costs today.
        </Typography>
      </Box>

      {errorMsg && (
        <Box sx={{ mb: 2, p: 1.5, borderRadius: '10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <Typography sx={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>
            {errorMsg}
          </Typography>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <Box mb={2}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 0.75 }}>
            Full Name
          </Typography>
          <TextField
            fullWidth
            required
            placeholder="Anirban Panda"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User size={18} color="#A1A1AA" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                background: '#18181C',
                color: '#ffffff',
                fontSize: '0.92rem',
                border: '1px solid #2A2A30',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: '#3b82f6' },
                '&.Mui-focused': { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.2)' },
              },
            }}
          />
        </Box>

        {/* Email Address */}
        <Box mb={2}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 0.75 }}>
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
                  <Mail size={18} color="#A1A1AA" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                background: '#18181C',
                color: '#ffffff',
                fontSize: '0.92rem',
                border: '1px solid #2A2A30',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: '#3b82f6' },
                '&.Mui-focused': { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.2)' },
              },
            }}
          />
        </Box>

        {/* Password */}
        <Box mb={2}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 0.75 }}>
            Password
          </Typography>
          <TextField
            fullWidth
            required
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={18} color="#A1A1AA" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword(!showPassword)} sx={{ color: '#A1A1AA' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                background: '#18181C',
                color: '#ffffff',
                fontSize: '0.92rem',
                border: '1px solid #2A2A30',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: '#3b82f6' },
                '&.Mui-focused': { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.2)' },
              },
            }}
          />
          {password && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={strengthScore}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: '#2A2A30',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: strengthScore >= 70 ? '#22c55e' : strengthScore >= 40 ? '#f59e0b' : '#ef4444',
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Confirm Password */}
        <Box mb={2.5}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 0.75 }}>
            Confirm Password
          </Typography>
          <TextField
            fullWidth
            required
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={18} color="#A1A1AA" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                background: '#18181C',
                color: '#ffffff',
                fontSize: '0.92rem',
                border: '1px solid #2A2A30',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: '#3b82f6' },
                '&.Mui-focused': { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.2)' },
              },
            }}
          />
        </Box>

        {/* Terms Checkbox */}
        <Box mb={2.5}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                sx={{ color: '#2A2A30', '&.Mui-checked': { color: '#3b82f6' } }}
              />
            }
            label={
              <Typography sx={{ fontSize: '0.8rem', color: '#A1A1AA' }}>
                I agree to the{' '}
                <Link underline="hover" href="#" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link underline="hover" href="#" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                  Privacy Policy
                </Link>
                .
              </Typography>
            }
          />
        </Box>

        {/* Create Account Primary CTA */}
        <Button
          fullWidth
          type="submit"
          onClick={handleSubmit}
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        {/* Bottom Link */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#A1A1AA' }}>
            Already have an account?{' '}
            <Link
              underline="hover"
              onClick={onSwitchToLogin}
              sx={{ color: '#3b82f6', fontWeight: 800, cursor: 'pointer' }}
            >
              Log In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default SignupForm;
