import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Link,
} from '@mui/material';
import { Mail, ArrowLeft, Send } from 'lucide-react';

function ForgotPasswordForm({ onSwitchToLogin, onSubmitReset }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    if (onSubmitReset) onSubmitReset(email);
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
      <Box sx={{ mb: 3.5 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, color: '#ffffff', fontSize: '1.65rem', letterSpacing: '-0.03em', mb: 0.75 }}
        >
          Reset Password
        </Typography>
        <Typography sx={{ color: '#A1A1AA', fontSize: '0.92rem', lineHeight: 1.5 }}>
          Enter your registered email address and we'll send you a password reset link.
        </Typography>
      </Box>

      {sent ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography sx={{ fontSize: '0.95rem', color: '#22c55e', fontWeight: 700, mb: 2 }}>
            Password reset link sent to {email}! Check your inbox.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={16} />}
            onClick={onSwitchToLogin}
            sx={{
              borderRadius: '11px',
              borderColor: '#2A2A30',
              color: '#ffffff',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Back to Login
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Box mb={3}>
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

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            endIcon={<Send size={16} />}
            sx={{
              fontWeight: 800,
              fontSize: '0.95rem',
              py: 1.3,
              borderRadius: '12px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 18px rgba(37, 99, 235, 0.4)',
              mb: 2.5,
            }}
          >
            Send Reset Link
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link
              underline="hover"
              onClick={onSwitchToLogin}
              sx={{ fontSize: '0.85rem', color: '#A1A1AA', cursor: 'pointer', fontWeight: 600 }}
            >
              ← Back to Login
            </Link>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

export default ForgotPasswordForm;
