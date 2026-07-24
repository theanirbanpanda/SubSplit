import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useLogoClick from '../../hooks/useLogoClick';
import { logoutUser } from '../../features/auth/authSlice';
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
} from 'lucide-react';

const MENU_ITEMS = [
  { text: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { text: 'Marketplace', icon: Store, path: '/app/marketplace' },
  { text: 'My Subscriptions', icon: CreditCard, path: '/app/groups' },
  { text: 'Host Center', icon: Shield, path: '/app/host' },
  { text: 'Wallet', icon: Wallet, path: '/app/settlements' },
  { text: 'Transactions', icon: ArrowRightLeft, path: '/app/expenses' },
  { text: 'Messages', icon: MessageSquare, path: '/app/messages' },
  { text: 'Notifications', icon: Bell, path: '/app/notifications' },
  { text: 'Profile', icon: User, path: '/app/profile' },
  { text: 'Settings', icon: Settings, path: '/app/settings' },
];

function Sidebar({ mobileOpen, handleDrawerToggle, sidebarCollapsed, toggleSidebar, sidebarWidth }) {
  const navigate = useNavigate();
  const location = useLocation();
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
          px: sidebarCollapsed ? 2 : 2.5,
          py: 2,
          minHeight: '76px !important',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
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
            color: '#09090b'
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
                  if (mobileOpen) handleDrawerToggle();
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

      {/* Bottom Actions (Collapse & Theme) */}
      <Box sx={{ px: sidebarCollapsed ? 1 : 2, py: 2, mt: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        
        {/* Dark Mode Toggle (Decorative/Static for now as requested) */}
        {!sidebarCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#9ca3af' }}>
              <Moon size={18} />
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Dark mode</Typography>
            </Box>
            <Switch 
              checked={true}
              disabled
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#22c55e' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22c55e' },
              }}
            />
          </Box>
        )}

        {/* Collapse Button */}
        <Box sx={{ display: 'flex', justifyContent: sidebarCollapsed ? 'center' : 'flex-end' }}>
          <IconButton 
            onClick={toggleSidebar}
            sx={{ 
              color: '#9ca3af',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              '&:hover': { background: 'rgba(255,255,255,0.08)' }
            }}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </IconButton>
        </Box>
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
