import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';

const ConfirmDialog = ({
  open = false,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  loading = false,
  onConfirm,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: 1,
          minWidth: '320px',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '18px' }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#64748b', fontSize: '14px' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          disabled={loading}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
