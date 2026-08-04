import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Paper, Stack, Chip, Button, Avatar } from '@mui/material';
import { ShieldCheck, Star, Clock, Award, Calendar, CheckCircle2 } from 'lucide-react';

function HostProfileCard({ host = {} }) {
  const navigate = useNavigate();

  const {
    name = 'Vikram S.',
    initials = 'VS',
    avatarBg = '#2563eb',
    isKycVerified = true,
    rating = 4.9,
    successfulGroups = 14,
    responseTime = '< 15 mins',
    memberSince = 'Jan 2024',
    bio = 'Verified SubSplit super host managing top streaming & productivity family groups since 2024.',
  } = host;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', mb: 2, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
        Host Profile & Verification
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 3.5 },
          borderRadius: '20px',
          background: '#111114',
          border: '1px solid #2A2A30',
          color: '#ffffff',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="flex-start" justifyContent="space-between">
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Avatar
              src={host?.profileImage || host?.avatarUrl || ''}
              alt={name}
              sx={{
                width: 64,
                height: 64,
                bgcolor: avatarBg,
                fontWeight: 900,
                fontSize: '1.4rem',
                border: '2px solid #3b82f6',
                boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
              }}
            >
              {initials}
            </Avatar>

            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '1.15rem' }}>
                  {name}
                </Typography>
                {isKycVerified && (
                  <Chip
                    icon={<ShieldCheck size={12} color="#22c55e" />}
                    label="KYC Verified"
                    size="small"
                    sx={{
                      background: 'rgba(34,197,94,0.15)',
                      color: '#22c55e',
                      border: '1px solid rgba(34,197,94,0.3)',
                      fontWeight: 800,
                      fontSize: '0.68rem',
                      height: 20,
                    }}
                  />
                )}
              </Stack>

              <Typography sx={{ fontSize: '0.85rem', color: '#A1A1AA', lineHeight: 1.5 }}>
                {bio}
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/app/profile/reviews')}
            sx={{
              borderRadius: '10px',
              borderColor: '#2A2A30',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.82rem',
              textTransform: 'none',
              px: 2.5,
              py: 0.9,
              whiteSpace: 'nowrap',
              '&:hover': { borderColor: '#3b82f6', background: 'rgba(59,130,246,0.1)' },
            }}
          >
            View Host Reviews
          </Button>
        </Stack>

        {/* Host Stats Row */}
        <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid #2A2A30' }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                onClick={() => navigate('/app/profile/reviews')}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.85 } }}
              >
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#ffffff', lineHeight: 1 }}>
                    {rating}★ Rating
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#3b82f6', mt: 0.3, fontWeight: 700 }}>
                    View All Reviews →
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Award size={18} color="#3b82f6" />
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#ffffff', lineHeight: 1 }}>
                    {successfulGroups} Groups
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#71717A', mt: 0.3 }}>
                    Completed Joins
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Clock size={18} color="#22c55e" />
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#ffffff', lineHeight: 1 }}>
                    {responseTime}
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#71717A', mt: 0.3 }}>
                    Response Time
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Calendar size={18} color="#a855f7" />
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#ffffff', lineHeight: 1 }}>
                    {memberSince}
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#71717A', mt: 0.3 }}>
                    Member Since
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default HostProfileCard;
