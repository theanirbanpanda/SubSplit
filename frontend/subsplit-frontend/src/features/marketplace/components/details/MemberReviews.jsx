
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Chip,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { Star, ThumbsUp, ShieldCheck, Edit3, CheckCircle2 } from 'lucide-react';
import { fetchListingReviews } from '../../marketplaceSlice';
import { DEFAULT_REVIEWS } from '../../data/mockListings';
import WriteReviewModal from './WriteReviewModal';

function MemberReviews({ listingId, reviewSummary, hostId, hostName }) {
  const dispatch = useDispatch();
  const { currentReviews } = useSelector((state) => state.marketplace);
  const { user } = useSelector((state) => state.auth || {});

  const [helpfulCounts, setHelpfulCounts] = useState({});
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (listingId && !reviewSummary) {
      dispatch(fetchListingReviews(listingId));
    }
  }, [listingId, reviewSummary, dispatch]);

  const activeReviews = reviewSummary?.reviews || currentReviews?.reviews || DEFAULT_REVIEWS.map(r => ({
    id: r.id,
    reviewerId: r.reviewerId,
    reviewerName: r.name,
    city: r.city,
    avatarBg: r.avatarBg,
    reviewerInitials: r.initials,
    rating: r.rating,
    formattedDate: r.date,
    reviewText: r.comment,
    helpfulCount: r.helpfulCount || 10,
  }));

  const avgRating = reviewSummary?.averageRating || currentReviews?.averageRating || 4.9;

  const isHost = user && hostId && (user.id === hostId || user.email === hostId);
  const userHasReviewed = user && activeReviews.some(r => r.reviewerId === user.id);

  const handleHelpful = (id) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleReviewSuccess = (msg) => {
    setToast({ open: true, message: msg, severity: 'success' });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
          Verified Member Reviews
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Star size={18} fill="#f59e0b" color="#f59e0b" />
            <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', color: '#ffffff' }}>
              {avgRating} / 5.0
            </Typography>
          </Stack>

          {!isHost && !userHasReviewed && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Edit3 size={14} />}
              onClick={() => setReviewModalOpen(true)}
              sx={{
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'none',
                py: 0.6,
                px: 1.8,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              }}
            >
              Write a Review
            </Button>
          )}

          {userHasReviewed && (
            <Chip
              icon={<CheckCircle2 size={12} color="#22c55e" />}
              label="Reviewed"
              size="small"
              sx={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', fontWeight: 800, border: '1px solid rgba(34,197,94,0.3)' }}
            />
          )}
        </Stack>
      </Stack>

      <Stack spacing={2}>
        {activeReviews.map((rev) => {
          const id = rev.id;
          const name = rev.reviewerName || rev.name || 'Verified Member';
          const city = rev.city || 'Verified User';
          const initials = rev.reviewerInitials || rev.initials || 'VM';
          const avatarBg = rev.avatarBg || '#2563eb';
          const rating = rev.rating || 5;
          const date = rev.formattedDate || rev.date || 'Recently';
          const comment = rev.reviewText || rev.comment || '';
          const initialHelpful = rev.helpfulCount || 0;

          return (
            <Paper
              key={id}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '18px',
                background: '#111114',
                border: '1px solid #2A2A30',
                color: '#ffffff',
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Stack direction="row" alignItems="center" spacing={1.75}>
                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: avatarBg,
                      fontWeight: 800,
                      fontSize: '0.9rem',
                    }}
                  >
                    {initials}
                  </Avatar>

                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                        {name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#71717A' }}>
                        • {city}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={0.5} mt={0.2}>
                      <Chip
                        icon={<ShieldCheck size={10} color="#22c55e" />}
                        label="Verified Group Member"
                        size="small"
                        sx={{
                          background: 'rgba(34,197,94,0.12)',
                          color: '#22c55e',
                          border: '1px solid rgba(34,197,94,0.3)',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          height: 18,
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>

                <Typography sx={{ fontSize: '0.78rem', color: '#71717A' }}>
                  {date}
                </Typography>
              </Stack>

              {/* Rating Stars */}
              <Stack direction="row" alignItems="center" spacing={0.3} mb={1}>
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </Stack>

              <Typography sx={{ fontSize: '0.88rem', color: '#A1A1AA', lineHeight: 1.6, mb: 1.5 }}>
                "{comment}"
              </Typography>

              <Button
                size="small"
                onClick={() => handleHelpful(id)}
                startIcon={<ThumbsUp size={13} />}
                sx={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#A1A1AA',
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.3,
                  borderRadius: '6px',
                  border: '1px solid #2A2A30',
                  '&:hover': { color: '#3b82f6', borderColor: '#3b82f6', background: 'rgba(59,130,246,0.1)' },
                }}
              >
                Helpful ({(helpfulCounts[id] ?? initialHelpful)})
              </Button>
            </Paper>
          );
        })}
      </Stack>

      {/* Write Review Modal */}
      <WriteReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        listingId={listingId}
        hostName={hostName}
        onSuccess={handleReviewSuccess}
      />

      {/* Toast Notification */}
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

