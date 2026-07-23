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
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock,
  MessageSquare,
  ArrowRight,
  Send,
  Filter,
  Check,
  Sparkles,
  Zap,
  Tv2,
  Music,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ACTION_REQUIRED_ITEMS = [
  {
    id: 'act-1',
    priority: 'Urgent',
    priorityColor: '#ef4444',
    priorityBg: 'rgba(239,68,68,0.15)',
    title: 'Renew Netflix Premium 4K Membership',
    description: 'Your slot renewal of ₹129 is due in 5 days (Aug 15) to maintain continuous 4K streaming access.',
    time: 'Due Aug 15',
    primaryAction: 'Renew Now (₹129)',
    secondaryAction: 'Snooze 2 Days',
    Icon: Tv2,
    color: '#ef4444',
  },
  {
    id: 'act-2',
    priority: 'Action Required',
    priorityColor: '#f59e0b',
    priorityBg: 'rgba(245,158,11,0.15)',
    title: 'Host Vikram S. Sent Access Credentials',
    description: 'Please test your Netflix profile PIN and confirm active access to release escrow funds to host.',
    time: '10 mins ago',
    primaryAction: 'Confirm & Release Escrow',
    secondaryAction: 'Report Issue',
    Icon: ShieldCheck,
    color: '#3b82f6',
  },
];

const TIMELINE_DATA = [
  {
    group: 'Today',
    events: [
      {
        id: 'ev-1',
        title: 'Spotify Family Renewal Successful',
        description: 'Payment of ₹59 processed successfully via AutoPay. Locked in escrow for 24h.',
        time: '2 hours ago',
        status: 'Completed',
        statusColor: '#22c55e',
        Icon: Music,
        iconColor: '#22c55e',
      },
      {
        id: 'ev-2',
        title: 'Host Ananya R. sent a message',
        description: '"Hey Anirban! I updated the Spotify family profile PIN to 4819 for better security."',
        time: '4 hours ago',
        status: 'Unread Message',
        statusColor: '#3b82f6',
        isMessage: true,
        hostName: 'Ananya R.',
        hostInitials: 'AR',
        Icon: MessageSquare,
        iconColor: '#3b82f6',
      },
    ],
  },
  {
    group: 'Yesterday',
    events: [
      {
        id: 'ev-3',
        title: 'ChatGPT Plus Team Refund Processed',
        description: 'Refund of ₹399 credited back to your SubSplit Wallet balance.',
        time: 'Yesterday, 4:30 PM',
        status: 'Refunded',
        statusColor: '#14b8a6',
        Icon: RefreshCw,
        iconColor: '#14b8a6',
      },
    ],
  },
  {
    group: 'Earlier This Week',
    events: [
      {
        id: 'ev-4',
        title: 'Joined Netflix Premium 4K Group Pass',
        description: 'Joined slot #3 hosted by Vikram S. Escrow deposit ₹129 held securely.',
        time: '3 days ago',
        status: 'Pass Active',
        statusColor: '#22c55e',
        Icon: Tv2,
        iconColor: '#ef4444',
      },
    ],
  },
];

const FILTER_CHIPS = ['All', 'Action Required', 'Payments', 'Memberships', 'Messages', 'Security'];

function NotificationsCenter() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [replyTextMap, setReplyTextMap] = useState({});
  const [repliedMap, setRepliedMap] = useState({});

  const handleSendReply = (id) => {
    if (!replyTextMap[id]) return;
    setRepliedMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <Box sx={{ color: '#f3f4f6' }}>
      {/* ─── Header & Actions ─── */}
      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="flex-start" justifyContent="space-between" spacing={2.5} mb={3}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 900, fontSize: { xs: '1.75rem', md: '2.1rem' }, color: '#f3f4f6', letterSpacing: '-0.03em' }}
              >
                Notifications & Activity Center
              </Typography>
              <Chip
                icon={<Bell size={13} color="#2563eb" />}
                label="3 New Unread"
                size="small"
                sx={{ background: 'rgba(37,99,235,0.12)', color: '#3b82f6', fontWeight: 800, border: '1px solid rgba(37,99,235,0.3)' }}
              />
            </Stack>
            <Typography sx={{ color: '#9ca3af', fontSize: '0.95rem' }}>
              Stay informed on subscription renewals, host messages, and escrow status updates.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Check size={16} />}
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '0.85rem', py: 1, px: 2 }}
            >
              Mark All Read
            </Button>
          </Stack>
        </Stack>

        {/* ─── Summary Strip (4 Metric Summary Cards) ─── */}
        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                Unread Activity
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#3b82f6', mt: 0.5, lineHeight: 1 }}>
                3 Notifications
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                Action Required
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#ef4444', mt: 0.5, lineHeight: 1 }}>
                2 Urgent Items
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                Pending Payments
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#f59e0b', mt: 0.5, lineHeight: 1 }}>
                1 Renewal (₹129)
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                Host Messages
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#22c55e', mt: 0.5, lineHeight: 1 }}>
                1 Unread Msg
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* ─── Smart Category Filters Bar ─── */}
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {FILTER_CHIPS.map((chip) => {
            const isSelected = selectedFilter === chip;
            return (
              <Chip
                key={chip}
                label={chip}
                clickable
                onClick={() => setSelectedFilter(chip)}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  borderRadius: '10px',
                  px: 0.75,
                  background: isSelected ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#14161a',
                  color: isSelected ? '#ffffff' : '#9ca3af',
                  border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* ─── Zone 1: Action Required Section (Appears First!) ─── */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
          <AlertTriangle size={20} color="#ef4444" />
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            Action Required ({ACTION_REQUIRED_ITEMS.length})
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          {ACTION_REQUIRED_ITEMS.map(({ id, priority, priorityColor, priorityBg, title, description, time, primaryAction, secondaryAction, Icon, color }) => (
            <Grid item xs={12} md={6} key={id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  background: '#14161a',
                  border: `1px solid ${priorityColor}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                  <Chip label={priority} size="small" sx={{ background: priorityBg, color: priorityColor, fontWeight: 800, fontSize: '0.68rem', height: 20 }} />
                  <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af' }}>{time}</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={color} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                    {title}
                  </Typography>
                </Stack>

                <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af', mb: 2.5, lineHeight: 1.5 }}>
                  {description}
                </Typography>

                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<ArrowRight size={16} />}
                    onClick={() => navigate('/app/groups')}
                    sx={{ borderRadius: '10px', fontWeight: 800, fontSize: '0.82rem', py: 0.9, textTransform: 'none', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
                  >
                    {primaryAction}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: '10px', fontWeight: 600, fontSize: '0.82rem', py: 0.9, textTransform: 'none', color: '#9ca3af', borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    {secondaryAction}
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ─── Zone 2: Categorized Activity Timeline ─── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', mb: 2.5, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          Activity Timeline
        </Typography>

        <Stack spacing={3}>
          {TIMELINE_DATA.map(({ group, events }) => (
            <Box key={group}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', mb: 1.5, letterSpacing: '0.05em' }}>
                {group}
              </Typography>

              <Stack spacing={1.75}>
                {events.map(({ id, title, description, time, status, statusColor, isMessage, hostName, hostInitials, Icon, iconColor }) => (
                  <Paper
                    key={id}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: '18px',
                      background: '#14161a',
                      border: '1px solid rgba(255,255,255,0.08)',
                      transition: 'transform 0.15s ease',
                      '&:hover': { transform: 'translateX(3px)' },
                    }}
                  >
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: `${iconColor}15`, border: `1px solid ${iconColor}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={18} color={iconColor} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                            {title}
                          </Typography>
                          <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af', mt: 0.2 }}>
                            {time}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip label={status} size="small" sx={{ background: `${statusColor}15`, color: statusColor, fontWeight: 800, fontSize: '0.68rem', height: 20 }} />
                    </Stack>

                    <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5, pl: { sm: 6.5 }, mb: isMessage ? 2 : 0 }}>
                      {description}
                    </Typography>

                    {/* Inline Message Preview & Quick Reply */}
                    {isMessage && (
                      <Box sx={{ pl: { sm: 6.5 }, mt: 1.5 }}>
                        {repliedMap[id] ? (
                          <Typography sx={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700 }}>
                            ✓ Reply sent to host {hostName}!
                          </Typography>
                        ) : (
                          <Stack direction="row" spacing={1}>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder={`Reply to ${hostName}...`}
                              value={replyTextMap[id] || ''}
                              onChange={(e) => setReplyTextMap({ ...replyTextMap, [id]: e.target.value })}
                              InputProps={{
                                sx: { borderRadius: '10px', background: '#1c1e24', color: '#f3f4f6', fontSize: '0.82rem' },
                              }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleSendReply(id)}
                              endIcon={<Send size={14} />}
                              sx={{ borderRadius: '10px', fontWeight: 800, textTransform: 'none', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', whiteSpace: 'nowrap' }}
                            >
                              Reply
                            </Button>
                          </Stack>
                        )}
                      </Box>
                    )}
                  </Paper>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default NotificationsCenter;
