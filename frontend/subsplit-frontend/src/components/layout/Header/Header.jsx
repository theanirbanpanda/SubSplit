import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem 
} from '@mui/material';
import { Menu as MenuIcon, Bell } from 'lucide-react';
import { toggleSidebar } from '../../../features/ui/uiSlice';
import { logoutUser } from '../../../features/auth/authSlice';
import { ROUTES } from '../../../config/routes';
import styles from './Header.module.scss';

function Header({ handleDrawerToggle }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logoutUser());
    navigate(ROUTES.AUTH);
  };

  const handleToggle = () => {
    dispatch(toggleSidebar());
    if (handleDrawerToggle) {
      handleDrawerToggle();
    }
  };

  return (
    <AppBar position="fixed" elevation={0} className={styles.appbar}>
      <Toolbar className={styles.toolbar}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleToggle}
          sx={{ mr: 2, display: { lg: 'none' }, color: '#64748b' }}
        >
          <MenuIcon size={24} />
        </IconButton>
        
        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton sx={{ color: '#64748b' }}>
            <Bell size={20} />
          </IconButton>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            className={styles.avatarBtn}
          >
            <Avatar className={styles.avatar}>U</Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { handleClose(); navigate(ROUTES.PROFILE); }}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
