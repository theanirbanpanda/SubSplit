import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import { X, ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function JoinModal({ open, onClose, listing }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('confirm'); // 'confirm' or 'success'

  if (!listing) return null;

  const { title, price, hostName = 'Vikram S.' } = listing;

  const handlePay = () => {
    setStep('success');
  };

  const handleFinish = () => {
    setStep('confirm');
    onClose();
    navigate('/app/dashboard');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: '#111114',
          border: '1px solid #2A2A30',
          color: '#ffffff',
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#ffffff' }}>
          {step === 'confirm' ? 'Confirm Group Joining' : 'Joining Successful! 🎉'}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#A1A1AA' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2, pb: 2 }}>
        {step === 'confirm' ? (
          <Box>
            {/* Listing Summary Box */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', background: '#18181C', border: '1px solid #2A2A30', mb: 2.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', mb: 0.5 }}>
                {title}
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#A1A1AA' }}>
                Host: {hostName} • Verified KYC ID
              </Typography>

              <Divider sx={{ my: 1.5, borderColor: '#2A2A30' }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 600 }}>
                  Monthly Slot Price
                </Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: '#3b82f6' }}>
                  ₹{price}
                </Typography>
              </Stack>
            </Paper>

            {/* Escrow Guarantee Box */}
            <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', mb: 3 }}>
              <Stack direction="row" spacing={1.25} alignItems="flex-start">
                <ShieldCheck size={20} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                <Box>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#22c55e' }}>
                    100% Escrow Protected
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#A1A1AA', mt: 0.3, lineHeight: 1.5 }}>
                    Your ₹{price} payment remains locked in SubSplit Escrow and will only be released to {hostName} after you confirm active access.
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePay}
              endIcon={<ArrowRight size={18} />}
              sx={{
                fontWeight: 800,
                fontSize: '0.98rem',
                py: 1.3,
                borderRadius: '12px',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
              }}
            >
              Pay ₹{price} & Join Group
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(34,197,94,0.15)',
                border: '2px solid #22c55e',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <CheckCircle2 size={36} color="#22c55e" />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', mb: 1 }}>
              Welcome to the Group!
            </Typography>

            <Typography sx={{ fontSize: '0.88rem', color: '#A1A1AA', mb: 3, lineHeight: 1.6 }}>
              Your deposit is safely held in escrow. Access credentials and invite link have been delivered to your user dashboard.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={handleFinish}
              sx={{
                fontWeight: 800,
                fontSize: '0.95rem',
                py: 1.2,
                borderRadius: '12px',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              }}
            >
              Go to User Dashboard
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default JoinModal;
