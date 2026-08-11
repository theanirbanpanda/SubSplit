import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import useLogoClick from '../../hooks/useLogoClick';
import { logoutUser, logout } from '../../features/auth/authSlice';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Switch,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LayoutDashboard,
  Store,
  CreditCard,
  Shield,
  Wallet,
  ArrowRightLeft,
  MessageSquare,
  Bell,
  User,
  Settings,
  Moon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react';

const MENU_ITEMS = [
  { text: 'Marketplace', icon: Store, path: '/app/marketplace' },
  { text: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { text: 'Host Center', icon: Shield, path: '/app/host' },
  { text: 'Wallet', icon: Wallet, path: '/app/settlements' },
  { text: 'Messages', icon: MessageSquare, path: '/app/messages' },
  { text: 'Notifications', icon: Bell, path: '/app/notifications' },
  { text: 'Control Center', icon: Settings, path: '/app/admin', adminOnly: true, highlight: true },
];


function Sidebar({ mobileOpen, handleDrawerToggle, sidebarCollapsed, toggleSidebar, sidebarWidth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const handleLogoClick = useLogoClick();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // On mobile devices, the temporary drawer must always be expanded with full option names and titles
  const isEffectiveCollapsed = isMobile ? false : sidebarCollapsed;

  const { user } = useSelector((state) => state.auth || {});
  const isAdmin =
    user?.role === 'ADMIN' ||
    user?.role === 'ROLE_ADMIN' ||
    user?.role?.name === 'ADMIN' ||
    user?.role?.name === 'ROLE_ADMIN' ||
    user?.isAdmin === true;


  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#09090b',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#f3f4f6',
        overflowX: 'hidden',
        transition: 'width 0.2s ease',
      }}
    >
      {/* Brand Header */}
      <Toolbar
        sx={{
          px: isEffectiveCollapsed ? 1 : 2.5,
          py: 2,
          minHeight: '76px !important',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: isEffectiveCollapsed ? 'center' : 'space-between',
          gap: isEffectiveCollapsed ? 1 : 0,
        }}
      >
        <Box 
          onClick={handleLogoClick}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            gap: 1
          }}
        >
          <Box sx={{ 
            width: 28, 
            height: 28, 
            background: '#22c55e', 
            borderRadius: '6px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#09090b',
            flexShrink: 0
          }}>
            <Shield size={16} fill="currentColor" />
          </Box>
          {!isEffectiveCollapsed && (
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: '1.35rem',
                color: '#f3f4f6',
                letterSpacing: '-0.04em',
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Sub<Box component="span" sx={{ color: '#22c55e' }}>Split</Box>
            </Typography>
          )}
        </Box>

        {/* Sidebar Toggle / Mobile Close Button */}
        <IconButton
          onClick={() => {
            if (mobileOpen) {
              handleDrawerToggle();
            } else {
              toggleSidebar();
            }
          }}
          sx={{
            color: '#9ca3af',
            background: 'transparent',
            borderRadius: '6px',
            p: '4px',
            '&:hover': { background: 'rgba(255,255,255,0.06)', color: '#f3f4f6' },
          }}
          aria-label={isMobile ? 'Close navigation drawer' : (isEffectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
        >
          {isMobile ? <X size={20} /> : (isEffectiveCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />)}
        </IconButton>
      </Toolbar>

      {/* Main Nav Links */}
      <Box sx={{ overflowY: 'auto', flexGrow: 1, px: isEffectiveCollapsed ? 1 : 1.5, py: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
        <List disablePadding>
          {MENU_ITEMS.map(({ text, icon: Icon, path, adminOnly, highlight }) => {
            if (adminOnly && !isAdmin) return null;
            const isActive = location.pathname.startsWith(path);

            const getBackground = () => {
              if (highlight) {
                return isActive ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.08)';
              }
              return isActive ? 'rgba(34, 197, 94, 0.1)' : 'transparent';
            };

            const getColor = () => {
              if (highlight) {
                return isActive ? '#fbbf24' : '#f59e0b';
              }
              return isActive ? '#22c55e' : '#9ca3af';
            };

            const buttonContent = (
              <ListItemButton
                onClick={() => {
                  navigate(path);
                  if (mobileOpen) {
                    handleDrawerToggle();
                  } else if (isActive) {
                    toggleSidebar();
                  }
                }}
                sx={{
                  borderRadius: '8px',
                  py: 1,
                  px: isEffectiveCollapsed ? 0 : 1.5,
                  mb: 0.5,
                  justifyContent: isEffectiveCollapsed ? 'center' : 'flex-start',
                  background: getBackground(),
                  color: getColor(),
                  border: highlight ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    background: highlight ? 'rgba(245, 158, 11, 0.28)' : isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: highlight ? '#fbbf24' : isActive ? '#22c55e' : '#f3f4f6',
                  },
                }}
                aria-label={text}
              >

                <ListItemIcon sx={{ 
                  minWidth: isEffectiveCollapsed ? 'auto' : 36, 
                  color: 'inherit',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} />
                </ListItemIcon>
                {!isEffectiveCollapsed && (
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  />
                )}
              </ListItemButton>
            );

            return (
              <ListItem key={text} disablePadding>
                {isEffectiveCollapsed ? (
                  <Tooltip title={text} placement="right" arrow>
                    {buttonContent}
                  </Tooltip>
                ) : (
                  buttonContent
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer (Temporary overlay modal only on small screens) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            background: '#09090b',
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Navigation (Direct child inside flexbox, 100% contained inside parent) */}
      <Box
        component="nav"
        sx={{
          width: { xs: 0, md: sidebarWidth },
          display: { xs: 'none', md: 'block' },
          flexShrink: 0,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transition: 'width 0.2s ease',
        }}
        aria-label="Application Sidebar Navigation"
      >
        {drawerContent}
      </Box>
    </>
  );
}

export default Sidebar;
