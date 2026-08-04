import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { ShieldCheck, Eye, EyeOff, X, KeyRound, Link as LinkIcon, Ticket } from 'lucide-react';
import styles from './ShareCredentialsModal.module.scss';

function ShareCredentialsModal({ open, onClose, onSubmit, requestItem }) {
  const [shareType, setShareType] = useState('CREDENTIALS'); // 'CREDENTIALS' | 'INVITATION_LINK' | 'ACTIVATION_CODE'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invitationLink, setInvitationLink] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isFormValid = () => {
    if (shareType === 'CREDENTIALS') {
      return Boolean(username.trim() && password.trim());
    } else if (shareType === 'INVITATION_LINK') {
      return Boolean(invitationLink.trim());
    } else if (shareType === 'ACTIVATION_CODE') {
      return Boolean(activationCode.trim());
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setSubmitting(true);
    try {
      if (shareType === 'CREDENTIALS') {
        await onSubmit({
          shareType: 'CREDENTIALS',
          username: username.trim(),
          password: password.trim(),
          notes: notes.trim(),
        });
      } else if (shareType === 'INVITATION_LINK') {
        await onSubmit({
          shareType: 'INVITATION_LINK',
          invitationLink: invitationLink.trim(),
          notes: notes.trim(),
        });
      } else if (shareType === 'ACTIVATION_CODE') {
        await onSubmit({
          shareType: 'ACTIVATION_CODE',
          activationCode: activationCode.trim(),
          notes: notes.trim(),
        });
      }
      setUsername('');
      setPassword('');
      setInvitationLink('');
      setActivationCode('');
      setNotes('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: styles.modalPaper }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ p: 0, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyRound size={22} color="#22c55e" />
          <Typography className={styles.modalTitle}>
            Accept Request & Grant Access
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#9ca3af' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 0 }}>
          {/* Share Type Options Toggle */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
            <Button
              fullWidth
              variant={shareType === 'CREDENTIALS' ? 'contained' : 'outlined'}
              onClick={() => setShareType('CREDENTIALS')}
              startIcon={<KeyRound size={16} />}
              sx={{
                py: 1.1,
                px: 1,
                fontSize: '0.8rem',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                background: shareType === 'CREDENTIALS' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'transparent',
                borderColor: shareType === 'CREDENTIALS' ? '#22c55e' : 'rgba(255,255,255,0.15)',
                color: shareType === 'CREDENTIALS' ? '#ffffff' : '#9ca3af',
                '&:hover': {
                  background: shareType === 'CREDENTIALS' ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : 'rgba(255,255,255,0.05)',
                  borderColor: '#22c55e',
                },
              }}
            >
              Credentials
            </Button>
            <Button
              fullWidth
              variant={shareType === 'INVITATION_LINK' ? 'contained' : 'outlined'}
              onClick={() => setShareType('INVITATION_LINK')}
              startIcon={<LinkIcon size={16} />}
              sx={{
                py: 1.1,
                px: 1,
                fontSize: '0.8rem',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                background: shareType === 'INVITATION_LINK' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
                borderColor: shareType === 'INVITATION_LINK' ? '#3b82f6' : 'rgba(255,255,255,0.15)',
                color: shareType === 'INVITATION_LINK' ? '#ffffff' : '#9ca3af',
                '&:hover': {
                  background: shareType === 'INVITATION_LINK' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'rgba(255,255,255,0.05)',
                  borderColor: '#3b82f6',
                },
              }}
            >
              Invite Link
            </Button>
            <Button
              fullWidth
              variant={shareType === 'ACTIVATION_CODE' ? 'contained' : 'outlined'}
              onClick={() => setShareType('ACTIVATION_CODE')}
              startIcon={<Ticket size={16} />}
              sx={{
                py: 1.1,
                px: 1,
                fontSize: '0.8rem',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                background: shareType === 'ACTIVATION_CODE' ? 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' : 'transparent',
                borderColor: shareType === 'ACTIVATION_CODE' ? '#a855f7' : 'rgba(255,255,255,0.15)',
                color: shareType === 'ACTIVATION_CODE' ? '#ffffff' : '#9ca3af',
                '&:hover': {
                  background: shareType === 'ACTIVATION_CODE' ? 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)' : 'rgba(255,255,255,0.05)',
                  borderColor: '#a855f7',
                },
              }}
            >
              Activation Code
            </Button>
          </Box>

          <Box className={styles.badgeEncrypted}>
            <ShieldCheck size={20} />
            <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 700 }}>
              End-to-End Encrypted: Access details will be securely transmitted to {requestItem?.memberName || 'the member'}. Holding escrow payment is secured until login verification.
            </Typography>
          </Box>

          {shareType === 'CREDENTIALS' && (
            <>
              <Box className={styles.formField}>
                <label className={styles.fieldLabel}>Subscription Username / Email *</label>
                <TextField
                  fullWidth
                  placeholder="e.g. host.user@gmail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#09090b',
                      color: '#f3f4f6',
                      borderRadius: '0.75rem',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                    },
                  }}
                />
              </Box>

              <Box className={styles.formField}>
                <label className={styles.fieldLabel}>Password *</label>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  variant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#9ca3af' }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#09090b',
                      color: '#f3f4f6',
                      borderRadius: '0.75rem',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                    },
                  }}
                />
              </Box>
            </>
          )}

          {shareType === 'INVITATION_LINK' && (
            <Box className={styles.formField}>
              <label className={styles.fieldLabel}>Invitation Link URL *</label>
              <TextField
                fullWidth
                type="url"
                placeholder="https://family.platform.com/join/invite-code-12345"
                value={invitationLink}
                onChange={(e) => setInvitationLink(e.target.value)}
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: '#09090b',
                    color: '#f3f4f6',
                    borderRadius: '0.75rem',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                    '&:hover fieldset': { borderColor: '#3b82f6' },
                  },
                }}
              />
            </Box>
          )}

          {shareType === 'ACTIVATION_CODE' && (
            <Box className={styles.formField}>
              <label className={styles.fieldLabel}>Subscription Activation Code *</label>
              <TextField
                fullWidth
                placeholder="e.g. SUB-AX98-7241-KLP9"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: '#09090b',
                    color: '#f3f4f6',
                    borderRadius: '0.75rem',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                    '&:hover fieldset': { borderColor: '#a855f7' },
                  },
                }}
              />
            </Box>
          )}

          <Box className={styles.formField}>
            <label className={styles.fieldLabel}>Access Notes / Instructions (Optional)</label>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder={
                shareType === 'CREDENTIALS'
                  ? "e.g. Use Profile 2 'John', PIN: 1234. Please do not change account settings."
                  : shareType === 'INVITATION_LINK'
                  ? "e.g. Click link, accept family group invite, then confirm email."
                  : "e.g. Redeem at redeem.platform.com under billing settings."
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: '#09090b',
                  color: '#f3f4f6',
                  borderRadius: '0.75rem',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                  '&:hover fieldset': { borderColor: '#3b82f6' },
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 0, mt: 3 }}>
          <Button
            onClick={onClose}
            sx={{ color: '#9ca3af', textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || !isFormValid()}
            sx={{
              background:
                shareType === 'ACTIVATION_CODE'
                  ? 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'
                  : shareType === 'INVITATION_LINK'
                  ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                  : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: '0.75rem',
              textTransform: 'none',
              fontWeight: 800,
              px: 3,
              py: 1,
            }}
          >
            {submitting ? (
              <CircularProgress size={20} sx={{ color: '#ffffff' }} />
            ) : shareType === 'CREDENTIALS' ? (
              'Send Credentials to Member'
            ) : shareType === 'INVITATION_LINK' ? (
              'Send Invitation Link to Member'
            ) : (
              'Send Activation Code to Member'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ShareCredentialsModal;
