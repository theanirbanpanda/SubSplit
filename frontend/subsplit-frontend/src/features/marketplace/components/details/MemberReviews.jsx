import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Stack,
  Avatar,
  Button,
  Snackbar,
  Alert,
  Rating,
  TextField,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Star, ChevronRight, CheckCircle2, Trash2 } from 'lucide-react';
import { fetchListingReviews, submitListingReview, deleteListingReview } from '../../marketplaceSlice';

/* ─────────────────────────────────────────────────────────────────
   MemberReviews
   - Rating summary (big number + stars + count)
   - Shows first 2 real reviews; genuine empty state for missing slots
   - "See all N reviews" link
   - Inline Write-a-Review form, gated on isConfirmedMember
   - Two separate Rating inputs: host rating + plan rating
   - Single comment textarea
   - Wired to submitListingReview (POST /marketplace/listings/{id}/reviews)
───────────────────────────────────────────────────────────────── */

function StarRow({ label, sublabel, value, onChange }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={1}
    >
      <Typography sx={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 500 }}>
        {label}
        {sublabel && (
          <Typography component="span" sx={{ fontWeight: 700, color: '#ffffff', ml: 0.5, fontSize: '0.85rem' }}>
            · {sublabel}
          </Typography>
        )}
      </Typography>
      <Rating
        value={value}
        onChange={(_, v) => v && onChange(v)}
        precision={1}
        icon={<Star size={22} fill="#f59e0b" color="#f59e0b" style={{ margin: '0 2px' }} />}
        emptyIcon={<Star size={22} color="#4b5563" style={{ margin: '0 2px' }} />}
      />
    </Stack>
  );
}

function ReviewCard({ rev, user }) {
  let rawName = rev.reviewerName || rev.name || '';
  if (!rawName || rawName === 'null null' || rawName.trim() === 'null') {
    rawName =
      user?.fullName ||
      user?.username ||
      (user?.email ? user.email.split('@')[0] : 'Verified Member');
  }
  const name = rawName;

  let initials = rev.reviewerInitials || rev.initials || '';
  if (!initials || initials === 'NN' || initials.includes('null')) {
    const parts = name.split(' ').filter(Boolean);
    initials =
      parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();
  }

  const avatarBg = rev.avatarBg || '#2563eb';
  const rating = rev.rating || 5;
  const comment = rev.reviewText || rev.comment || '';

  return (
    <Box sx={{ py: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={0.75}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: avatarBg,
            fontWeight: 800,
            fontSize: '0.78rem',
          }}
        >
          {initials}
        </Avatar>
        <Box>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
              {name}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.2}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < rating ? '#f59e0b' : 'none'}
                  color={i < rating ? '#f59e0b' : '#4b5563'}
                />
              ))}
            </Stack>
          </Stack>
        </Box>
      </Stack>
      <Typography sx={{ fontSize: '0.88rem', color: '#A1A1AA', lineHeight: 1.65, pl: 0.25 }}>
        {comment}
      </Typography>
    </Box>
  );
}

function MemberReviews({ listingId, reviewSummary, hostId, hostName, isConfirmedMember }) {
  const dispatch = useDispatch();
  const { currentReviews } = useSelector((state) => state.marketplace);
  const { user } = useSelector((state) => state.auth || {});

  const [rating, setRating] = useState(4);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [localReviews, setLocalReviews] = useState(null);

  useEffect(() => {
    if (listingId) {
      dispatch(fetchListingReviews(listingId));
    }
  }, [listingId, dispatch]);

  useEffect(() => {
    if (currentReviews !== null) {
      setLocalReviews(null);
    }
  }, [currentReviews]);

  const reduxReviews = currentReviews?.reviews || reviewSummary?.reviews || [];

  // Deduplicate reviews by reviewerId, keeping the newest one (highest id)
  const userReviewsMap = new Map();
  for (const rev of reduxReviews) {
    const existing = userReviewsMap.get(rev.reviewerId);
    if (!existing || rev.id > existing.id) {
      userReviewsMap.set(rev.reviewerId, rev);
    }
  }
  const uniqueReduxReviews = Array.from(userReviewsMap.values());
  // Sort newest first
  uniqueReduxReviews.sort((a, b) => b.id - a.id);

  const activeReviews = localReviews !== null ? localReviews : uniqueReduxReviews;

  const totalCount = activeReviews.length;
  // Calculate average locally to ignore backend duplicates
  const avgRating = totalCount > 0
    ? activeReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalCount
    : 0;

  const isHost = Boolean(user && hostId && (user.id === hostId || user.email === hostId));
  const userHasReviewed = Boolean(
    user && activeReviews.some((r) => r.reviewerId === user.id)
  );
  const userReview = userHasReviewed ? activeReviews.find((r) => r.reviewerId === user.id) : null;

  const preview = activeReviews.slice(0, 2);

  const handleSubmitReview = async () => {
    const trimmed = reviewText.trim();
    if (trimmed.length < 5) {
      setToast({ open: true, message: 'Please write at least 5 characters.', severity: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      const resultAction = await dispatch(
        submitListingReview({
          listingId,
          rating,
          reviewText: trimmed,
        })
      );
      if (submitListingReview.fulfilled.match(resultAction)) {
        setReviewText('');
        setRating(4);
        setLocalReviews(null);
        setToast({ open: true, message: 'Review submitted successfully!', severity: 'success' });
        dispatch(fetchListingReviews(listingId));
      } else {
        setToast({
          open: true,
          message: resultAction.payload || 'Failed to submit review. Please try again.',
          severity: 'error',
        });
      }
    } catch (err) {
      setToast({ open: true, message: err.message || 'An unexpected error occurred.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userReview) return;
    
    // Find all duplicate reviews by this user in the raw redux state to clean up old DB bugs
    const allUserReviews = reduxReviews.filter((r) => r.reviewerId === user.id);
    
    // Optimistically update local UI to feel instant
    setLocalReviews(activeReviews.filter((r) => r.reviewerId !== user.id));
    setDeleteDialogOpen(false);
    
    try {
      // Fire off a delete request for every duplicate review sequentially to avoid backend lock/concurrency issues
      for (const r of allUserReviews) {
        await dispatch(deleteListingReview({ listingId, reviewId: r.id })).unwrap();
      }
      
      setToast({ open: true, message: 'Review deleted successfully. You can now write a new one.', severity: 'success' });
    } catch (err) {
      setLocalReviews(null);
      console.error("Delete review error:", err);
      setToast({ open: true, message: typeof err === 'string' ? err : (err?.message || 'Failed to fully delete review.'), severity: 'error' });
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {totalCount > 0 && (
        <Box sx={{ mb: 2.5 }}>
          <Stack direction="row" alignItems="baseline" spacing={1.5} mb={0.5}>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: '3rem',
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-0.04em',
              }}
            >
              {avgRating > 0 ? Number(avgRating).toFixed(1) : '—'}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.3} mb={0.4}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={avgRating > 0 && i < Math.round(avgRating) ? '#f59e0b' : 'none'}
                color={avgRating > 0 && i < Math.round(avgRating) ? '#f59e0b' : '#4b5563'}
              />
            ))}
          </Stack>
          <Typography sx={{ fontSize: '0.85rem', color: '#A1A1AA' }}>
            {totalCount} review{totalCount !== 1 ? 's' : ''}
          </Typography>
        </Box>
      )}

      <Box sx={{ mb: 1 }}>
        {preview.length > 0 ? (
          preview.map((rev) => (
            <ReviewCard key={rev.id} rev={rev} user={user} />
          ))
        ) : (
          <Box
            sx={{
              py: 3,
              textAlign: 'center',
              borderRadius: '12px',
              background: '#18181C',
              border: '1px solid #2A2A30',
              mb: 1,
            }}
          >
            <Typography sx={{ fontSize: '0.88rem', color: '#71717A' }}>
              No reviews yet — be the first to share your experience.
            </Typography>
          </Box>
        )}
      </Box>

      {totalCount > 2 && (
        <Button
          size="small"
          endIcon={<ChevronRight size={15} />}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: '#3b82f6',
            p: 0,
            mb: 3,
            '&:hover': { color: '#60a5fa', background: 'none' },
          }}
        >
          See all {totalCount} reviews
        </Button>
      )}

      {!isHost && !userHasReviewed && (
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: '14px',
            background: '#111114',
            border: '1px solid #2A2A30',
            mb: 2,
            opacity: isConfirmedMember ? 1 : 0.7,
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', mb: 2 }}>
            Write a review
          </Typography>

          <Stack spacing={1.75} mb={2}>
            <StarRow
              label="Rate your experience"
              value={rating}
              onChange={setRating}
            />
          </Stack>

          <TextField
            fullWidth
            multiline
            rows={3}
            value={reviewText}
            onChange={(e) => {
              const sanitized = e.target.value.replace(/<[^>]*>?/gm, '');
              if (sanitized.length <= 500) setReviewText(sanitized);
            }}
            placeholder="How was your experience with this host and plan?"
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                background: '#18181C',
                color: '#f3f4f6',
                fontSize: '0.88rem',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#22c55e' },
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={submitting || reviewText.trim().length < 5}
            startIcon={
              submitting ? <CircularProgress size={15} color="inherit" /> : null
            }
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              },
              '&.Mui-disabled': {
                background: '#2A2A30',
                color: '#6b7280',
              },
            }}
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </Button>
        </Box>
      )}

      {!isHost && userHasReviewed && (
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Chip
            icon={<CheckCircle2 size={13} color="#22c55e" />}
            label="You've reviewed this listing"
            size="small"
            sx={{
              background: 'rgba(34,197,94,0.1)',
              color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.25)',
              fontWeight: 700,
            }}
          />
          <Button
            size="small"
            color="error"
            startIcon={<Trash2 size={14} />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              borderRadius: '8px',
            }}
          >
            Delete Review
          </Button>
        </Stack>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            background: '#111114',
            border: '1px solid #2A2A30',
            borderRadius: '16px',
            color: '#ffffff',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#ffffff' }}>
          Delete your review?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#A1A1AA' }}>
            This will remove your review from this listing. You'll be able to write a new one after.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: '#A1A1AA',
              borderRadius: '10px',
              '&:hover': { background: 'rgba(255,255,255,0.05)' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 14px rgba(239,68,68,0.3)',
            }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: '12px', fontWeight: 700 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MemberReviews;
