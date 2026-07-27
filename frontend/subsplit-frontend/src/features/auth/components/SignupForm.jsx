import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Stack,
  Paper,
  InputAdornment,
  IconButton,
  LinearProgress,
  MenuItem,
} from '@mui/material';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Smartphone, MapPin, Building } from 'lucide-react';
import { INDIAN_STATES_CITIES } from '../../../data/indianStatesCities';

function SignupForm({ onSignup, onSwitchToLogin, loading, serverError }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Map backend server errors to specific fields if present
  useEffect(() => {
    if (serverError) {
      const lower = serverError.toLowerCase();
      if (lower.includes('email')) {
        setErrors((prev) => ({ ...prev, email: serverError }));
      } else if (lower.includes('password')) {
        setErrors((prev) => ({ ...prev, password: serverError }));
      } else {
        setErrors((prev) => ({ ...prev, form: serverError }));
      }
    }
  }, [serverError]);

  // Password Strength Calculation
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
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First Name is required.';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last Name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Privacy Policy.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSignup({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      password,
    });
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

      {errors.form && (
        <Box sx={{ mb: 2.5, p: 1.5, borderRadius: '10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <Typography sx={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>
            {errors.form}
          </Typography>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* First Name & Last Name */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2.5}>
          {/* First Name */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 0.75 }}>
              First Name
            </Typography>
            <TextField
              fullWidth
              required
              placeholder="John"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
              }}
              error={Boolean(errors.firstName)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={18} color={errors.firstName ? '#ef4444' : '#A1A1AA'} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  background: '#18181C',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  border: errors.firstName ? '1px solid #ef4444' : '1px solid #2A2A30',
                  '& fieldset': { border: 'none' },
                  '&:hover': { borderColor: errors.firstName ? '#ef4444' : '#3b82f6' },
                  '&.Mui-focused': { borderColor: errors.firstName ? '#ef4444' : '#3b82f6', boxShadow: errors.firstName ? '0 0 0 3px rgba(239,68,68,0.2)' : '0 0 0 3px rgba(59,130,246,0.2)' },
                },
              }}
            />
            {errors.firstName && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.5, fontWeight: 600 }}>
                {errors.firstName}
              </Typography>
            )}
          </Box>

          {/* Last Name */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 0.75 }}>
              Last Name
            </Typography>
            <TextField
              fullWidth
              required
              placeholder="Doe"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
              }}
              error={Boolean(errors.lastName)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={18} color={errors.lastName ? '#ef4444' : '#A1A1AA'} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  background: '#18181C',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  border: errors.lastName ? '1px solid #ef4444' : '1px solid #2A2A30',
                  '& fieldset': { border: 'none' },
                  '&:hover': { borderColor: errors.lastName ? '#ef4444' : '#3b82f6' },
                  '&.Mui-focused': { borderColor: errors.lastName ? '#ef4444' : '#3b82f6', boxShadow: errors.lastName ? '0 0 0 3px rgba(239,68,68,0.2)' : '0 0 0 3px rgba(59,130,246,0.2)' },
                },
              }}
            />
            {errors.lastName && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.5, fontWeight: 600 }}>
                {errors.lastName}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Email Address */}
        <Box mb={2.5}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 0.75 }}>
            Email Address
          </Typography>
          <TextField
            fullWidth
            required
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            error={Boolean(errors.email)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={18} color={errors.email ? '#ef4444' : '#A1A1AA'} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                background: '#18181C',
                color: '#ffffff',
                fontSize: '0.92rem',
                border: errors.email ? '1px solid #ef4444' : '1px solid #2A2A30',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: errors.email ? '#ef4444' : '#3b82f6' },
                '&.Mui-focused': { borderColor: errors.email ? '#ef4444' : '#3b82f6', boxShadow: errors.email ? '0 0 0 3px rgba(239,68,68,0.2)' : '0 0 0 3px rgba(59,130,246,0.2)' },
              },
            }}
          />
          {errors.email && (
            <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.5, fontWeight: 600 }}>
              {errors.email}
            </Typography>
          )}
        </Box>

        {/* Password */}
        <Box mb={2.5}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 0.75 }}>
            Password
          </Typography>
          <TextField
            fullWidth
            required
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            error={Boolean(errors.password)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={18} color={errors.password ? '#ef4444' : '#A1A1AA'} />
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
                border: errors.password ? '1px solid #ef4444' : '1px solid #2A2A30',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: errors.password ? '#ef4444' : '#3b82f6' },
                '&.Mui-focused': { borderColor: errors.password ? '#ef4444' : '#3b82f6', boxShadow: errors.password ? '0 0 0 3px rgba(239,68,68,0.2)' : '0 0 0 3px rgba(59,130,246,0.2)' },
              },
            }}
          />
          {errors.password && (
            <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.5, fontWeight: 600 }}>
              {errors.password}
            </Typography>
          )}
          {password && !errors.password && (
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
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            error={Boolean(errors.confirmPassword)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={18} color={errors.confirmPassword ? '#ef4444' : '#A1A1AA'} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                background: '#18181C',
                color: '#ffffff',
                fontSize: '0.92rem',
                border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid #2A2A30',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: errors.confirmPassword ? '#ef4444' : '#3b82f6' },
                '&.Mui-focused': { borderColor: errors.confirmPassword ? '#ef4444' : '#3b82f6', boxShadow: errors.confirmPassword ? '0 0 0 3px rgba(239,68,68,0.2)' : '0 0 0 3px rgba(59,130,246,0.2)' },
              },
            }}
          />
          {errors.confirmPassword && (
            <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.5, fontWeight: 600 }}>
              {errors.confirmPassword}
            </Typography>
          )}
        </Box>

        {/* Terms Checkbox */}
        <Box mb={2.5}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: '' }));
                }}
                sx={{ color: errors.agreeTerms ? '#ef4444' : '#2A2A30', '&.Mui-checked': { color: '#3b82f6' } }}
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
          {errors.agreeTerms && (
            <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.25, fontWeight: 600 }}>
              {errors.agreeTerms}
            </Typography>
          )}
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
