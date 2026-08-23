import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Stack,
  Avatar,
  TextField,
  IconButton
} from '@mui/material';
import { Star, X } from 'lucide-react';
import { submitListingReviewApi } from '../api/marketplaceApi';

const RateMemberModal = ({ open, handleClose, member, listingId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    if (!reviewText.trim()) {
      setError('Please write a brief review.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reviewData = {
        rating: rating,
        reviewText: reviewText,
        revieweeId: member?.userId
      };

      await submitListingReviewApi(listingId, reviewData);
      
      setRating(0);
      setReviewText('');
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(23,23,23,0.98)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          color: '#fff',
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
          Rate User
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: '#9ca3af', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' } }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, pt: 2 }}>
        <Stack alignItems="center" spacing={3}>
          <Avatar 
            src={member.profileImage}
            sx={{ width: 80, height: 80, border: '2px solid rgba(255,255,255,0.1)' }}
          >
            {member.name?.[0]?.toUpperCase()}
          </Avatar>
          
          <Box textAlign="center">
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              How was your experience with {member.name}?
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              Your review will be visible on their profile.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Box
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                sx={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }}
              >
                <Star 
                  size={32}
                  fill={(hoverRating || rating) >= star ? '#f59e0b' : 'transparent'}
                  color={(hoverRating || rating) >= star ? '#f59e0b' : '#374151'} 
                />
              </Box>
            ))}
          </Stack>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write a brief review about this member..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              }
            }}
          />

          {error && (
            <Typography sx={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, width: '100%', textAlign: 'left', mt: 1 }}>
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose} 
          sx={{ color: '#9ca3af', fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: '12px',
            fontWeight: 700,
            px: 4,
            textTransform: 'none'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RateMemberModal;
