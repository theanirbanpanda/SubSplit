import React, { useState, useEffect } from 'react';
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
  CircularProgress,
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
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} from './notificationsSlice';

const FILTER_CHIPS = ['All', 'JOIN_REQUEST', 'PAYMENT', 'ESCROW', 'RENEWAL', 'SYSTEM'];

function NotificationsCenter() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: notifications, unreadCount, loading } = useSelector((state) => state.notifications);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  const getNotificationDestination = (item) => {
    if (!item) return '/app/dashboard';
    const type = item.notificationType?.toUpperCase() || '';
    const text = ((item.title || '') + ' ' + (item.message || '')).toLowerCase();

    if (text.includes('requested to join your group') || text.includes('new join request received')) {
      return '/app/host';
    }
    if (text.includes('published') || text.includes('listing')) {
      return '/app/host';
    }
    if (type === 'PAYMENT' || type === 'ESCROW' || text.includes('wallet') || text.includes('top-up') || text.includes('payout')) {
      return '/app/settlements';
    }
    if (text.includes('kyc') || text.includes('identity') || text.includes('verify')) {
      return '/app/profile';
    }
    if (type === 'JOIN_REQUEST' || text.includes('join request') || text.includes('approved') || text.includes('declined')) {
      return '/app/dashboard';
    }
    return '/app/dashboard';
  };

  const handleCardClick = (item) => {
    if (!item.isRead) {
      dispatch(markNotificationAsRead(item.id));
    }
    const target = getNotificationDestination(item);
    navigate(target);
  };

  const filteredNotifications = notifications.filter((item) => {
    if (selectedFilter === 'All') return true;
    return item.notificationType === selectedFilter;
  });


  const getIconForType = (type) => {
    switch (type) {
      case 'JOIN_REQUEST':
        return <Tv2 size={18} color="#3b82f6" />;
      case 'PAYMENT':
        return <Zap size={18} color="#22c55e" />;
      case 'ESCROW':
        return <ShieldCheck size={18} color="#f59e0b" />;
      case 'RENEWAL':
        return <RefreshCw size={18} color="#a855f7" />;
      default:
        return <Bell size={18} color="#3b82f6" />;
    }
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
                label={`${unreadCount} Unread`}
                size="small"
                sx={{ background: 'rgba(37,99,235,0.12)', color: '#3b82f6', fontWeight: 800, border: '1px solid rgba(37,99,235,0.3)' }}
              />
            </Stack>
            <Typography sx={{ color: '#9ca3af', fontSize: '0.95rem' }}>
              Stay informed on subscription renewals, host messages, wallet transactions, and escrow updates.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            {unreadCount > 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleMarkAllRead}
                startIcon={<CheckCheck size={16} />}
                sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '0.85rem', py: 1, px: 2, borderColor: '#22c55e', color: '#22c55e' }}
              >
                Mark All Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearAll}
                startIcon={<Trash2 size={16} />}
                sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '0.85rem', py: 1, px: 2, borderColor: '#ef4444', color: '#ef4444' }}
              >
                Clear All
              </Button>
            )}
          </Stack>
        </Stack>

        {/* ─── Summary Strip (Metric Cards) ─── */}
        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                Total Notifications
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#ffffff', mt: 0.5, lineHeight: 1 }}>
                {notifications.length} Items
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                Unread Activity
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#3b82f6', mt: 0.5, lineHeight: 1 }}>
                {unreadCount} Unread
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                Join Requests
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#f59e0b', mt: 0.5, lineHeight: 1 }}>
                {notifications.filter((n) => n.notificationType === 'JOIN_REQUEST').length} Requests
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                Wallet & Escrow
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#22c55e', mt: 0.5, lineHeight: 1 }}>
                {notifications.filter((n) => n.notificationType === 'PAYMENT' || n.notificationType === 'ESCROW').length} Updates
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* ─── Category Filters Bar ─── */}
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

      {/* ─── Notification List Section ─── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', mb: 2.5, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          Activity Log ({filteredNotifications.length})
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#22c55e' }} />
          </Box>
        ) : filteredNotifications.length > 0 ? (
          <Stack spacing={2}>
            {filteredNotifications.map((item) => (
              <Paper
                key={item.id}
                elevation={0}
                onClick={() => handleCardClick(item)}
                sx={{
                  p: 2.5,
                  borderRadius: '18px',
                  background: item.isRead ? '#14161a' : 'rgba(37,99,235,0.06)',
                  border: item.isRead ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(37,99,235,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { transform: 'translateX(3px)', borderColor: '#3b82f6' },
                }}
              >
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getIconForType(item.notificationType)}
                    </Box>
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.98rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                          {item.title}
                        </Typography>
                        {!item.isRead && (
                          <Chip
                            label="NEW"
                            size="small"
                            sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.65rem', height: 18 }}
                          />
                        )}
                      </Stack>
                      <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af', mt: 0.3 }}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      label={item.notificationType || 'SYSTEM'}
                      size="small"
                      sx={{ background: 'rgba(255,255,255,0.08)', color: '#9ca3af', fontWeight: 800, fontSize: '0.68rem', height: 22 }}
                    />
                    {!item.isRead && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(item.id);
                        }}
                        sx={{ color: '#22c55e' }}
                      >
                        <Check size={16} />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      sx={{ color: '#9ca3af', '&:hover': { color: '#ef4444' } }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Stack>
                </Stack>


                <Typography sx={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.5, pl: { sm: 6.5 } }}>
                  {item.message}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Bell size={32} color="#9ca3af" style={{ marginBottom: 12 }} />
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', mb: 0.5 }}>
              No notifications found
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              When join requests, payments, or escrow activities occur, notifications will appear here.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default NotificationsCenter;
