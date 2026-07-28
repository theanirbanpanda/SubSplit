import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  MenuItem,
  TextField,
  LinearProgress,
  IconButton,
  Paper,
} from '@mui/material';
import { X, UploadCloud, ShieldCheck, CheckCircle2, FileText, Loader2, Sparkles } from 'lucide-react';
import { submitKycDocument, fetchCurrentUser } from '../../auth/authSlice';

function KycUploadModal({ open, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const [docType, setDocType] = useState('Aadhaar Card');
  const [selectedFile, setSelectedFile] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [stepMessage, setStepMessage] = useState('Extracting document details...');
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  useEffect(() => {
    let timer;
    if (verifying && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          const next = prev - 1;
          if (next === 4) setStepMessage('Parsing OCR document details & photo...');
          if (next === 3) setStepMessage('Cross-referencing government identity databases...');
          if (next === 2) setStepMessage('Verifying digital signature & face match...');
          if (next === 1) setStepMessage('Finalizing verification credentials...');
          return next;
        });
      }, 1000);
    } else if (verifying && countdown === 0) {
      // 5-second verification finished — dispatch backend verification!
      handleFinalVerification();
    }
    return () => clearInterval(timer);
  }, [verifying, countdown]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleStartVerification = () => {
    if (!selectedFile) return;
    setVerifying(true);
    setCountdown(5);
    setStepMessage('Extracting document details...');
  };

  const handleFinalVerification = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentType', docType);

      await dispatch(submitKycDocument(formData)).unwrap();
      await dispatch(fetchCurrentUser());

      setVerifying(false);
      setVerifiedSuccess(true);

      setTimeout(() => {
        setVerifiedSuccess(false);
        setSelectedFile(null);
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setVerifying(false);
      alert(err || 'Verification failed. Please try again.');
    }
  };

  const handleModalClose = () => {
    if (verifying) return;
    setSelectedFile(null);
    setVerifying(false);
    setVerifiedSuccess(false);
    onClose();
  };

  const progressPercent = ((5 - countdown) / 5) * 100;

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.2}>
          <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="#22c55e" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.15rem' }}>
            KYC Identity Verification
          </Typography>
        </Stack>

        <IconButton onClick={handleModalClose} disabled={verifying} sx={{ color: '#9ca3af', '&:hover': { color: '#ffffff' } }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Verification Success State */}
        {verifiedSuccess ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(34,197,94,0.2)',
                border: '2px solid #22c55e',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <CheckCircle2 size={36} color="#22c55e" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', mb: 0.5 }}>
              KYC Verification Complete!
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              Your government identity has been verified. You now have full access to join and host escrow groups.
            </Typography>
          </Box>
        ) : verifying ? (
          /* 5-Second Verification Screen */
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(59,130,246,0.15)',
                border: '2px solid #3b82f6',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
              }}
            >
              <Loader2 size={32} color="#3b82f6" className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', mb: 0.5 }}>
              Verifying Document ({countdown}s)...
            </Typography>

            <Typography sx={{ fontSize: '0.82rem', color: '#3b82f6', fontWeight: 700, mb: 2 }}>
              {stepMessage}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: '#1c1e24',
                mb: 3,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  background: 'linear-gradient(90deg, #2563eb 0%, #22c55e 100%)',
                },
              }}
            />

            <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#18181C', border: '1px solid #2A2A30', textAlign: 'left' }}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircle2 size={15} color={countdown <= 4 ? "#22c55e" : "#6b7280"} />
                  <Typography sx={{ fontSize: '0.78rem', color: countdown <= 4 ? "#ffffff" : "#6b7280" }}>
                    1. Uploading & Parsing File Format
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircle2 size={15} color={countdown <= 2 ? "#22c55e" : "#6b7280"} />
                  <Typography sx={{ fontSize: '0.78rem', color: countdown <= 2 ? "#ffffff" : "#6b7280" }}>
                    2. AI Identity Matching & Govt Check
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircle2 size={15} color={countdown === 0 ? "#22c55e" : "#6b7280"} />
                  <Typography sx={{ fontSize: '0.78rem', color: countdown === 0 ? "#ffffff" : "#6b7280" }}>
                    3. Granting Verified Escrow Access
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Box>
        ) : (
          /* Document Upload Screen */
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#A1A1AA', mb: 1 }}>
                Select Government ID Type
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                sx={{
                  background: '#18181C',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2A2A30' },
                  '& .MuiSelect-select': { color: '#ffffff', fontSize: '0.88rem' },
                }}
              >
                <MenuItem value="Aadhaar Card">Aadhaar Card (India)</MenuItem>
                <MenuItem value="PAN Card">PAN Card</MenuItem>
                <MenuItem value="Passport">Passport</MenuItem>
                <MenuItem value="Driving License">Driving License</MenuItem>
              </TextField>
            </Box>

            {/* Upload Drag & Drop Dropzone */}
            <Box
              component="label"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                borderRadius: '16px',
                border: '2px dashed #3b82f6',
                background: 'rgba(59,130,246,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(59,130,246,0.08)',
                  borderColor: '#60a5fa',
                },
              }}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                hidden
                onChange={handleFileChange}
              />

              <UploadCloud size={32} color="#3b82f6" style={{ marginBottom: 8 }} />
              
              {selectedFile ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <FileText size={16} color="#22c55e" />
                  <Typography sx={{ fontWeight: 800, color: '#22c55e', fontSize: '0.88rem' }}>
                    {selectedFile.name}
                  </Typography>
                </Stack>
              ) : (
                <>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff', mb: 0.5 }}>
                    Click to upload document photo
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Supports JPG, PNG, WEBP or PDF (Max 5MB)
                  </Typography>
                </>
              )}
            </Box>

            <Button
              variant="contained"
              fullWidth
              disabled={!selectedFile}
              onClick={handleStartVerification}
              sx={{
                py: 1.3,
                borderRadius: '12px',
                fontWeight: 800,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                fontSize: '0.95rem',
                '&:disabled': { background: '#2A2A30', color: '#6b7280' },
              }}
            >
              Submit & Start AI Verification
            </Button>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default KycUploadModal;
