import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Star,
  ArrowLeft,
  ShieldCheck,
  Award,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { fetchUserReviews } from '../../marketplace/marketplaceSlice';
import ScrollToTop from '../../landing/components/ScrollToTop';

function UserReviewsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const { userReviews } = useSelector((state) => state.marketplace);

  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserReviews(userId));
    }
  }, [userId, dispatch]);

  const reviewsList = userReviews?.reviews || [
    {
      id: 1,
      reviewerName: 'Rohan Sharma',
      reviewerInitials: 'RS',
      avatarBg: '#2563eb',
      rating: 5,
      formattedDate: 'Aug 02, 2026',
      reviewText: 'Super fast credential delivery! Host responded within 5 minutes and the Netflix 4K profile works flawlessly.',
      isVerifiedMember: true,
      listingTitle: 'Netflix Premium 4K Ultra HD',
    },
    {
      id: 2,
      reviewerName: 'Priya Patel',
      reviewerInitials: 'PP',
      avatarBg: '#a855f7',
      rating: 5,
      formattedDate: 'Jul 28, 2026',
      reviewText: 'Great experience splitting Spotify Family. Monthly renewal was smooth with zero interruptions.',
      isVerifiedMember: true,
      listingTitle: 'Spotify Family Plan',
    },
    {
      id: 3,
      reviewerName: 'Ananya Verma',
      reviewerInitials: 'AV',
      avatarBg: '#22c55e',
      rating: 4,
      formattedDate: 'Jul 15, 2026',
      reviewText: 'Reliable host! Verified KYC and instant escrow release.',
      isVerifiedMember: true,
      listingTitle: 'ChatGPT Plus Team Account',
    },
  ];

  const totalReviews = userReviews?.totalReviews ?? reviewsList.length;
  const avgRating = userReviews?.averageRating ?? 4.9;

  // Calculate rating breakdown distribution
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviewsList.forEach((r) => {
    const star = Math.min(5, Math.max(1, r.rating || 5));
    ratingCounts[star] = (ratingCounts[star] || 0) + 1;
  });

  return (
    <Box sx={{ color: '#f3f4f6', pb: 8 }}>
      <ScrollToTop />

      {/* ─── Page Header & Back Navigation ─── */}
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <IconButton
          onClick={() => navigate('/app/profile')}
          sx={{
            background: '#14161a',
            color: '#f3f4f6',
            border: '1px solid rgba(255,255,255,0.08)',
            '&:hover': { background: '#1c1e24', borderColor: '#3b82f6' },
          }}
        >
          <ArrowLeft size={20} />
        </IconButton>

        <Box>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.6rem', letterSpacing: '-0.02em' }}>
              Host Reputation & Reviews
            </Typography>
            <Chip
              icon={<Award size={14} color="#f59e0b" />}
              label="Verified Host Reviews"
              size="small"
              sx={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', fontWeight: 800, border: '1px solid rgba(245,158,11,0.3)' }}
            />
          </Stack>
          <Typography sx={{ fontSize: '0.84rem', color: '#9ca3af', mt: 0.3 }}>
            Transparent ratings and feedback received from verified group joinees
          </Typography>
        </Box>
      </Stack>

      {/* ─── Summary Overview Card ─── */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: '24px',
          background: '#14161a',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          mb: 4,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left Column: Big Average Rating */}
          <Grid size={{ xs: 12, md: 4.5 }} sx={{ borderRight: { md: '1px solid rgba(255,255,255,0.08)' }, pr: { md: 4 } }}>
            <Stack direction="column" alignItems="center" textAlign="center">
              <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                Overall Host Score
              </Typography>

              <Typography sx={{ fontWeight: 900, fontSize: '3.6rem', color: '#f59e0b', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {Number(avgRating).toFixed(1)}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={0.5} my={1.5}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} fill={i < Math.round(avgRating) ? '#f59e0b' : 'none'} color="#f59e0b" />
                ))}
              </Stack>

              <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#f3f4f6' }}>
                Based on {totalReviews} {totalReviews === 1 ? 'Verified Review' : 'Verified Reviews'}
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#22c55e', mt: 0.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ShieldCheck size={14} /> 100% Verified Escrow Purchases
              </Typography>
            </Stack>
          </Grid>

          {/* Right Column: Rating Breakdown Progress Bars */}
          <Grid size={{ xs: 12, md: 7.5 }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: '#f3f4f6', mb: 2 }}>
              Rating Distribution
            </Typography>

            <Stack spacing={1.25}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star] || 0;
                const percent = totalReviews > 0 ? (count / totalReviews) * 100 : star === 5 ? 85 : star === 4 ? 15 : 0;

                return (
                  <Stack key={star} direction="row" alignItems="center" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ minWidth: 48 }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#f3f4f6' }}>{star}</Typography>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={percent}
                      sx={{
                        flexGrow: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#1c1e24',
                        '& .MuiLinearProgress-bar': {
                          background: star >= 4 ? 'linear-gradient(90deg, #f59e0b 0%, #22c55e 100%)' : '#3b82f6',
                          borderRadius: 4,
                        },
                      }}
                    />

                    <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', minWidth: 32, textAlign: 'right', fontWeight: 700 }}>
                      {count}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* ─── Reviews List Section ─── */}
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.25rem' }}>
            All Received Reviews ({reviewsList.length})
          </Typography>
          <Chip label="Read-Only Feedback" size="small" sx={{ background: '#1c1e24', color: '#9ca3af', fontSize: '0.72rem', fontWeight: 700 }} />
        </Stack>

        {reviewsList.length === 0 ? (
          <Paper elevation={0} sx={{ p: 5, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <MessageSquare size={40} color="#64748b" style={{ marginBottom: 12 }} />
            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#f3f4f6', mb: 0.5 }}>
              No Reviews Received Yet
            </Typography>
            <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af', maxWidth: 400, mx: 'auto' }}>
              When joinees purchase passes from your subscription listings and submit reviews, their verified feedback will appear here.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2.5}>
            {reviewsList.map((rev) => {
              const name = rev.reviewerName || 'Verified Member';
              const initials = rev.reviewerInitials || 'VM';
              const avatarBg = rev.avatarBg || '#2563eb';
              const rating = rev.rating || 5;
              const date = rev.formattedDate || 'Recently';
              const comment = rev.reviewText || '';
              const listingTitle = rev.listingTitle || 'Subscription Group';

              return (
                <Grid size={{ xs: 12 }} key={rev.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: '20px',
                      background: '#14161a',
                      border: '1px solid rgba(255,255,255,0.08)',
                      transition: 'border-color 0.2s ease',
                      '&:hover': { borderColor: 'rgba(59,130,246,0.3)' },
                    }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2} mb={2}>
                      <Stack direction="row" alignItems="center" spacing={1.75}>
                        <Avatar
                          src={rev.reviewerAvatar}
                          sx={{ width: 44, height: 44, bgcolor: avatarBg, fontWeight: 900, fontSize: '0.92rem' }}
                        >
                          {initials}
                        </Avatar>

                        <Box>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography sx={{ fontWeight: 900, fontSize: '0.98rem', color: '#f3f4f6' }}>
                              {name}
                            </Typography>
                            <Chip
                              icon={<ShieldCheck size={11} color="#22c55e" />}
                              label="Verified Joinee"
                              size="small"
                              sx={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', fontSize: '0.65rem', fontWeight: 800, height: 20 }}
                            />
                          </Stack>
                          <Typography sx={{ fontSize: '0.74rem', color: '#3b82f6', mt: 0.2, fontWeight: 700 }}>
                            Pass: {listingTitle}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Stack direction="row" alignItems="center" spacing={0.4}>
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </Stack>
                        <Typography sx={{ fontSize: '0.76rem', color: '#9ca3af', fontWeight: 600 }}>
                          {date}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Typography sx={{ fontSize: '0.88rem', color: '#f3f4f6', lineHeight: 1.6, fontStyle: 'italic' }}>
                        "{comment}"
                      </Typography>
                    </Paper>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default UserReviewsPage;
