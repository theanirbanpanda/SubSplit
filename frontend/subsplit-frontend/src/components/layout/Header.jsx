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
import { Menu as MenuIcon, Bell, Search, Wallet, User as UserIcon, CheckCheck, ArrowRight, ShieldCheck, Zap, MessageSquare, LogOut, Star, X } from 'lucide-react';
import { logoutUser, logout } from '../../features/auth/authSlice';
import { setFilter } from '../../features/marketplace/marketplaceSlice';

import { fetchMyWallet } from '../../features/settlements/walletSlice';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../features/notifications/notificationsSlice';
import { fetchUnreadMessageCount } from '../../features/messages/messageSlice';

function Header({ handleDrawerToggle, toggleSidebar, sidebarWidth }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user, kycStatus } = useSelector((state) => state.auth);
  const { wallet } = useSelector((state) => state.wallet);
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
  const { unreadCount: msgUnreadCount = 0 } = useSelector((state) => state.messages || {});
  
  const isKycVerified = Boolean(user?.emailVerified) || kycStatus?.isKycVerified || kycStatus?.kycStatus === 'VERIFIED';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchVal, setSearchVal] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(fetchMyWallet());
    dispatch(fetchNotifications());
    dispatch(fetchUnreadMessageCount());

    const notifInterval = setInterval(() => {
      dispatch(fetchNotifications());
      dispatch(fetchUnreadMessageCount());
    }, 4000);

    return () => clearInterval(notifInterval);
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

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleProfileNavigate = (path) => {
    handleProfileClose();
    navigate(path);
  };

  const handleLogout = (e) => {
    e?.preventDefault?.();
    handleProfileClose();
    dispatch(logout());
    dispatch(logoutUser());
    navigate('/auth', { replace: true, state: { mode: 'login' } });
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : (user?.name || user?.email?.split('@')[0] || 'SubSplit User');


  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        width: '100%',
        flexShrink: 0,
        background: '#09090b',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#f3f4f6',
        zIndex: 10,
      }}
    >
      <Toolbar
        sx={{
          height: 76,
          px: { xs: 2, sm: 2.5, md: 4 },
          display: 'grid',
          gridTemplateColumns: mobileSearchOpen 
            ? '1fr' 
            : { xs: 'auto 1fr auto', md: '1fr auto 1fr' },
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
          width: '100%',
        }}
      >
        {mobileSearchOpen ? (
          /* Mobile Search Bar Mode (Full Width on Phone) */
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
            <TextField
              fullWidth
              autoFocus
              size="small"
              value={searchVal}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(e);
                  setMobileSearchOpen(false);
                }
              }}
              placeholder="Search subscriptions..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#22c55e" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '10px',
                  background: '#111114',
                  color: '#f3f4f6',
                  fontSize: '0.88rem',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  '& fieldset': { border: 'none' },
                },
              }}
            />
            <IconButton
              onClick={() => setMobileSearchOpen(false)}
              sx={{ color: '#9ca3af', '&:hover': { color: '#f3f4f6' }, p: 1 }}
              aria-label="Close search"
            >
              <X size={20} />
            </IconButton>
          </Box>
        ) : (
          <>
            {/* Column 1 (Left): Mobile Drawer Button / Left Area */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifySelf: 'start' }}>
              <IconButton
                color="inherit"
                aria-label="open navigation drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' }, color: '#9ca3af', '&:hover': { color: '#f3f4f6' } }}
              >
                <MenuIcon size={22} />
              </IconButton>
            </Box>

            {/* Column 2 (Center): Global Search Input (Permanently Centered, No Overlap) */}
            <Box sx={{ 
              display: { xs: 'none', sm: 'flex' },
              justifyContent: 'center',
              width: '100%',
              maxWidth: 420,
              mx: 'auto',
              justifySelf: 'center',
            }}>
              <TextField
                fullWidth
                size="small"
                value={searchVal}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
                placeholder="Search subscriptions..."
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

            {/* Column 3 (Right): Actions Stack (Right Aligned via Grid) */}
            <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }} sx={{ justifySelf: 'end' }}>
              {/* Mobile Search Icon Button (Visible on phone/xs) */}
              <IconButton
                onClick={() => setMobileSearchOpen(true)}
                sx={{ display: { xs: 'flex', sm: 'none' }, color: '#9ca3af', '&:hover': { color: '#f3f4f6', background: 'rgba(255, 255, 255, 0.05)' } }}
                aria-label="Open search"
              >
                <Search size={20} />
              </IconButton>

              {/* Wallet Navigation */}
              {isKycVerified && (
                <Button
                  onClick={() => navigate('/app/settlements')}
                  variant="outlined"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    gap: 1.5,
                    border: '1px solid #27272a',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '8px',
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
              )}


              {/* Messages Navigation */}
              <IconButton
                onClick={() => navigate('/app/messages')}
                sx={{ color: '#9ca3af', '&:hover': { color: '#f3f4f6', background: 'rgba(255, 255, 255, 0.05)' } }}
              >
                <Badge badgeContent={msgUnreadCount} sx={{ '& .MuiBadge-badge': { backgroundColor: '#3b82f6', color: '#fff', fontWeight: 'bold' } }}>
                  <MessageSquare size={20} />
                </Badge>
              </IconButton>

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

          {/* User Profile Avatar Button */}
          <IconButton
            onClick={handleProfileClick}
            sx={{
              p: 0.5,
              border: Boolean(profileAnchorEl) ? '2px solid #2563eb' : '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              '&:hover': { borderColor: '#2563eb', transform: 'scale(1.05)' }
            }}
            aria-label="User profile menu"
          >
            <Avatar
              src={user?.profileImage || ''}
              alt={user?.firstName || 'User'}
              sx={{ width: 36, height: 36, bgcolor: '#2563eb', fontWeight: 800, fontSize: '0.85rem' }}
            >
              {initials}
            </Avatar>
          </IconButton>

          {/* User Profile Dropdown Modal */}
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileClose}
            PaperProps={{
              sx: {
                width: 300,
                mt: 1.5,
                borderRadius: '18px',
                background: '#111114',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
                overflow: 'hidden',
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* User Details Header */}
            <Box sx={{ p: 2.2, pb: 1.8, display: 'flex', alignItems: 'center', gap: 1.75, background: 'linear-gradient(180deg, rgba(37,99,235,0.08) 0%, transparent 100%)' }}>
              <Avatar
                src={user?.profileImage || ''}
                alt={user?.firstName || 'User'}
                sx={{
                  width: 46,
                  height: 46,
                  bgcolor: '#2563eb',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  border: '2px solid #3b82f6',
                  boxShadow: '0 0 16px rgba(59,130,246,0.35)',
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayName}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', mb: 0.5 }}>
                  {user?.email || 'user@subsplit.in'}
                </Typography>
                <Chip
                  icon={<ShieldCheck size={12} color="#22c55e" />}
                  label={user?.role === 'ADMIN' ? 'Admin' : (isKycVerified ? 'KYC Verified' : 'Standard Member')}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    background: 'rgba(34,197,94,0.12)',
                    color: '#22c55e',
                    border: '1px solid rgba(34,197,94,0.25)',
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            {/* Menu Items */}
            <MenuItem
              onClick={() => handleProfileNavigate('/app/profile')}
              sx={{
                py: 1.25,
                px: 2,
                gap: 1.5,
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#f3f4f6',
                '&:hover': { background: 'rgba(255, 255, 255, 0.05)', color: '#60a5fa' },
              }}
            >
              <UserIcon size={16} color="#9ca3af" />
              <span>My Profile</span>
            </MenuItem>

            <MenuItem
              onClick={() => handleProfileNavigate('/app/profile/reviews')}
              sx={{
                py: 1.25,
                px: 2,
                gap: 1.5,
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#f3f4f6',
                '&:hover': { background: 'rgba(255, 255, 255, 0.05)', color: '#60a5fa' },
              }}
            >
              <Star size={16} color="#9ca3af" />
              <span>My Reviews</span>
            </MenuItem>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            {/* Logout Item */}
            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.25,
                px: 2,
                gap: 1.5,
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#f87171',
                '&:hover': { background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' },
              }}
            >
              <LogOut size={16} color="#ef4444" />
              <span>Log Out</span>
            </MenuItem>
          </Menu>
        </Stack>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;

