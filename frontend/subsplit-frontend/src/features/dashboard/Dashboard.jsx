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
  Divider,
  Switch,
  LinearProgress,
} from '@mui/material';
import {
  TrendingDown,
  CreditCard,
  Wallet,
  Clock,
  ArrowRight,
  Plus,
  ShieldCheck,
  Zap,
  Users,
  Tv2,
  Music,
  Bot,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ACTIVE_MEMBERSHIPS = [
  {
    id: 'nflx-1',
    title: 'Netflix Premium 4K UHD',
    price: 129,
    originalPrice: 649,
    savings: 80,
    renewalDate: 'Aug 15, 2026',
    hostName: 'Vikram S.',
    Icon: Tv2,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
  },
  {
    id: 'sptf-1',
    title: 'Spotify Premium Family',
    price: 59,
    originalPrice: 179,
    savings: 67,
    renewalDate: 'Aug 18, 2026',
    hostName: 'Ananya R.',
    Icon: Music,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
  },
  {
    id: 'gpt-1',
    title: 'ChatGPT Plus Team',
    price: 399,
    originalPrice: 1999,
    savings: 80,
    renewalDate: 'Aug 22, 2026',
    hostName: 'Rohan K.',
    Icon: Bot,
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
    border: 'rgba(20,184,166,0.3)',
  },
];

const RECENT_ACTIVITIES = [
  { text: 'Joined Netflix Premium 4K group', date: '2 days ago', icon: CheckCircle2, color: '#22c55e' },
  { text: 'Escrow payment ₹129 held securely', date: '2 days ago', icon: ShieldCheck, color: '#3b82f6' },
  { text: 'Host Vikram S. confirmed profile slot', date: '2 days ago', icon: Zap, color: '#a855f7' },
  { text: 'Renewed Spotify Family subscription', date: '5 days ago', icon: CheckCircle2, color: '#22c55e' },
];

function Dashboard() {
  const navigate = useNavigate();
  const [autoRenewMap, setAutoRenewMap] = useState({ 'nflx-1': true, 'sptf-1': true, 'gpt-1': true });

  const toggleAutoRenew = (id) => {
    setAutoRenewMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ color: '#f3f4f6' }}>
      {/* ─── Hero Welcome Header ─── */}
      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start" justifyContent="space-between" spacing={2} mb={3}>
          <Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 900, fontSize: { xs: '1.75rem', md: '2.2rem' }, color: '#f3f4f6', letterSpacing: '-0.03em' }}
            >
              Welcome back, Anirban! 👋
            </Typography>
            <Typography sx={{ color: '#9ca3af', fontSize: '0.95rem', mt: 0.5 }}>
              Here is your active subscription savings and group membership status today.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/app/host')}
              sx={{ borderRadius: '11px', textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' }}
            >
              Become a Host
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Plus size={16} />}
              onClick={() => navigate('/app/marketplace')}
              sx={{ borderRadius: '11px', textTransform: 'none', fontWeight: 700, fontSize: '0.85rem', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
            >
              Join New Group
            </Button>
          </Stack>
        </Stack>

        {/* ─── 4 Metric Overview Cards ─── */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
                  Monthly Savings
                </Typography>
                <Box sx={{ p: 1, borderRadius: '10px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <TrendingDown size={18} color="#22c55e" />
                </Box>
              </Stack>
              <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#22c55e', lineHeight: 1 }}>
                ₹1,240
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.8 }}>
                Saved 78% compared to retail prices
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
                  Active Memberships
                </Typography>
                <Box sx={{ p: 1, borderRadius: '10px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
                  <CreditCard size={18} color="#3b82f6" />
                </Box>
              </Stack>
              <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#f3f4f6', lineHeight: 1 }}>
                3 Groups
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.8 }}>
                Netflix, Spotify, ChatGPT Plus
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
                  Wallet Balance
                </Typography>
                <Box sx={{ p: 1, borderRadius: '10px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)' }}>
                  <Wallet size={18} color="#a855f7" />
                </Box>
              </Stack>
              <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#3b82f6', lineHeight: 1 }}>
                ₹1,250
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.8 }}>
                Secured for automatic renewals
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
                  Next Renewal
                </Typography>
                <Box sx={{ p: 1, borderRadius: '10px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <Clock size={18} color="#f59e0b" />
                </Box>
              </Stack>
              <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#f59e0b', lineHeight: 1 }}>
                In 5 Days
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.8 }}>
                Netflix Premium 4K (₹129)
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* ─── Grid Row 1: Active Memberships ─── */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.3rem', letterSpacing: '-0.02em' }}>
            Active Subscription Memberships
          </Typography>
          <Button
            size="small"
            endIcon={<ChevronRight size={16} />}
            onClick={() => navigate('/app/groups')}
            sx={{ textTransform: 'none', fontWeight: 700, color: '#3b82f6', fontSize: '0.85rem' }}
          >
            Manage All
          </Button>
        </Stack>

        <Grid container spacing={2.5}>
          {ACTIVE_MEMBERSHIPS.map(({ id, title, price, originalPrice, savings, renewalDate, hostName, Icon, color, bg, border }) => (
            <Grid item xs={12} md={4} key={id}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '20px',
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
                <Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '12px',
                          background: bg,
                          border: `1px solid ${border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={20} color={color} />
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                        {title}
                      </Typography>
                    </Stack>

                    <Chip
                      label={`-${savings}%`}
                      size="small"
                      sx={{
                        background: 'rgba(34,197,94,0.15)',
                        color: '#22c55e',
                        fontWeight: 800,
                        fontSize: '0.68rem',
                        height: 20,
                      }}
                    />
                  </Stack>

                  <Stack direction="row" alignItems="baseline" justifyContent="space-between" mb={2}>
                    <Box>
                      <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#3b82f6', lineHeight: 1 }}>
                        ₹{price}
                        <Typography component="span" sx={{ fontSize: '0.75rem', color: '#9ca3af', ml: 0.4 }}>
                          /mo
                        </Typography>
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#71717A', textDecoration: 'line-through' }}>
                        ₹{originalPrice}
                      </Typography>
                    </Box>

                    <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600 }}>
                      Renews: <Box component="span" sx={{ color: '#f3f4f6', fontWeight: 700 }}>{renewalDate}</Box>
                    </Typography>
                  </Stack>
                </Box>

                <Stack direction="row" alignItems="center" justifyContent="space-between" pt={1.5} sx={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>
                    Host: <Box component="span" sx={{ color: '#f3f4f6', fontWeight: 700 }}>{hostName}</Box>
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/app/marketplace/${id}`)}
                    sx={{
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      py: 0.4,
                      px: 1.5,
                      textTransform: 'none',
                    }}
                  >
                    Manage
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ─── Grid Row 2: Upcoming Renewals & Activity Timeline ─── */}
      <Grid container spacing={3} mb={4}>
        {/* Upcoming Renewals Timeline */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f3f4f6', fontSize: '1.1rem' }}>
                Upcoming Subscription Renewals
              </Typography>
              <Chip label="Auto-Pay Active" size="small" sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.68rem' }} />
            </Stack>

            <Stack spacing={2}>
              {ACTIVE_MEMBERSHIPS.map(({ id, title, price, renewalDate }) => (
                <Stack key={id} direction="row" alignItems="center" justifyContent="space-between" p={1.75} sx={{ borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Clock size={18} color="#f59e0b" />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                        {title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                        Due on {renewalDate}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', color: '#3b82f6' }}>
                      ₹{price}
                    </Typography>

                    <Switch
                      size="small"
                      checked={autoRenewMap[id] ?? true}
                      onChange={() => toggleAutoRenew(id)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#22c55e' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22c55e' },
                      }}
                    />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Activity Feed */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f3f4f6', fontSize: '1.1rem', mb: 2.5 }}>
              Recent Account Activity
            </Typography>

            <Stack spacing={2}>
              {RECENT_ACTIVITIES.map(({ text, date, icon: Icon, color }, idx) => (
                <Stack key={idx} direction="row" alignItems="flex-start" spacing={1.5}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '9px', background: `${color}15`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2 }}>
                    <Icon size={16} color={color} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#f3f4f6', lineHeight: 1.3 }}>
                      {text}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.3 }}>
                      {date}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
