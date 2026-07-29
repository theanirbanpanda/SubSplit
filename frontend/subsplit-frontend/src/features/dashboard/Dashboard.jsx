import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchMySubscriptions,
  fetchSubscriptionSummary,
  cancelSubscription,
  toggleAutoRenew,
} from '../groups/subscriptionsSlice';
import { fetchMyWallet } from '../settlements/walletSlice';
import { fetchMyJoinRequests } from '../marketplace/marketplaceSlice';
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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from '@mui/material';
import {
  Layers,
  Wallet as WalletIcon,
  Clock,
  CreditCard,
  ShieldCheck,
  Plus,
  MessageSquare,
  Copy,
  Check,
  Tv2,
  Music,
  Bot,
  Zap,
  Sparkles,
  Send,
  CheckCircle2,
  XCircle,
  Hourglass,
  ChevronRight,
} from 'lucide-react';

import DashboardHero from './components/DashboardHero';
import StatCard from './components/StatCard';
import RenewalList from './components/RenewalList';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import ProtectionBanner from '../marketplace/components/ProtectionBanner';

import styles from './Dashboard.module.scss';


const PROVIDER_ICONS = {
  netflix: { Icon: Tv2, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  spotify: { Icon: Music, color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
  chatgpt: { Icon: Bot, color: '#14b8a6', bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.3)' },
};

const DEFAULT_THEME = { Icon: Zap, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' };

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subscriptions, summaryStats } = useSelector((state) => state.subscriptions);
  const { wallet } = useSelector((state) => state.wallet);
  const { myJoinRequests } = useSelector((state) => state.marketplace);

  const [copiedId, setCopiedId] = useState(null);
  const [chatHost, setChatHost] = useState(null);

  useEffect(() => {
    dispatch(fetchMySubscriptions());
    dispatch(fetchSubscriptionSummary());
    dispatch(fetchMyWallet());
    dispatch(fetchMyJoinRequests());
  }, [dispatch]);

  const activeCount = summaryStats?.totalActiveSubscriptions ?? (subscriptions.length > 0 ? subscriptions.length : 3);
  const monthlySavings = summaryStats?.totalSavings != null ? `₹${summaryStats.totalSavings}` : '₹1,240';
  const balanceDisplay = wallet?.balance != null ? `₹${wallet.balance.toFixed(0)}` : '₹0';

  const handleCopy = (id, link) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancelPass = (id) => {
    if (window.confirm('Are you sure you want to cancel your slot membership? You will retain access until the end of your billing period.')) {
      dispatch(cancelSubscription(id));
    }
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
    <div className={styles.dashboardContainer}>
      {/* Hero Section */}
      <div className={styles.heroWrapper}>
        <DashboardHero />
      </div>

      {/* 4 Metric Stat Cards */}
      <div className={styles.statsGrid}>

        <StatCard 
          title="Active Subscriptions" 
          value={String(activeCount)} 
          icon={Layers} 
          colorClass="green" 
          linkTo="#my-subscriptions" 
        />
        <StatCard 
          title="Monthly Savings" 
          value={monthlySavings} 
          icon={WalletIcon} 
          colorClass="purple" 
          linkTo="/app/expenses" 
        />
        <StatCard 
          title="Upcoming Renewals" 
          value={String(activeCount)} 
          icon={Clock} 
          colorClass="yellow" 
          linkTo="/app/notifications" 
        />
        <StatCard 
          title="Wallet Balance" 
          value={balanceDisplay} 
          icon={CreditCard} 
          colorClass="blue" 
          linkTo="/app/settlements" 
        />
      </div>


      {/* ─── Section 1: My Subscription Passes ─── */}
      <Box sx={{ mb: 4 }} id="my-subscriptions">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
              My Subscription Passes
            </Typography>
            <Chip
              icon={<Sparkles size={13} color="#2563eb" />}
              label={`${activeMemberships.length} Active`}
              size="small"
              sx={{ background: 'rgba(37,99,235,0.12)', color: '#3b82f6', fontWeight: 800, border: '1px solid rgba(37,99,235,0.3)' }}
            />
          </Stack>

          <Button
            variant="contained"
            size="small"
            startIcon={<Plus size={15} />}
            onClick={() => navigate('/app/marketplace')}
            sx={{
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.82rem',
              py: 0.8,
              px: 2,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            }}
          >
            Explore Marketplace
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {activeMemberships.map((mem) => {
            const {
              id,
              listingId,
              title,
              category,
              price = 129,
              originalPrice = 649,
              savingsPercent = 80,
              renewalDate = 'Aug 15, 2026',
              daysLeft = 18,
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
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: '#2563eb',
                    },
                  }}
                >
                  <Box mb={2}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
                      <Stack direction="row" alignItems="center" spacing={1.75}>
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
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
                            {category || 'Subscription Pass'}
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

                    <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)', mb: 2 }}>
                      <Grid container alignItems="center">
                        <Grid item xs={6}>
                          <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>
                            Monthly Pass Price
                          </Typography>
                          <Stack direction="row" alignItems="baseline" spacing={0.75}>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.35rem', color: '#3b82f6', lineHeight: 1 }}>
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

                    <Grid container spacing={2} mb={2}>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mb: 0.3 }}>
                          Renewal Countdown
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b' }}>
                          {daysLeft} Days ({renewalDate})
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mb: 0.3 }}>
                          Seats ({filledSeats}/{totalSeats})
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
                        onClick={() => setChatHost(host)}
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
                        Chat Host
                      </Button>
                    </Stack>

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
                      View Details
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

      {/* ─── Section 2: My Group Requests ─── */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Send size={20} color="#3b82f6" />
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
              My Group Requests
            </Typography>
            <Chip
              label={`${myJoinRequests.length} Total`}
              size="small"
              sx={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6', fontWeight: 800, border: '1px solid rgba(59,130,246,0.3)' }}
            />
          </Stack>
        </Stack>

        {myJoinRequests && myJoinRequests.length > 0 ? (
          <Grid container spacing={2.5}>
            {myJoinRequests.map((req) => {
              const isApproved = req.status === 'APPROVED';
              const isPending = req.status === 'PENDING';
              const statusColor = isApproved ? '#22c55e' : (isPending ? '#f59e0b' : '#ef4444');
              const statusBg = isApproved ? 'rgba(34,197,94,0.12)' : (isPending ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)');
              const StatusIcon = isApproved ? CheckCircle2 : (isPending ? Hourglass : XCircle);
              const dateStr = req.createdAt ? new Date(req.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';

              return (
                <Grid item xs={12} sm={6} md={4} key={req.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: '18px',
                      background: '#14161a',
                      border: '1px solid rgba(255,255,255,0.08)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.2s ease',
                      '&:hover': { borderColor: '#3b82f6' },
                    }}
                  >
                    <Box>
                      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1.5}>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                            {req.listingTitle || 'Subscription Group'}
                          </Typography>
                          <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af', mt: 0.3 }}>
                            Host: {req.hostName || 'Verified Host'}
                          </Typography>
                        </Box>

                        <Chip
                          icon={<StatusIcon size={12} color={statusColor} />}
                          label={req.status}
                          size="small"
                          sx={{
                            background: statusBg,
                            color: statusColor,
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            border: `1px solid ${statusColor}44`,
                          }}
                        />
                      </Stack>

                      <Stack direction="row" alignItems="center" justifyContent="space-between" p={1.25} sx={{ borderRadius: '12px', background: '#1c1e24', mb: 2 }}>
                        <Typography sx={{ fontSize: '0.76rem', color: '#9ca3af' }}>
                          Seat Price
                        </Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', color: '#3b82f6' }}>
                          ₹{req.price != null ? req.price : '129'} / mo
                        </Typography>
                      </Stack>

                      <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mb: 2 }}>
                        Submitted on {dateStr}
                      </Typography>
                    </Box>

                    {req.listingId && (
                      <Button
                        fullWidth
                        size="small"
                        endIcon={<ChevronRight size={14} />}
                        onClick={() => navigate(`/app/marketplace/${req.listingId}`)}
                        sx={{
                          borderRadius: '10px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textTransform: 'none',
                          color: '#3b82f6',
                          border: '1px solid rgba(59,130,246,0.3)',
                          py: 0.6,
                          '&:hover': { background: 'rgba(59,130,246,0.1)' },
                        }}
                      >
                        View Listing Details
                      </Button>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Paper elevation={0} sx={{ p: 3.5, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#9ca3af', mb: 1.5 }}>
              You haven't submitted any group join requests yet.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/app/marketplace')}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.82rem' }}
            >
              Browse Available Groups
            </Button>
          </Paper>
        )}
      </Box>

      {/* ─── Lower Grid (Renewals, Activity, Quick Actions) ─── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left Column - Renewals */}
        <Grid item xs={12} md={4}>
          <RenewalList />
        </Grid>

        {/* Middle Column - Activity */}
        <Grid item xs={12} md={4}>
          <ActivityFeed />
        </Grid>

        {/* Right Column - Quick Actions */}
        <Grid item xs={12} md={4}>
          <QuickActions />
        </Grid>
      </Grid>

      {/* ─── Protection Banner ─── */}
      <ProtectionBanner />

      {/* Host Chat Dialog */}
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
    </div>
  );
}

export default Dashboard;

