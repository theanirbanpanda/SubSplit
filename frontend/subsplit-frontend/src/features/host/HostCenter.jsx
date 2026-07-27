import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  XCircle,
  Sparkles,
  Edit,
  Pause,
  Copy,
  Flame,
  Tv2,
  Music,
  Bot,
  Layers,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateListingModal from '../marketplace/components/CreateListingModal';

const LISTINGS_DATA = [
  {
    id: 'host-nflx',
    title: 'Netflix Premium 4K UHD',
    platform: 'Netflix',
    monthlyEarnings: 387,
    filledSeats: 3,
    totalSeats: 4,
    renewalDate: 'Aug 15, 2026',
    status: 'Active',
    health: 'Excellent',
    healthColor: '#22c55e',
    Icon: Tv2,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
  },
  {
    id: 'host-sptf',
    title: 'Spotify Premium Family',
    platform: 'Spotify',
    monthlyEarnings: 295,
    filledSeats: 5,
    totalSeats: 6,
    renewalDate: 'Aug 18, 2026',
    status: 'Active',
    health: 'Excellent',
    healthColor: '#22c55e',
    Icon: Music,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
  },
  {
    id: 'host-gpt',
    title: 'ChatGPT Plus Team',
    platform: 'OpenAI',
    monthlyEarnings: 1596,
    filledSeats: 4,
    totalSeats: 5,
    renewalDate: 'Aug 22, 2026',
    status: 'Active',
    health: 'Needs Attention',
    healthColor: '#f59e0b',
    Icon: Bot,
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
    border: 'rgba(20,184,166,0.3)',
  },
];

const PENDING_REQUESTS = [
  {
    id: 'req-1',
    userName: 'Rahul Malhotra',
    initials: 'RM',
    avatarBg: '#2563eb',
    trustScore: '4.9★',
    isKycVerified: true,
    requestedListing: 'Netflix Premium 4K (Slot 4)',
    timeAgo: '10 mins ago',
  },
  {
    id: 'req-2',
    userName: 'Priya Sharma',
    initials: 'PS',
    avatarBg: '#10b981',
    trustScore: '5.0★',
    isKycVerified: true,
    requestedListing: 'ChatGPT Plus Team (Slot 5)',
    timeAgo: '25 mins ago',
  },
];

const RECENT_EARNINGS = [
  { text: 'Escrow Released for Netflix 4K', amount: '+₹299', date: 'Today, 1:20 PM', color: '#22c55e' },
  { text: 'Spotify Slot Joined by Ananya', amount: '+₹149', date: 'Yesterday', color: '#22c55e' },
  { text: 'Payout Transferred to UPI', amount: '-₹2,500', date: 'Aug 12, 2026', color: '#3b82f6' },
];

const AI_RECOMMENDATIONS = [
  {
    title: 'High Demand for ChatGPT Plus',
    suggestion: 'Create 1 more ChatGPT Plus listing to earn an extra ₹1,596/mo.',
    action: 'Create Listing',
    color: '#14b8a6',
  },
  {
    title: 'Optimize Spotify Slot Pricing',
    suggestion: 'Increase Spotify slot price by ₹15 (similar groups sell at ₹74/mo).',
    action: 'Update Price',
    color: '#22c55e',
  },
];

const CREATE_STEPS = ['Choose Platform', 'Plan Details', 'Pricing', 'Seat Config', 'Verification', 'Publish'];

function HostCenter() {
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [approvedReqs, setApprovedReqs] = useState({});

  const handleApproveRequest = (id) => {
    setApprovedReqs((prev) => ({ ...prev, [id]: 'approved' }));
  };

  const handleRejectRequest = (id) => {
    setApprovedReqs((prev) => ({ ...prev, [id]: 'rejected' }));
  };

  return (
    <Box sx={{ color: '#f3f4f6' }}>
      {/* ─── Header & Top Actions ─── */}
      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="flex-start" justifyContent="space-between" spacing={2.5} mb={3}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 900, fontSize: { xs: '1.75rem', md: '2.1rem' }, color: '#f3f4f6', letterSpacing: '-0.03em' }}
              >
                Host Center Workspace
              </Typography>
              <Chip
                icon={<ShieldCheck size={13} color="#22c55e" />}
                label="Super Host Status"
                size="small"
                sx={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', fontWeight: 800, border: '1px solid rgba(34,197,94,0.3)' }}
              />
            </Stack>
            <Typography sx={{ color: '#9ca3af', fontSize: '0.95rem' }}>
              Manage your subscription sharing business, pending member approvals, and monthly earnings.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/app/settlements')}
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '0.88rem', py: 1, px: 2.2 }}
            >
              Withdraw Payouts (₹8,450)
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Plus size={16} />}
              onClick={() => setCreateModalOpen(true)}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 800,
                fontSize: '0.88rem',
                py: 1,
                px: 2.5,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
              }}
            >
              Create Listing
            </Button>
          </Stack>
        </Stack>

        {/* ─── Row 1: 4 Metric Overview Cards ─── */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
                Monthly Host Earnings
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#22c55e', mt: 0.5, lineHeight: 1 }}>
                ₹8,450 / mo
              </Typography>
              <Chip label="+18.4% this month" size="small" sx={{ mt: 1, background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.66rem', height: 18 }} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
                Active Groups
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#f3f4f6', mt: 0.5, lineHeight: 1 }}>
                4 Listings
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 1 }}>
                Netflix, Spotify, ChatGPT, Disney+
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
                Occupancy Rate
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#3b82f6', mt: 0.5, lineHeight: 1 }}>
                91.6%
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 1 }}>
                11 of 12 Total Seats Filled
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
                Pending Requests
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#f59e0b', mt: 0.5, lineHeight: 1 }}>
                2 Approvals
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#f59e0b', mt: 1, fontWeight: 700 }}>
                Requires host action
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* ─── Row 2: 60% / 40% Split (Listings Performance & Earnings Timeline) ─── */}
      <Grid container spacing={3} mb={4}>
        {/* Left 60%: Listing Performance Cards */}
        <Grid item xs={12} md={7.2}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.15rem' }}>
                Listing Performance Overview
              </Typography>
              <Button size="small" startIcon={<Plus size={14} />} onClick={() => setCreateModalOpen(true)} sx={{ textTransform: 'none', fontWeight: 700, color: '#3b82f6', fontSize: '0.82rem' }}>
                Add New
              </Button>
            </Stack>

            <Stack spacing={2}>
              {LISTINGS_DATA.map(({ id, title, monthlyEarnings, filledSeats, totalSeats, renewalDate, status, health, healthColor, Icon, color, bg, border }) => {
                const progress = (filledSeats / totalSeats) * 100;
                return (
                  <Paper
                    key={id}
                    elevation={0}
                    sx={{
                      p: 2.25,
                      borderRadius: '16px',
                      background: '#1c1e24',
                      border: '1px solid rgba(255,255,255,0.08)',
                      transition: 'border-color 0.15s ease',
                      '&:hover': { borderColor: '#2563eb' },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={18} color={color} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                            {title}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.2 }}>
                            Renews: {renewalDate}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip label={health} size="small" sx={{ background: `${healthColor}15`, color: healthColor, fontWeight: 800, fontSize: '0.64rem', height: 18 }} />
                        <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#22c55e' }}>
                          +₹{monthlyEarnings}/mo
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box sx={{ flexGrow: 1, mr: 3 }}>
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                            Occupancy ({filledSeats}/{totalSeats} Seats)
                          </Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, backgroundColor: '#252830', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 100%)' } }} />
                      </Box>

                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#3b82f6' } }}>
                          <Edit size={15} />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#f59e0b' } }}>
                          <Pause size={15} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        {/* Right 40%: Recent Earnings Timeline */}
        <Grid item xs={12} md={4.8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.1rem', mb: 2.5 }}>
              Recent Earnings & Payouts
            </Typography>

            <Stack spacing={2}>
              {RECENT_EARNINGS.map(({ text, amount, date, color }, idx) => (
                <Stack key={idx} direction="row" alignItems="center" justifyContent="space-between" p={1.75} sx={{ borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                      {text}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.3 }}>
                      {date}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', color }}>
                    {amount}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Row 3: Pending Join Requests (NO Tables!) ─── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', mb: 2.5, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          Pending Member Join Requests
        </Typography>

        <Grid container spacing={2.5}>
          {PENDING_REQUESTS.map(({ id, userName, initials, avatarBg, trustScore, isKycVerified, requestedListing, timeAgo }) => {
            const currentStatus = approvedReqs[id];

            return (
              <Grid item xs={12} md={6} key={id}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: avatarBg, fontWeight: 900, fontSize: '0.9rem' }}>
                        {initials}
                      </Avatar>
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#f3f4f6' }}>
                            {userName}
                          </Typography>
                          {isKycVerified && <ShieldCheck size={14} color="#22c55e" />}
                        </Stack>
                        <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                          Trust Rating: {trustScore} • {timeAgo}
                        </Typography>
                      </Box>
                    </Stack>

                    <Chip label={requestedListing.split(' ')[0]} size="small" sx={{ background: 'rgba(37,99,235,0.12)', color: '#3b82f6', fontWeight: 800, fontSize: '0.68rem' }} />
                  </Stack>

                  <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af', mb: 2 }}>
                    Requested: <Box component="span" sx={{ color: '#f3f4f6', fontWeight: 700 }}>{requestedListing}</Box>
                  </Typography>

                  {currentStatus ? (
                    <Box sx={{ p: 1.25, borderRadius: '10px', background: currentStatus === 'approved' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: currentStatus === 'approved' ? '#22c55e' : '#ef4444' }}>
                        {currentStatus === 'approved' ? '✓ Request Approved! Member added to group.' : '✕ Request Declined.'}
                      </Typography>
                    </Box>
                  ) : (
                    <Stack direction="row" spacing={1.5}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        onClick={() => handleApproveRequest(id)}
                        sx={{ borderRadius: '10px', fontWeight: 800, textTransform: 'none', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                      >
                        Approve Request
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        onClick={() => handleRejectRequest(id)}
                        sx={{ borderRadius: '10px', fontWeight: 700, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', textTransform: 'none' }}
                      >
                        Decline
                      </Button>
                    </Stack>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* ─── Row 4: Smart AI Recommendations ─── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', mb: 2.5, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          Smart Host AI Recommendations
        </Typography>

        <Grid container spacing={2.5}>
          {AI_RECOMMENDATIONS.map(({ title, suggestion, action, color }) => (
            <Grid item xs={12} sm={6} key={title}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" alignItems="center" spacing={1.25} mb={1}>
                  <Sparkles size={18} color={color} />
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#f3f4f6' }}>
                    {title}
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af', mb: 2, lineHeight: 1.5 }}>
                  {suggestion}
                </Typography>
                <Button size="small" variant="outlined" sx={{ borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'none', color, borderColor: color }}>
                  {action}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ─── Multi-step Create Listing Dialog ─── */}
      <CreateListingModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </Box>
  );
}

export default HostCenter;
