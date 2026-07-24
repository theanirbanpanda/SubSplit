import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Stack,
  Badge,
  Typography,
} from '@mui/material';
import { Menu as MenuIcon, Bell, Search, Wallet, ChevronDown } from 'lucide-react';

function Header({ handleDrawerToggle, sidebarWidth }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchVal, setSearchVal] = useState('');

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    dispatch(logoutUser());
    navigate('/auth');
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      navigate('/app/marketplace');
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        background: 'rgba(9, 9, 11, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#f3f4f6',
        transition: 'width 0.2s ease, margin 0.2s ease',
      }}
    >
      <Toolbar sx={{ height: 76, px: { xs: 2, md: 4 }, gap: 2 }}>
        {/* Mobile Hamburger */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' }, color: '#9ca3af' }}
        >
          <MenuIcon size={22} />
        </IconButton>

        {/* Global Search Input */}
        <Box sx={{ flexGrow: 1, maxWidth: 420 }}>
          <TextField
            fullWidth
            size="small"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
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
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#22c55e', lineHeight: 1, mt: 0.2 }}>₹560.00</Typography>
            </Box>
          </Button>

          {/* Notifications */}
          <IconButton
            onClick={() => navigate('/app/notifications')}
            sx={{ color: '#9ca3af', '&:hover': { color: '#f3f4f6', background: 'rgba(255, 255, 255, 0.05)' } }}
          >
            <Badge badgeContent={2} sx={{ '& .MuiBadge-badge': { backgroundColor: '#22c55e', color: '#fff', fontWeight: 'bold' } }}>
              <Bell size={20} />
            </Badge>
          </IconButton>

          {/* Avatar Menu */}
          <Button 
            onClick={handleMenu} 
            sx={{ 
              p: 0, 
              minWidth: 'auto', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              color: '#9ca3af',
              '&:hover': { color: '#f3f4f6' }
            }}
          >
            <Avatar
              src="https://i.pravatar.cc/150?img=11" // mock avatar matching image
              sx={{
                width: 36,
                height: 36,
                border: '2px solid transparent',
              }}
            >
              AN
            </Avatar>
            <ChevronDown size={16} />
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                background: '#111114',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#f3f4f6',
                borderRadius: '12px',
                minWidth: 160,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/app/profile'); }} sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/app/settings'); }} sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Settings
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/app/settlements'); }} sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Wallet
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#ef4444' }}>
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
