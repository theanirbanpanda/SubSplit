import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Chip,
} from '@mui/material';
import { ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';

function EmailVerificationForm({ email, onVerified, loading }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^[0-9]{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every((digit) => digit !== '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete) {
      onVerified();
    }
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
      <Box sx={{ mb: 3.5, textAlign: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <ShieldCheck size={28} color="#3b82f6" />
        </Box>

        <Typography
          variant="h4"
          sx={{ fontWeight: 900, color: '#ffffff', fontSize: '1.6rem', letterSpacing: '-0.03em', mb: 0.75 }}
        >
          Check Your Email
        </Typography>
        <Typography sx={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: 1.5 }}>
          We sent a 6-digit verification code to{' '}
          <Box component="span" sx={{ color: '#ffffff', fontWeight: 700 }}>
            {email || 'user@subsplit.com'}
          </Box>
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        {/* 6-box OTP Input */}
        <Stack direction="row" spacing={1.25} justifyContent="center" mb={4} onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <Box
              key={index}
              component="input"
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              sx={{
                width: 48,
                height: 56,
                borderRadius: '12px',
                background: '#18181C',
                border: '1.5px solid',
                borderColor: digit ? '#3b82f6' : '#2A2A30',
                color: '#ffffff',
                fontSize: '1.4rem',
                fontWeight: 900,
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.15s ease',
                boxShadow: digit ? '0 0 0 3px rgba(59,130,246,0.2)' : 'none',
                '&:focus': {
                  borderColor: '#3b82f6',
                  boxShadow: '0 0 0 3px rgba(59,130,246,0.3)',
                },
              }}
            />
          ))}
        </Stack>

        {/* Primary CTA */}
        <Button
          fullWidth
          type="submit"
          disabled={!isComplete || loading}
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
            mb: 3,
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
            },
          }}
        >
          {loading ? 'Verifying Code...' : 'Verify Email & Continue'}
        </Button>

        {/* Resend Countdown */}
        <Box sx={{ textAlign: 'center' }}>
          {canResend ? (
            <Button
              size="small"
              onClick={handleResend}
              startIcon={<RotateCcw size={14} />}
              sx={{
                fontSize: '0.85rem',
                color: '#3b82f6',
                fontWeight: 800,
                textTransform: 'none',
              }}
            >
              Resend Code
            </Button>
          ) : (
            <Typography sx={{ fontSize: '0.85rem', color: '#A1A1AA' }}>
              Resend code in{' '}
              <Box component="span" sx={{ color: '#ffffff', fontWeight: 800 }}>
                {timer}s
              </Box>
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default EmailVerificationForm;
