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
  Chip,
  Stack,
} from '@mui/material';
import { Menu as MenuIcon, Bell, Search, Plus, Wallet } from 'lucide-react';

function Header({ handleDrawerToggle }) {
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
        width: { md: `calc(100% - 240px)` },
        ml: { md: `240px` },
        background: 'rgba(13, 14, 17, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#f3f4f6',
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
            placeholder="Search subscriptions, hosts, groups..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#9ca3af" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                background: '#14161a',
                color: '#f3f4f6',
                fontSize: '0.85rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: '#2563eb' },
                '&.Mui-focused': { borderColor: '#2563eb' },
              },
            }}
          />
        </Box>

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ ml: 'auto' }}>
          {/* Wallet Balance Chip */}
          <Chip
            icon={<Wallet size={14} color="#22c55e" />}
            label="₹1,250 Wallet"
            onClick={() => navigate('/app/settlements')}
            clickable
            sx={{
              background: '#14161a',
              color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.3)',
              fontWeight: 800,
              fontSize: '0.78rem',
              height: 34,
              borderRadius: '10px',
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          />

          {/* Quick Add / Browse Button */}
          <Button
            variant="contained"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={() => navigate('/app/marketplace')}
            sx={{
              fontWeight: 700,
              fontSize: '0.82rem',
              borderRadius: '10px',
              py: 0.7,
              px: 2,
              display: { xs: 'none', sm: 'inline-flex' },
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            }}
          >
            Browse
          </Button>

          {/* Notifications */}
          <IconButton
            onClick={() => navigate('/app/notifications')}
            sx={{ color: '#9ca3af', '&:hover': { color: '#f3f4f6', background: 'rgba(255, 255, 255, 0.05)' } }}
          >
            <Bell size={20} />
          </IconButton>

          {/* Avatar Menu */}
          <IconButton onClick={handleMenu} sx={{ p: 0.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#2563eb',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: '1.5px solid #3b82f6',
              }}
            >
              AP
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                background: '#14161a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#f3f4f6',
                borderRadius: '14px',
                minWidth: 160,
              },
            }}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/app/profile'); }} sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/app/settlements'); }} sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Wallet & Escrow
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
