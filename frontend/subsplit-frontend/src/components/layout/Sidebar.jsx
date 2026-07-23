import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from '@mui/material';
import {
  LayoutDashboard,
  Store,
  CreditCard,
  Wallet,
  Shield,
  Bell,
  User,
  HelpCircle,
  LogOut,
} from 'lucide-react';

const DRAWER_WIDTH = 240;

const MENU_ITEMS = [
  { text: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { text: 'Marketplace', icon: Store, path: '/app/marketplace' },
  { text: 'My Memberships', icon: CreditCard, path: '/app/groups' },
  { text: 'Wallet', icon: Wallet, path: '/app/settlements' },
  { text: 'Host Center', icon: Shield, path: '/app/host' },
  { text: 'Notifications', icon: Bell, path: '/app/notifications' },
  { text: 'Profile', icon: User, path: '/app/profile' },
];

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#14161a',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#f3f4f6',
      }}
    >
      {/* Brand Header Wordmark */}
      <Toolbar
        sx={{
          px: 2.5,
          py: 2,
          minHeight: '76px !important',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={() => navigate('/')}
      >
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: '1.35rem',
            color: '#f3f4f6',
            letterSpacing: '-0.04em',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Sub<Box component="span" sx={{ color: '#2563eb' }}>Split</Box>
        </Typography>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Main Nav Links */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {MENU_ITEMS.map(({ text, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <ListItem key={text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(path);
                  if (mobileOpen) handleDrawerToggle();
                }}
                sx={{
                  borderRadius: '12px',
                  py: 1,
                  px: 1.5,
                  background: isActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                  color: isActive ? '#3b82f6' : '#9ca3af',
                  borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    background: isActive ? 'rgba(37, 99, 235, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                    color: '#f3f4f6',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#3b82f6' : '#9ca3af' }}>
                  <Icon size={18} />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 800 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Bottom Actions */}
      <List sx={{ px: 1.5, py: 1.5, flexGrow: 0 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => navigate('/app/profile')}
            sx={{
              borderRadius: '12px',
              py: 0.9,
              color: '#9ca3af',
              '&:hover': { color: '#f3f4f6', background: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
              <HelpCircle size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Help & Support"
              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/auth')}
            sx={{
              borderRadius: '12px',
              py: 0.9,
              color: '#ef4444',
              '&:hover': { background: 'rgba(239, 68, 68, 0.1)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#ef4444' }}>
              <LogOut size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 700 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      aria-label="Application Sidebar Navigation"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
        PaperProps={{ sx: { width: DRAWER_WIDTH, background: '#14161a', border: 'none' } }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{ display: { xs: 'none', md: 'block' } }}
        PaperProps={{ sx: { width: DRAWER_WIDTH, background: '#14161a', border: 'none' } }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
