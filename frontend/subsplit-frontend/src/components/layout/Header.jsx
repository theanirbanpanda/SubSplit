import React, { useState } from 'react';
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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon, Bell, Search, Wallet } from 'lucide-react';
import { logoutUser } from '../../features/auth/authSlice'; // Ensure this is imported if used
import { setFilter } from '../../features/marketplace/marketplaceSlice';

function Header({ handleDrawerToggle, toggleSidebar, sidebarWidth }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchVal, setSearchVal] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase()
    : 'U';

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

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    dispatch(setFilter({ search: val, trendingOnly: false }));
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
      <Toolbar sx={{ height: 76, px: { xs: 2, md: 4 }, position: 'relative' }}>
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


        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
