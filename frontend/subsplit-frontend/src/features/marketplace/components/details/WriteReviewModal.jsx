import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Rating,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Star, ShieldCheck, Sparkles } from 'lucide-react';
import { submitListingReview } from '../../marketplaceSlice';

const RATING_LABELS = {
  1: '1.0 / 5.0 — Poor Experience',
  2: '2.0 / 5.0 — Below Expectations',
  3: '3.0 / 5.0 — Average Experience',
  4: '4.0 / 5.0 — Great Host & Group',
  5: '5.0 / 5.0 — Outstanding Host & Seamless Access',
};

function WriteReviewModal({ open, onClose, listingId, hostName, onSuccess }) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const MAX_CHARS = 500;
  const MIN_CHARS = 5;

  const handleReviewTextChange = (e) => {
    // Plain text sanitization (strip HTML tags)
    const rawVal = e.target.value;
    const sanitized = rawVal.replace(/<[^>]*>?/gm, '');
    if (sanitized.length <= MAX_CHARS) {
      setReviewText(sanitized);
      if (errorMessage) setErrorMessage('');
    }
  };

  const handleSubmit = async () => {
    const trimmed = reviewText.trim();
    if (trimmed.length < MIN_CHARS) {
      setErrorMessage(`Please write a review comment with at least ${MIN_CHARS} characters.`);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const resultAction = await dispatch(
        submitListingReview({ listingId, rating, reviewText: trimmed })
      );

      if (submitListingReview.fulfilled.match(resultAction)) {
        setLoading(false);
        setReviewText('');
        setRating(5);
        if (onSuccess) onSuccess('Review submitted successfully!');
        onClose();
      } else {
        setLoading(false);
        setErrorMessage(resultAction.payload || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const currentChars = reviewText.trim().length;

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '22px',
          background: '#14161a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#f3f4f6',
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={20} color="#3b82f6" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.15rem' }}>
              Write Host Review
            </Typography>
            <Typography sx={{ fontSize: '0.76rem', color: '#9ca3af' }}>
              Sharing feedback for {hostName || 'Verified Host'}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
            {errorMessage}
          </Alert>
        )}

        {/* ─── 5-Star Rating Selector ─── */}
        <Box sx={{ p: 2.5, borderRadius: '16px', background: '#1c1e24', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', mb: 1 }}>
            Overall Rating (1 to 5 Stars)
          </Typography>

          <Rating
            name="host-rating"
            value={rating}
            onChange={(event, newValue) => {
              if (newValue) setRating(newValue);
            }}
            precision={1}
            icon={<Star size={28} fill="#f59e0b" color="#f59e0b" style={{ margin: '0 4px' }} />}
            emptyIcon={<Star size={28} color="#4b5563" style={{ margin: '0 4px' }} />}
          />

          <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: '#f59e0b', mt: 1 }}>
            {RATING_LABELS[rating] || `${rating}.0 / 5.0`}
          </Typography>
        </Box>

        {/* ─── Plain Text Review Comment ─── */}
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.75}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6' }}>
              Review Comment <Typography component="span" sx={{ fontSize: '0.74rem', color: '#9ca3af' }}>(Plain text only)</Typography>
            </Typography>
            <Typography
              sx={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: currentChars > MAX_CHARS - 20 ? '#ef4444' : '#9ca3af',
              }}
            >
              {currentChars} / {MAX_CHARS}
            </Typography>
          </Stack>

          <TextField
            fullWidth
            multiline
            rows={4}
            value={reviewText}
            onChange={handleReviewTextChange}
            placeholder="Describe your experience with this host, account credentials delivery speed, uptime, and communication..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                background: '#1c1e24',
                color: '#f3f4f6',
                fontSize: '0.88rem',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover fieldset': { borderColor: '#3b82f6' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
            }}
          />

          <Typography sx={{ fontSize: '0.72rem', color: '#64748b', mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ShieldCheck size={14} color="#22c55e" /> Plain text input only. No HTML tags or media attachments allowed.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ borderRadius: '10px', textTransform: 'none', color: '#9ca3af', fontWeight: 700, px: 2.5 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || currentChars < MIN_CHARS}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Star size={16} />}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 800,
            fontSize: '0.85rem',
            px: 3,
            py: 0.9,
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WriteReviewModal;
