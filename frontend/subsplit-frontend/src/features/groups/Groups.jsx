import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMySubscriptions,
  fetchSubscriptionSummary,
  fetchSubscriptionCredentials,
  cancelSubscription,
  toggleAutoRenew,
} from './subscriptionsSlice';
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
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from '@mui/material';
import {
  ShieldCheck,
  TrendingDown,
  Clock,
  MessageSquare,
  Copy,
  Check,
  Plus,
  AlertTriangle,
  LogOut,
  ExternalLink,
  Sparkles,
  Tv2,
  Music,
  Bot,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PROVIDER_ICONS = {
  netflix: { Icon: Tv2, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  spotify: { Icon: Music, color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
  chatgpt: { Icon: Bot, color: '#14b8a6', bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.3)' },
};

const DEFAULT_THEME = { Icon: Zap, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' };

function Groups() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subscriptions, summaryStats, activeCredentials } = useSelector((state) => state.subscriptions);

  const [copiedId, setCopiedId] = useState(null);
  const [chatHost, setChatHost] = useState(null);
  const [credModalSub, setCredModalSub] = useState(null);

  useEffect(() => {
    dispatch(fetchMySubscriptions());
    dispatch(fetchSubscriptionSummary());
  }, [dispatch]);

  const handleCopy = (id, link) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleAutoRenew = (id, currentVal) => {
    dispatch(toggleAutoRenew({ id, autoRenew: !currentVal }));
  };

  const handleCancelPass = (id) => {
    if (window.confirm('Are you sure you want to cancel your slot membership? You will retain access until the end of your billing period.')) {
      dispatch(cancelSubscription(id));
    }
  };

  const handleOpenCredentials = (sub) => {
    setCredModalSub(sub);
    dispatch(fetchSubscriptionCredentials(sub.id));
  };

  // Map subscriptions to UI theme
  const activeMemberships = subscriptions.map((item) => {
    const prov = (item.providerName || item.title || '').toLowerCase();
    const theme = Object.keys(PROVIDER_ICONS).find(k => prov.includes(k))
      ? PROVIDER_ICONS[Object.keys(PROVIDER_ICONS).find(k => prov.includes(k))]
      : DEFAULT_THEME;

    let statusColor = '#22c55e';
    let statusBg = 'rgba(34,197,94,0.15)';
    let statusBorder = 'rgba(34,197,94,0.3)';

    if (item.statusDisplay === 'Renewing Soon' || (item.daysLeft != null && item.daysLeft <= 7 && item.daysLeft > 0)) {
      statusColor = '#f59e0b';
      statusBg = 'rgba(245,158,11,0.15)';
      statusBorder = 'rgba(245,158,11,0.3)';
    } else if (item.statusDisplay === 'Expired' || item.statusDisplay === 'Cancelled') {
      statusColor = '#ef4444';
      statusBg = 'rgba(239,68,68,0.15)';
      statusBorder = 'rgba(239,68,68,0.3)';
    }

    return {
      ...item,
      ...theme,
      statusColor,
      statusBg,
      statusBorder,
      statusText: item.statusDisplay || 'Active',
      host: item.host || { name: 'Verified Host', initials: 'VH', rating: 4.9, responseTime: '< 15m', isVerified: true, avatarBg: '#2563eb' },
      credentials: {
        type: item.credentialType || 'Invite Link',
        link: item.credentialLink || 'https://subsplit.com/invite',
      },
    };
  });


  return (
    <Box sx={{ color: '#f3f4f6' }}>
      {/* ─── Header & Compact Metrics ─── */}
      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="flex-start" justifyContent="space-between" spacing={2.5} mb={3}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 900, fontSize: { xs: '1.75rem', md: '2.1rem' }, color: '#f3f4f6', letterSpacing: '-0.03em' }}
              >
                My Memberships
              </Typography>
              <Chip
                icon={<Sparkles size={13} color="#2563eb" />}
                label="3 Active Passes"
                size="small"
                sx={{ background: 'rgba(37,99,235,0.12)', color: '#3b82f6', fontWeight: 800, border: '1px solid rgba(37,99,235,0.3)' }}
              />
            </Stack>
            <Typography sx={{ color: '#9ca3af', fontSize: '0.95rem' }}>
              Manage your active subscription passes, renewal dates, and host credentials in one place.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => navigate('/app/marketplace')}
            sx={{
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.88rem',
              py: 1.1,
              px: 2.5,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            Join New Group
          </Button>
        </Stack>

        {/* ─── 3 Header Stats Cards (50/50 Balance) ─── */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                Active Memberships
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#f3f4f6', mt: 0.5, lineHeight: 1 }}>
                {summaryStats?.totalActiveSubscriptions ?? activeMemberships.length} Subscription Passes
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#22c55e', mt: 0.8, fontWeight: 700 }}>
                100% Escrow Protected
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                Total Monthly Savings
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#22c55e', mt: 0.5, lineHeight: 1 }}>
                ₹{summaryStats?.totalSavings ?? 1240} / month
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.8 }}>
                Saving ₹{((summaryStats?.totalSavings ?? 1240) * 12).toLocaleString()} annually
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                Upcoming Renewals
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#f59e0b', mt: 0.5, lineHeight: 1 }}>
                Next: {summaryStats?.nextRenewalDate ?? 'Aug 15'}
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.8 }}>
                Monthly Spend: ₹{summaryStats?.monthlySpend ?? 587}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* ─── Upcoming Renewals Horizontal Timeline Bar ─── */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Clock size={18} color="#f59e0b" />
            <Typography sx={{ fontWeight: 800, fontSize: '0.98rem', color: '#f3f4f6' }}>
              Upcoming Renewals (Next 30 Days)
            </Typography>
          </Stack>

          <Chip label="Auto-Pay Secured" size="small" sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.68rem' }} />
        </Stack>

        <Grid container spacing={2}>
          {activeMemberships.map(({ id, title, price, renewalDate, daysLeft, Icon, color, bg, border }) => (
            <Grid item xs={12} sm={4} key={id}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={14} color={color} />
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#f3f4f6' }}>
                      {(title || '').split(' ')[0]}
                    </Typography>
                  </Stack>

                  <Chip label={`In ${daysLeft ?? 10} days`} size="small" sx={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 800, fontSize: '0.64rem', height: 18 }} />
                </Stack>

                <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                    {renewalDate}
                  </Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: '0.92rem', color: '#3b82f6' }}>
                    ₹{price}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* ─── Digital Pass Membership Cards Grid ─── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', mb: 2.5, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>
          Active Digital Passes
        </Typography>

        <Grid container spacing={3}>
          {activeMemberships.map((mem) => {
            const {
              id,
              listingId,
              title,
              category,
              price,
              originalPrice,
              savingsPercent,
              renewalDate,
              daysLeft,
              statusText,
              statusColor,
              statusBg,
              statusBorder,
              filledSeats = 3,
              totalSeats = 4,
              credentials,
              host,
              Icon,
              color,
              bg,
              border,
              autoRenew,
            } = mem;

            const progress = (filledSeats / totalSeats) * 100;

            return (
              <Grid item xs={12} md={6} key={id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 3.5 },
                    borderRadius: '24px',
                    background: '#14161a',
                    border: '1px solid rgba(255,255,255,0.08)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: '#2563eb',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
                    },
                  }}
                >
                  {/* Top Row: Icon + Title + Status Chip */}
                  <Box mb={2.5}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
                      <Stack direction="row" alignItems="center" spacing={1.75}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '14px',
                            background: bg,
                            border: `1px solid ${border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={24} color={color} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                            {title}
                          </Typography>
                          <Typography sx={{ fontSize: '0.76rem', color: '#9ca3af', mt: 0.3 }}>
                            {category} Pass
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        label={statusText}
                        size="small"
                        sx={{
                          background: statusBg,
                          color: statusColor,
                          border: `1px solid ${statusBorder}`,
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          height: 22,
                        }}
                      />
                    </Stack>

                    {/* Price & Savings Highlight */}
                    <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)', mb: 2 }}>
                      <Grid container alignItems="center">
                        <Grid item xs={6}>
                          <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>
                            Monthly Payment
                          </Typography>
                          <Stack direction="row" alignItems="baseline" spacing={0.75}>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: '#3b82f6', lineHeight: 1 }}>
                              ₹{price}
                            </Typography>
                            <Typography sx={{ fontSize: '0.78rem', color: '#71717A', textDecoration: 'line-through' }}>
                              ₹{originalPrice}
                            </Typography>
                          </Stack>
                        </Grid>

                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                          <Chip
                            label={`Saved ${savingsPercent}%`}
                            sx={{
                              background: 'rgba(34,197,94,0.15)',
                              color: '#22c55e',
                              fontWeight: 900,
                              fontSize: '0.75rem',
                              border: '1px solid rgba(34,197,94,0.3)',
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Renewal & Occupancy Row */}
                    <Grid container spacing={2} mb={2}>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mb: 0.3 }}>
                          Renewal Countdown
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b' }}>
                          {daysLeft ?? 10} Days ({renewalDate})
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mb: 0.3 }}>
                          Seat Capacity ({filledSeats}/{totalSeats})
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#252830',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 100%)',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Host Profile Info */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between" p={1.5} sx={{ borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)', mb: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: host.avatarBg || '#2563eb', fontWeight: 900, fontSize: '0.78rem' }}>
                          {host.initials || 'H'}
                        </Avatar>
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.82rem', color: '#f3f4f6' }}>
                              {host.name}
                            </Typography>
                            {host.isKycVerified && <ShieldCheck size={12} color="#22c55e" />}
                          </Stack>
                          <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                            {host.rating}★ • Responds {host.responseTime || '< 15m'}
                          </Typography>
                        </Box>
                      </Stack>

                      <Button
                        size="small"
                        startIcon={<MessageSquare size={13} />}
                        onClick={() => navigate(`/app/messages?recipientId=${host.id || 1}&listingId=${listingId || id}`)}
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#3b82f6',
                          textTransform: 'none',
                          border: '1px solid rgba(37,99,235,0.3)',
                          borderRadius: '8px',
                          py: 0.3,
                          px: 1.2,
                          '&:hover': { background: 'rgba(37,99,235,0.1)' },
                        }}
                      >
                        Chat
                      </Button>
                    </Stack>

                    {/* Credentials / Invite Link Box */}
                    <Box sx={{ p: 1.5, borderRadius: '12px', background: '#1c1e24', border: '1px border-dash rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ overflow: 'hidden', mr: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>
                          Access Link ({credentials.type})
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#f3f4f6', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {credentials.link}
                        </Typography>
                      </Box>

                      <Tooltip title={copiedId === id ? 'Copied!' : 'Copy Access Link'}>
                        <IconButton size="small" onClick={() => handleCopy(id, credentials.link)} sx={{ color: copiedId === id ? '#22c55e' : '#3b82f6' }}>
                          {copiedId === id ? <Check size={16} /> : <Copy size={16} />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Quick Actions Footer */}
                  <Stack direction="row" spacing={1} pt={2} sx={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/app/marketplace/${listingId || id}`)}
                      sx={{
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        py: 0.8,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      }}
                    >
                      Manage Pass
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleCancelPass(id)}
                      sx={{
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#ef4444',
                        borderColor: 'rgba(239,68,68,0.3)',
                        textTransform: 'none',
                        py: 0.8,
                        whiteSpace: 'nowrap',
                        '&:hover': { borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' },
                      }}
                    >
                      Leave Group
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>


      {/* Host Communication Dialog */}
      <Dialog
        open={Boolean(chatHost)}
        onClose={() => setChatHost(null)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: '#14161a',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#f3f4f6',
            width: '100%',
            maxWidth: 420,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
          Chat with Host ({chatHost?.name})
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, borderRadius: '12px', background: '#1c1e24', mb: 2 }}>
            <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af' }}>
              Send a secure message directly to your group host regarding access credentials or renewal updates.
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Type your message to host..."
            variant="outlined"
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => setChatHost(null)}
            sx={{ mt: 2, borderRadius: '10px', fontWeight: 800, py: 1.1, textTransform: 'none', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
          >
            Send Message
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Groups;
