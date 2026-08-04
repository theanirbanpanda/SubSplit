import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Clock,
  AlertTriangle,
  UploadCloud,
  X,
  ShieldCheck,
  ImageIcon,
  ExternalLink,
  Link as LinkIcon,
} from 'lucide-react';
import ScratchCard from './ScratchCard';
import styles from './ViewCredentialsAndProofModal.module.scss';

function ViewCredentialsAndProofModal({ open, onClose, requestItem, onSubmitProof }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // States for invitation link timer & reveal
  const [joinedClicked, setJoinedClicked] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isViewLinkEnabled, setIsViewLinkEnabled] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const timerRef = useRef(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (joinedClicked && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsViewLinkEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [joinedClicked]);

  if (!requestItem) return null;

  const isInvite = requestItem.shareType === 'INVITATION_LINK' || Boolean(requestItem.invitationLink);
  const isCode = requestItem.shareType === 'ACTIVATION_CODE' || Boolean(requestItem.activationCode);
  const isAlreadyScratched = requestItem.id
    ? localStorage.getItem('scratched_code_' + requestItem.id) === 'true'
    : false;

  const handleScratchComplete = () => {
    if (requestItem?.id) {
      localStorage.setItem('scratched_code_' + requestItem.id, 'true');
    }
  };

  const handleJoinNow = () => {
    if (requestItem?.invitationLink) {
      window.open(requestItem.invitationLink, '_blank', 'noopener,noreferrer');
    }
    if (!joinedClicked) {
      setJoinedClicked(true);
    }
  };

  const handleCopyLink = () => {
    if (requestItem?.invitationLink) {
      navigator.clipboard.writeText(requestItem.invitationLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyUser = () => {
    if (requestItem.credentialsUsername) {
      navigator.clipboard.writeText(requestItem.credentialsUsername);
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    }
  };

  const handleCopyPass = () => {
    if (requestItem.credentialsPassword) {
      navigator.clipboard.writeText(requestItem.credentialsPassword);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = reader.result;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
        setSelectedImage(compressedDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!selectedImage) return;
    onSubmitProof(selectedImage);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: styles.modalPaper }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ p: 0, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyRound size={22} color="#3b82f6" />
          <Typography className={styles.modalTitle}>
            Subscription Access & Login Verification
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#9ca3af' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Credentials / Invitation Link / Scratch Card */}
        <Box className={styles.credentialsCard}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#f3f4f6', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShieldCheck size={18} color="#22c55e" />
            {requestItem.listingTitle} ({requestItem.platform || 'Subscription Pass'})
          </Typography>

          {isCode ? (
            <ScratchCard
              code={requestItem.activationCode || 'NO-CODE-PROVIDED'}
              requestId={requestItem.id}
              isAlreadyScratched={isAlreadyScratched}
              onScratchComplete={handleScratchComplete}
            />
          ) : isInvite ? (
            <>
              {/* Join Now Primary CTA */}
              <Box sx={{ my: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleJoinNow}
                  endIcon={<ExternalLink size={20} />}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      boxShadow: '0 6px 24px rgba(34, 197, 94, 0.55)',
                    },
                  }}
                >
                  Join Now
                </Button>
              </Box>

              {/* Not working? Click to view link */}
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Button
                  variant="text"
                  disabled={!isViewLinkEnabled}
                  onClick={() => setShowLink(!showLink)}
                  startIcon={<LinkIcon size={16} />}
                  sx={{
                    color: isViewLinkEnabled ? '#3b82f6' : '#6b7280',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&.Mui-disabled': {
                      color: '#6b7280',
                    },
                  }}
                >
                  {isViewLinkEnabled
                    ? showLink
                      ? 'Hide Shared Link'
                      : 'Not working? Click to view link'
                    : joinedClicked
                    ? `Not working? View link available in ${countdown}s`
                    : "Not working? Click 'Join Now' first (view link available in 30s)"}
                </Button>

                {showLink && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      background: '#09090b',
                      borderRadius: '10px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', color: '#60a5fa', wordBreak: 'break-all', fontWeight: 600 }}>
                      {requestItem.invitationLink}
                    </Typography>
                    <Tooltip title={copiedLink ? 'Copied!' : 'Copy Link'}>
                      <IconButton size="small" onClick={handleCopyLink} sx={{ color: '#9ca3af' }}>
                        {copiedLink ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <>
              <Box className={styles.credRow}>
                <span className={styles.credLabel}>Username / Email</span>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span className={styles.credValue}>{requestItem.credentialsUsername || 'Not provided'}</span>
                  <Tooltip title={copiedUser ? 'Copied!' : 'Copy Username'}>
                    <IconButton size="small" onClick={handleCopyUser} sx={{ color: '#9ca3af' }}>
                      {copiedUser ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box className={styles.credRow}>
                <span className={styles.credLabel}>Password</span>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span className={styles.credValue}>
                    {showPassword ? requestItem.credentialsPassword || '••••••••' : '••••••••••••'}
                  </span>
                  <IconButton size="small" onClick={() => setShowPassword(!showPassword)} sx={{ color: '#9ca3af' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                  <Tooltip title={copiedPass ? 'Copied!' : 'Copy Password'}>
                    <IconButton size="small" onClick={handleCopyPass} sx={{ color: '#9ca3af' }}>
                      {copiedPass ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </>
          )}

          {requestItem.credentialsNotes && (
            <Box className={styles.credRow} sx={{ mt: 1.5 }}>
              <span className={styles.credLabel}>Host Instructions</span>
              <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: '0.85rem' }}>
                {requestItem.credentialsNotes}
              </Typography>
            </Box>
          )}
        </Box>

        {/* 24-Hour Deadline Banner */}
        <Box className={styles.deadlineBanner}>
          <Clock size={20} />
          <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 700 }}>
            Strict Deadline: Please test your access and submit proof screenshot within 24 hours.
          </Typography>
        </Box>

        {/* Warning Box */}
        <Box className={styles.warningBox}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <AlertTriangle size={18} color="#ef4444" />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#f87171' }}>
              CRITICAL PRIVACY & SECURITY WARNING
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ display: 'block', color: 'inherit' }}>
            Do NOT upload any screenshot containing personal or sensitive information like passwords, credit cards, bank details, or personal messages. Only upload a screenshot showing the logged-in dashboard/profile window of the subscription service.
          </Typography>
        </Box>

        {/* Proof Upload Area */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <Box
          className={styles.dropzone}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud size={32} color="#3b82f6" style={{ marginBottom: 8 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#f3f4f6' }}>
            Click to select screenshot proof of successful access
          </Typography>
          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
            Supports PNG, JPG, WEBP (Max 5MB)
          </Typography>

          {selectedImage && (
            <Box sx={{ mt: 2 }}>
              <img src={selectedImage} alt="Login Proof Preview" className={styles.previewImage} />
              <Chip
                icon={<ImageIcon size={14} />}
                label="Screenshot Ready to Submit"
                size="small"
                sx={{ mt: 1, background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800 }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 0, mt: 3 }}>
        <Button onClick={onClose} sx={{ color: '#9ca3af', textTransform: 'none', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedImage}
          sx={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            borderRadius: '0.75rem',
            textTransform: 'none',
            fontWeight: 800,
            px: 3,
            py: 1,
          }}
        >
          Submit Login Proof
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewCredentialsAndProofModal;
