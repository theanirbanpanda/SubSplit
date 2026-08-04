import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { X, AlertTriangle, ShieldAlert, Upload } from 'lucide-react';
import { raiseDisputeApi } from './api/disputeApi';

const DISPUTE_REASONS = [
  { value: 'INVALID_CREDENTIALS', label: 'Invalid Login Credentials / Password Wrong' },
  { value: 'PROFILE_BLOCKED', label: 'Slot or Screen Access Blocked / Removed by Host' },
  { value: 'HOST_UNRESPONSIVE', label: 'Host Unresponsive / Credentials Not Shared' },
  { value: 'PAYMENT_ISSUE', label: 'Incorrect Charge / Double Deduction' },
  { value: 'OTHER', label: 'Other Fraudulent or Access Concern' },
];

function RaiseDisputeModal({ open, onClose, listing, joinRequest, onSuccess }) {
  const [reason, setReason] = useState('INVALID_CREDENTIALS');
  const [description, setDescription] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please describe the issue in detail.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await raiseDisputeApi({
        listingId: listing ? listing.id : null,
        joinRequestId: joinRequest ? joinRequest.id : null,
        reason,
        description,
        proofImage: proofImage || null,
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Failed to raise dispute:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit dispute. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: '#14161a',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '20px',
          color: '#f3f4f6',
        },
      }}
    >
      <DialogTitle sx={{ pt: 3, px: 3.5, pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ p: 1, borderRadius: '10px', background: 'rgba(239,68,68,0.15)' }}>
              <AlertTriangle size={20} color="#ef4444" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.15rem', color: '#f3f4f6' }}>
                Raise Dispute / Report Issue
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                100% Escrow Protection • Admin Fraud Audit Team
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} sx={{ color: '#9ca3af' }}>
            <X size={20} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 3.5, py: 2 }}>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
              {errorMsg}
            </Alert>
          )}

          {listing && (
            <Box sx={{ p: 2, background: '#1c1e24', borderRadius: '12px', mb: 2.5, border: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 700 }}>DISPUTED PASS</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#f3f4f6', mt: 0.25 }}>
                {listing.title}
              </Typography>
            </Box>
          )}

          <Stack spacing={2.5}>
            {/* Reason Selection */}
            <FormControl fullWidth size="small">
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6', mb: 0.75 }}>
                Dispute Category / Reason
              </Typography>
              <Select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                sx={{
                  background: '#1c1e24',
                  color: '#f3f4f6',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                {DISPUTE_REASONS.map((r) => (
                  <MenuItem key={r.value} value={r.value} sx={{ fontSize: '0.85rem' }}>
                    {r.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Description */}
            <Box>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6', mb: 0.75 }}>
                Detailed Description of the Problem
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Explain what happened (e.g. Host changed password, credentials incorrect, profile evicted)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                    background: '#1c1e24',
                    color: '#f3f4f6',
                    fontSize: '0.88rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '& fieldset': { border: 'none' },
                  },
                }}
              />
            </Box>

            {/* Proof Screenshot Upload */}
            <Box>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6', mb: 0.75 }}>
                Attach Screenshot Proof (Optional but Recommended)
              </Typography>

              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<Upload size={16} />}
                sx={{
                  borderRadius: '12px',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#fbbf24',
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.2,
                }}
              >
                {proofImage ? 'Proof Image Uploaded (Click to Change)' : 'Upload Screenshot / Proof'}
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </Button>

              {proofImage && (
                <Box sx={{ mt: 1.5, maxHeight: 120, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={proofImage} alt="Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3.5, pb: 3, justifyContent: 'space-between' }}>
          <Button onClick={onClose} sx={{ color: '#9ca3af', fontWeight: 700 }}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            color="error"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ShieldAlert size={18} />}
            sx={{
              borderRadius: '12px',
              fontWeight: 900,
              textTransform: 'none',
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
            }}
          >
            {loading ? 'Submitting...' : 'Submit Dispute'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default RaiseDisputeModal;
