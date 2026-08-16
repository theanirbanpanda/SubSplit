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
  Paper,
} from '@mui/material';
import { X, ShieldCheck, CheckCircle2, ArrowRight, AlertTriangle, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { submitJoinRequest } from '../../marketplaceSlice';
import { fetchMyWallet } from '../../../settlements/walletSlice';
import KycUploadModal from '../../../profile/components/KycUploadModal';

function JoinModal({ open, onClose, listing }) {
  const navigate = useNavigate();
  const { kycStatus } = useSelector((state) => state.auth);
  const isVerifying = kycStatus?.kycStatus === 'VERIFYING' || kycStatus?.kycStatus === 'IN_PROGRESS';

  const [step, setStep] = useState('confirm'); // 'confirm', 'success', or 'insufficient_balance'
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [kycUploadModalOpen, setKycUploadModalOpen] = useState(false);


  if (!listing) return null;

  const { title, price, hostName = 'Vikram S.' } = listing;

  const handlePay = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await dispatch(submitJoinRequest({ listingId: listing.rawId || listing.id })).unwrap();
      dispatch(fetchMyWallet());
      setLoading(false);
      setStep('success');
    } catch (err) {
      setLoading(false);
      const message = typeof err === 'string' ? err : (err?.message || 'Failed to complete transaction');
      setErrorMsg(message);
      if (message.toUpperCase().includes('KYC')) {
        setStep('kyc_required');
      } else if (message.toLowerCase().includes('own listing') || message.toLowerCase().includes('own group')) {
        setStep('own_listing_error');
      } else {
        setStep('insufficient_balance');
      }
    }
  };

  const handleFinish = () => {
    setStep('confirm');
    onClose();
    navigate('/app/groups');
  };

  const handleAddMoney = () => {
    setStep('confirm');
    onClose();
    navigate('/app/settlements');
  };

  const handleCompleteKyc = () => {
    setKycUploadModalOpen(true);
  };


  const renderDialogTitle = () => {
    if (step === 'kyc_required') return 'KYC Verification Required';
    if (step === 'own_listing_error') return 'Action Not Allowed';
    if (step === 'insufficient_balance') return 'Insufficient Wallet Balance';
    if (step === 'success') return 'Purchase Request Sent! 🎉';
    return 'Confirm Purchase';
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
          {renderDialogTitle()}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#A1A1AA' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2, pb: 2 }}>
        {step === 'confirm' && (
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
              disabled={loading}
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
              {loading ? 'Checking Wallet...' : `Pay ₹${price} & Buy Pass`}
            </Button>
          </Box>
        )}

        {step === 'kyc_required' && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.15)',
                border: '2px solid #3b82f6',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <ShieldCheck size={36} color="#3b82f6" />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', mb: 1 }}>
              {isVerifying ? 'AI Verification in Progress 🤖 ⚡' : 'Complete KYC Verification First'}
            </Typography>

            <Typography sx={{ fontSize: '0.88rem', color: '#A1A1AA', mb: 3, lineHeight: 1.6 }}>
              {isVerifying
                ? 'SubSplit AI is currently analyzing your uploaded identity document. You will be able to join group listings once verification finishes.'
                : (errorMsg.replace(/^KYC_REQUIRED:\s*/, '') || 'Please complete your identity KYC verification before joining a group listing and accessing escrow payments.')}
            </Typography>

            <Stack spacing={1.5}>
              {isVerifying ? (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    navigate('/app/profile');
                    onClose();
                  }}
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    py: 1.3,
                    borderRadius: '12px',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  }}
                >
                  View Status on Profile Page →
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShieldCheck size={18} />}
                  onClick={handleCompleteKyc}
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    py: 1.3,
                    borderRadius: '12px',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
                  }}
                >
                  Complete KYC Verification
                </Button>
              )}

              <Button
                fullWidth
                variant="outlined"
                onClick={() => setStep('confirm')}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  py: 1,
                  borderRadius: '12px',
                  textTransform: 'none',
                  borderColor: '#2A2A30',
                  color: '#A1A1AA',
                }}
              >
                Back
              </Button>
            </Stack>
          </Box>
        )}

        {step === 'own_listing_error' && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '2px solid #ef4444',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <AlertTriangle size={34} color="#ef4444" />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', mb: 1 }}>
              Cannot Join Own Group
            </Typography>

            <Typography sx={{ fontSize: '0.88rem', color: '#A1A1AA', mb: 3, lineHeight: 1.6 }}>
              {errorMsg || 'You are the host of this group listing and cannot join your own listing pass.'}
            </Typography>

            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              sx={{
                fontWeight: 700,
                fontSize: '0.88rem',
                py: 1,
                borderRadius: '12px',
                textTransform: 'none',
                borderColor: '#2A2A30',
                color: '#A1A1AA',
              }}
            >
              Back to Listing
            </Button>
          </Box>
        )}

        {step === 'insufficient_balance' && (


          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '2px solid #ef4444',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <AlertTriangle size={34} color="#ef4444" />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', mb: 1 }}>
              Not Enough Balance in Wallet
            </Typography>

            <Typography sx={{ fontSize: '0.88rem', color: '#A1A1AA', mb: 3, lineHeight: 1.6 }}>
              {errorMsg || `You don't have enough balance in your wallet to cover ₹${price}. Please add money to your wallet to proceed.`}
            </Typography>

            <Stack spacing={1.5}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Wallet size={18} />}
                onClick={handleAddMoney}
                sx={{
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  py: 1.3,
                  borderRadius: '12px',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
                }}
              >
                Add Money to Wallet
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => setStep('confirm')}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  py: 1,
                  borderRadius: '12px',
                  textTransform: 'none',
                  borderColor: '#2A2A30',
                  color: '#A1A1AA',
                }}
              >
                Back
              </Button>
            </Stack>
          </Box>
        )}

        {step === 'success' && (
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
              Request Sent & Amount Reserved! 🎉
            </Typography>

            <Typography sx={{ fontSize: '0.88rem', color: '#A1A1AA', mb: 3, lineHeight: 1.6 }}>
              ₹{price} has been deducted from your wallet and reserved in escrow. A request has been sent to the host ({hostName}).
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
              View My Memberships
            </Button>
          </Box>
        )}
      </DialogContent>

      <KycUploadModal
        open={kycUploadModalOpen}
        onClose={() => setKycUploadModalOpen(false)}
        onSuccess={() => {
          setKycUploadModalOpen(false);
          setStep('confirm');
        }}
      />
    </Dialog>
  );
}


export default JoinModal;

