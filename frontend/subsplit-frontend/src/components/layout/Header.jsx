import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Stack,
  Badge,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon, Bell, Search, Wallet, User as UserIcon, CheckCheck, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { logoutUser } from '../../features/auth/authSlice'; // Ensure this is imported if used
import { setFilter } from '../../features/marketplace/marketplaceSlice';

import { fetchMyWallet } from '../../features/settlements/walletSlice';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../features/notifications/notificationsSlice';

function Header({ handleDrawerToggle, toggleSidebar, sidebarWidth }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const { wallet } = useSelector((state) => state.wallet);
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchVal, setSearchVal] = useState('');
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(fetchMyWallet());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const balanceDisplay = wallet?.balance != null ? `₹${wallet.balance.toFixed(2)}` : '₹0.00';

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase()
    : (user?.email ? user.email[0].toUpperCase() : 'U');

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      navigate('/app/marketplace');
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    dispatch(setFilter({ search: val, trendingOnly: false }));
  };

  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
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

  const handleNotifItemClick = (item) => {
    dispatch(markNotificationAsRead(item.id));
    handleNotifClose();
    const destination = getNotificationDestination(item);
    navigate(destination);
  };


  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        background: '#09090b',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#f3f4f6',
        transition: 'width 0.2s ease, margin 0.2s ease',
      }}
    >
      <Toolbar sx={{ height: 76, px: { xs: 2.5, md: 4 }, position: 'relative' }}>
        {/* Global Search Input */}
        <Box sx={{ 
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 420,
          zIndex: 10,
          display: { xs: 'none', sm: 'block' } // Hide on very small screens to prevent overlap
        }}>
          <TextField
            fullWidth
            size="small"
            value={searchVal}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            placeholder="Search subscriptions, hosts or categories..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#9ca3af" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '8px',
                background: '#111114',
                color: '#f3f4f6',
                fontSize: '0.85rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: '#22c55e' },
                '&.Mui-focused': { borderColor: '#22c55e' },
              },
            }}
          />
        </Box>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ ml: 'auto' }}>
          {/* Wallet Button */}
          <Button
            variant="outlined"
            onClick={() => navigate('/app/settlements')}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1.5,
              borderColor: 'rgba(34,197,94,0.3)',
              borderRadius: '8px',
              padding: '6px 12px',
              textTransform: 'none',
              background: '#111114',
              '&:hover': {
                borderColor: '#22c55e',
                background: 'rgba(34,197,94,0.05)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.15)', borderRadius: '6px', p: '4px' }}>
              <Wallet size={16} color="#22c55e" />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#9ca3af', lineHeight: 1 }}>Wallet balance</Typography>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#22c55e', lineHeight: 1, mt: 0.2 }}>{balanceDisplay}</Typography>
            </Box>
          </Button>


          {/* Notifications */}
          <IconButton
            onClick={handleNotifClick}
            sx={{ color: '#9ca3af', '&:hover': { color: '#f3f4f6', background: 'rgba(255, 255, 255, 0.05)' } }}
          >
            <Badge badgeContent={unreadCount} sx={{ '& .MuiBadge-badge': { backgroundColor: '#22c55e', color: '#fff', fontWeight: 'bold' } }}>
              <Bell size={20} />
            </Badge>
          </IconButton>

          {/* Notifications Dropdown Popover */}
          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={handleNotifClose}
            PaperProps={{
              sx: {
                width: 360,
                maxHeight: 440,
                mt: 1.5,
                borderRadius: '16px',
                background: '#111114',
                border: '1px solid #2A2A30',
                color: '#ffffff',
                boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                Notifications ({unreadCount} new)
              </Typography>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  onClick={handleMarkAllRead}
                  startIcon={<CheckCheck size={14} />}
                  sx={{ color: '#22c55e', fontSize: '0.75rem', textTransform: 'none', fontWeight: 700 }}
                >
                  Mark all read
                </Button>
              )}
            </Box>

            <Divider sx={{ borderColor: '#2A2A30' }} />

            {notifications && notifications.length > 0 ? (
              notifications.slice(0, 5).map((item) => (
                <MenuItem
                  key={item.id}
                  onClick={() => handleNotifItemClick(item)}

                  sx={{
                    py: 1.5,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 0.5,
                    background: item.isRead ? 'transparent' : 'rgba(37,99,235,0.08)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    '&:hover': { background: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} width="100%">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: item.isRead ? 'transparent' : '#22c55e',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: item.isRead ? 600 : 800, color: '#ffffff', flex: 1 }}>
                      {item.title}
                    </Typography>
                    <Chip
                      label={item.notificationType || 'SYSTEM'}
                      size="small"
                      sx={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        height: 18,
                        bgcolor: 'rgba(255,255,255,0.08)',
                        color: '#9ca3af',
                      }}
                    />
                  </Stack>
                  <Typography sx={{ fontSize: '0.76rem', color: '#9ca3af', pl: 2, lineHeight: 1.4 }}>
                    {item.message}
                  </Typography>
                </MenuItem>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', color: '#9ca3af' }}>
                <Typography sx={{ fontSize: '0.85rem' }}>No notifications yet</Typography>
              </Box>
            )}

            <Divider sx={{ borderColor: '#2A2A30' }} />

            <Box sx={{ p: 1.5, textAlign: 'center' }}>
              <Button
                fullWidth
                size="small"
                onClick={() => {
                  handleNotifClose();
                  navigate('/app/notifications');
                }}
                endIcon={<ArrowRight size={14} />}
                sx={{
                  color: '#3b82f6',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'none',
                }}
              >
                View Notifications Center
              </Button>
            </Box>
          </Menu>

          {/* User Profile Avatar */}
          <IconButton
            onClick={() => navigate('/app/profile')}
            sx={{ p: 0.5, border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', '&:hover': { borderColor: '#2563eb' } }}
          >
            <Avatar
              src={user?.profileImage || ''}
              alt={user?.firstName || 'User'}
              sx={{ width: 36, height: 36, bgcolor: '#2563eb', fontWeight: 800, fontSize: '0.85rem' }}
            >
              {initials}
            </Avatar>
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

