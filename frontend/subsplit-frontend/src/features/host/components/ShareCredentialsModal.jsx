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
import { ShieldCheck, Lock, Eye, EyeOff, X, KeyRound } from 'lucide-react';
import styles from './ShareCredentialsModal.module.scss';

function ShareCredentialsModal({ open, onClose, onSubmit, requestItem }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({ username: username.trim(), password: password.trim(), notes: notes.trim() });
      setUsername('');
      setPassword('');
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
            Share Subscription Credentials
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#9ca3af' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 0 }}>
          <Box className={styles.badgeEncrypted}>
            <ShieldCheck size={20} />
            <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 700 }}>
              End-to-End Encrypted: Credentials will be securely transmitted to {requestItem?.memberName || 'the member'}. Holding escrow payment is secured until login verification.
            </Typography>
          </Box>

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

          <Box className={styles.formField}>
            <label className={styles.fieldLabel}>Access Notes / Profile Instructions (Optional)</label>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="e.g. Use Profile 2 'John', PIN: 1234. Please do not change account settings."
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
            disabled={submitting || !username.trim() || !password.trim()}
            sx={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: '0.75rem',
              textTransform: 'none',
              fontWeight: 800,
              px: 3,
              py: 1,
            }}
          >
            {submitting ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : 'Send Credentials to Member'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ShareCredentialsModal;
