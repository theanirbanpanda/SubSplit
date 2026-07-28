import React from 'react';
import { Box, Typography, Paper, Grid, LinearProgress, Stack, Chip, Avatar } from '@mui/material';
import { Users, Clock, Calendar, CheckCircle2 } from 'lucide-react';

function OccupancyCard({ listing }) {
  const {
    seatsLeft = 2,
    totalSeats = 4,
    renewalDate = 'August 15, 2026',
  } = listing;

  const filledSeats = totalSeats - seatsLeft;
  const progressPercent = (filledSeats / totalSeats) * 100;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', mb: 2, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
        Membership & Seat Capacity
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Users size={20} color="#3b82f6" />
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>
              {filledSeats} / {totalSeats} Seats Occupied
            </Typography>
          </Stack>

          <Chip
            label={`${seatsLeft} Seat${seatsLeft !== 1 ? 's' : ''} Open`}
            sx={{
              background: 'rgba(34,197,94,0.15)',
              color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.3)',
              fontWeight: 800,
              fontSize: '0.78rem',
              borderRadius: '8px',
            }}
          />
        </Stack>

        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 9,
            borderRadius: 5,
            backgroundColor: '#2A2A30',
            mb: 2.5,
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 100%)',
            },
          }}
        />

        {listing.occupants && listing.occupants.length > 0 && (
          <Box sx={{ mb: 2.5, p: 1.5, borderRadius: '12px', background: '#18181C', border: '1px solid #2A2A30' }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#A1A1AA', mb: 1 }}>
              Active Group Occupants:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {listing.occupants.map((occ) => (
                <Chip
                  key={occ.id}
                  avatar={
                    occ.memberAvatar ? (
                      <Avatar src={occ.memberAvatar} />
                    ) : (
                      <Avatar sx={{ bgcolor: '#2563eb', fontWeight: 800, fontSize: '0.7rem' }}>
                        {occ.memberInitials || 'M'}
                      </Avatar>
                    )
                  }
                  label={`Slot #${occ.seatNumber}: ${occ.memberName}`}
                  size="small"
                  sx={{
                    background: 'rgba(255,255,255,0.05)',
                    color: '#ffffff',
                    border: '1px solid #2A2A30',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}


        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#18181C', border: '1px solid #2A2A30' }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <CheckCircle2 size={16} color="#22c55e" />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#A1A1AA' }}>
                  Available Seat Status
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: '#22c55e' }}>
                Instant Joining Ready
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#18181C', border: '1px solid #2A2A30' }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Clock size={16} color="#a855f7" />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#A1A1AA' }}>
                  Expected Join Time
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
                &lt; 2 Minutes
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#18181C', border: '1px solid #2A2A30' }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Calendar size={16} color="#f59e0b" />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#A1A1AA' }}>
                  Renewal Countdown
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
                {renewalDate}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default OccupancyCard;
