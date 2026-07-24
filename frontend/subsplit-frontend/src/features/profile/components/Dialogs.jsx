import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';

export const EditProfileDialog = ({ open, onClose, data, onSave }) => {
  const [formData, setFormData] = React.useState(data);

  // Sync data on open
  React.useEffect(() => {
    if (open) setFormData(data);
  }, [open, data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: '#111114',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#f3f4f6',
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
        Edit Profile
      </DialogTitle>

      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            size="small"
            InputLabelProps={{ style: { color: '#9ca3af' } }}
            sx={{ input: { color: '#f3f4f6' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#22c55e' } } }}
          />
          <TextField
            label="City, Country"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            size="small"
            InputLabelProps={{ style: { color: '#9ca3af' } }}
            sx={{ input: { color: '#f3f4f6' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#22c55e' } } }}
          />
          <TextField
            label="Bio (max 4 lines)"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            size="small"
            InputLabelProps={{ style: { color: '#9ca3af' } }}
            sx={{ textarea: { color: '#f3f4f6' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#22c55e' } } }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
            <Button
              onClick={onClose}
              sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ borderRadius: '10px', fontWeight: 700, textTransform: 'none', background: '#22c55e', color: '#09090b', '&:hover': { background: '#16a34a' } }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export const VerificationDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: '#111114',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#f3f4f6',
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'center' }}>
        Verification Details
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', mb: 3 }}>
            Your identity has been fully verified using Government ID. You are eligible to host subscriptions and participate in escrow.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={onClose}
            sx={{ borderRadius: '10px', py: 1, fontWeight: 700, textTransform: 'none', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)', '&:hover': { background: 'rgba(34, 197, 94, 0.2)' } }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
