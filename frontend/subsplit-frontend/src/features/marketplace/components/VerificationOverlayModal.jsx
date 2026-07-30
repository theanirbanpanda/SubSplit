import React, { useEffect } from 'react';
import { Dialog, DialogContent, Typography, Box } from '@mui/material';
import { ShieldCheck, Bot, Sparkles } from 'lucide-react';
import { keyframes } from '@emotion/react';

const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { transform: scale(1.08); opacity: 1; box-shadow: 0 0 30px 10px rgba(34, 197, 94, 0.6); }
  100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
`;

function VerificationOverlayModal({ open, onComplete }) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [open, onComplete]);

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          background: '#14161a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1.5rem',
          color: '#f3f4f6',
          p: 3,
          textAlign: 'center',
          maxWidth: 420,
          width: '100%',
        },
      }}
    >
      <DialogContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {/* Animated Icon Ring */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.12)',
            border: '2px solid rgba(34, 197, 94, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: `${pulseGlow} 2s infinite ease-in-out`,
            mb: 1,
          }}
        >
          <Bot size={42} color="#22c55e" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Sparkles size={20} color="#3b82f6" />
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.2rem' }}>
            Verifying Login Proof
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#9ca3af', lineHeight: 1.5, maxWidth: 340 }}>
          AI system is analyzing the screenshot to confirm subscription service access window. Holding escrow funds will be settled upon approval.
        </Typography>

        {/* Animated Scanning Bar */}
        <Box
          sx={{
            width: '100%',
            height: 4,
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 2,
            overflow: 'hidden',
            mt: 2,
          }}
        >
          <Box
            sx={{
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
              borderRadius: 2,
              animation: 'scanBar 1.5s infinite ease-in-out alternate',
              '@keyframes scanBar': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(200%)' },
              },
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default VerificationOverlayModal;
