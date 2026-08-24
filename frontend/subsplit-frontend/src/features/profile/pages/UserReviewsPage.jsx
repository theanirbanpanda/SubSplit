import React, { useEffect, useState } from 'react';
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
  LinearProgress,
  IconButton,
  Tabs,
  Tab,
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

  const rawReviewsList = userReviews?.reviews || [];

  const hostReviews = rawReviewsList.filter(r => r.isHostReview === true);
  const buyerReviews = rawReviewsList.filter(r => r.isHostReview === false);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const currentReviewsList = activeTab === 0 ? hostReviews : buyerReviews;
  
  const totalReviews = currentReviewsList.length;
  let sumRating = 0;
  currentReviewsList.forEach((r) => {
    sumRating += r.rating || 5;
  });
  const avgRating = totalReviews > 0 ? (sumRating / totalReviews) : 0;

  // Calculate rating breakdown distribution
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  currentReviewsList.forEach((r) => {
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
              My Reputation & Reviews
            </Typography>
            <Chip
              icon={<Award size={14} color="#3b82f6" />}
              label="Verified Feedback"
              size="small"
              sx={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6', fontWeight: 800, border: '1px solid rgba(59,130,246,0.3)' }}
            />
          </Stack>
          <Typography sx={{ fontSize: '0.84rem', color: '#9ca3af', mt: 0.3 }}>
            Transparent ratings and feedback received as a Host or a Buyer
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} textColor="inherit" indicatorColor="primary">
          <Tab label="Reviews as a Host" sx={{ fontWeight: 800, color: activeTab === 0 ? '#3b82f6' : '#9ca3af', textTransform: 'none', fontSize: '0.95rem' }} />
          <Tab label="Reviews as a Buyer" sx={{ fontWeight: 800, color: activeTab === 1 ? '#3b82f6' : '#9ca3af', textTransform: 'none', fontSize: '0.95rem' }} />
        </Tabs>
      </Box>

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
          <Grid item xs={12} md={4.5} sx={{ borderRight: { md: '1px solid rgba(255,255,255,0.08)' }, pr: { md: 4 } }}>
            <Stack direction="column" alignItems="center" textAlign="center">
              <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                Overall {activeTab === 0 ? 'Host' : 'Buyer'} Score
              </Typography>

              <Typography sx={{ fontWeight: 900, fontSize: '3.6rem', color: '#f59e0b', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {totalReviews > 0 ? Number(avgRating).toFixed(1) : '0.0'}
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
                <ShieldCheck size={14} /> 100% Verified Interactions
              </Typography>
            </Stack>
          </Grid>

          {/* Right Column: Rating Breakdown Progress Bars */}
          <Grid item xs={12} md={7.5}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: '#f3f4f6', mb: 2 }}>
              Rating Distribution
            </Typography>

            <Stack spacing={1.25}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star] || 0;
                const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

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
            Received Feedback ({currentReviewsList.length})
          </Typography>
        </Stack>

        {currentReviewsList.length === 0 ? (
          <Paper elevation={0} sx={{ p: 5, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <MessageSquare size={40} color="#64748b" style={{ marginBottom: 12 }} />
            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#f3f4f6', mb: 0.5 }}>
              No Reviews Received Yet
            </Typography>
            <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af', maxWidth: 400, mx: 'auto' }}>
              When other users interact with you and leave a review, their feedback will appear here.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2.5}>
            {currentReviewsList.map((rev) => {
              const name = rev.reviewerName || 'Verified User';
              const initials = rev.reviewerInitials || 'VU';
              const avatarBg = rev.avatarBg || '#2563eb';
              const rating = rev.rating || 5;
              const date = rev.formattedDate || 'Recently';
              const comment = rev.reviewText || '';
              const listingTitle = rev.listingTitle || (activeTab === 0 ? 'Subscription Group' : 'Group Purchase');

              const isClickable = rev.listingId && activeTab === 0;

              return (
                <Grid item xs={12} key={rev.id}>
                  <Paper
                    onClick={() => {
                      if (isClickable) {
                        navigate(`/app/marketplace/${rev.listingId}`);
                      }
                    }}
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: '20px',
                      background: '#14161a',
                      cursor: isClickable ? 'pointer' : 'default',
                      border: '1px solid rgba(255,255,255,0.08)',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        borderColor: isClickable ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)',
                        transform: isClickable ? 'translateY(-2px)' : 'none'
                      },
                    }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2} mb={2}>
                      <Stack direction="row" alignItems="center" spacing={1.75}>
                        <Avatar sx={{ width: 44, height: 44, background: avatarBg, fontSize: '1rem', fontWeight: 800, border: '2px solid rgba(255,255,255,0.1)' }}>
                          {initials}
                        </Avatar>
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={0.75}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.94rem', color: '#f3f4f6' }}>
                              {name}
                            </Typography>
                            {rev.isVerifiedMember && (
                              <Sparkles size={14} color="#3b82f6" />
                            )}
                          </Stack>
                          <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600 }}>
                            {date}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1} sx={{ background: '#1c1e24', px: 1.5, py: 0.75, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#f59e0b' }}>{rating}.0</Typography>
                        <Stack direction="row" spacing={0.25}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < rating ? '#f59e0b' : 'none'} color={i < rating ? '#f59e0b' : '#374151'} />
                          ))}
                        </Stack>
                      </Stack>
                    </Stack>

                    <Typography sx={{ fontSize: '0.92rem', color: '#d1d5db', lineHeight: 1.6, mb: 2 }}>
                      {comment}
                    </Typography>

                    <Box sx={{ p: 1.5, borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Typography sx={{ fontSize: '0.76rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 0.75, fontWeight: 600 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />
                        Reviewed for: <span style={{ color: '#f3f4f6', fontWeight: 700 }}>{listingTitle}</span>
                      </Typography>
                    </Box>
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
