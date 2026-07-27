import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
} from 'lucide-react';

const MENU_ITEMS = [
  { text: 'Marketplace', icon: Store, path: '/app/marketplace' },
  { text: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { text: 'My Subscriptions', icon: CreditCard, path: '/app/groups' },
  { text: 'Host Center', icon: Shield, path: '/app/host' },
  { text: 'Wallet', icon: Wallet, path: '/app/settlements' },
  { text: 'Messages', icon: MessageSquare, path: '/app/messages' },
  { text: 'Notifications', icon: Bell, path: '/app/notifications' },
  { text: 'Profile', icon: User, path: '/app/profile' },
];

function Sidebar({ mobileOpen, handleDrawerToggle, sidebarCollapsed, toggleSidebar, sidebarWidth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const handleLogoClick = useLogoClick();

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
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
          px: sidebarCollapsed ? 1 : 2.5,
          py: 2,
          minHeight: '76px !important',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          gap: sidebarCollapsed ? 1 : 0,
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
          {!sidebarCollapsed && (
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

        {/* Sidebar Toggle */}
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
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </IconButton>
      </Toolbar>

      {/* Main Nav Links */}
      <Box sx={{ overflowY: 'auto', flexGrow: 1, px: sidebarCollapsed ? 1 : 1.5, py: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
        <List disablePadding>
          {MENU_ITEMS.map(({ text, icon: Icon, path }) => {
            const isActive = location.pathname.startsWith(path);
            
            const buttonContent = (
              <ListItemButton
                onClick={() => {
                  navigate(path);
                  if (mobileOpen) {
                    handleDrawerToggle();
                  } else {
                    toggleSidebar();
                  }
                }}
                sx={{
                  borderRadius: '8px',
                  py: 1,
                  px: sidebarCollapsed ? 0 : 1.5,
                  mb: 0.5,
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  background: isActive ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                  color: isActive ? '#22c55e' : '#9ca3af',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    background: isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#22c55e' : '#f3f4f6',
                  },
                }}
                aria-label={text}
              >
                <ListItemIcon sx={{ 
                  minWidth: sidebarCollapsed ? 'auto' : 36, 
                  color: 'inherit',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} />
                </ListItemIcon>
                {!sidebarCollapsed && (
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
                {sidebarCollapsed ? (
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

      {/* Bottom Actions (Logout) */}
      <Box sx={{ px: sidebarCollapsed ? 1 : 2, py: 2, mt: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <ListItem disablePadding>
          <Tooltip title="Logout" placement="right" arrow disableHoverListener={!sidebarCollapsed}>
            <ListItemButton
              onClick={(e) => {
                e.preventDefault();
                dispatch(logout()); // Synchronously clear state and token
                dispatch(logoutUser()); // Attempt API logout in background
                window.location.href = '/'; // Hard reload to clear all React state
              }}
              sx={{
                borderRadius: '8px',
                py: 1,
                px: sidebarCollapsed ? 0 : 1.5,
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                color: '#ef4444',
                transition: 'all 0.15s ease',
                '&:hover': {
                  background: 'rgba(239, 68, 68, 0.1)',
                },
              }}
              aria-label="Logout"
            >
              <ListItemIcon sx={{ 
                minWidth: sidebarCollapsed ? 'auto' : 36, 
                color: 'inherit',
                justifyContent: 'center'
              }}>
                <LogOut size={18} /> 
              </ListItemIcon>
              {!sidebarCollapsed && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: sidebarWidth }, flexShrink: { md: 0 }, transition: 'width 0.2s ease' }}
      aria-label="Application Sidebar Navigation"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
        PaperProps={{ sx: { width: 240, background: 'transparent', border: 'none' } }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{ display: { xs: 'none', md: 'block' } }}
        PaperProps={{ 
          sx: { 
            width: sidebarWidth, 
            background: 'transparent', 
            border: 'none',
            transition: 'width 0.2s ease'
          } 
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
