import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
  ListItemText
} from '@mui/material';
import { LogOut } from 'lucide-react';
import { logoutUser } from '../../../features/auth/authSlice';
import { ROUTES } from '../../../config/routes';
import { NAVIGATION } from '../../../config/navigation';
import NavigationItem from '../NavigationItem';
import styles from './Sidebar.module.scss';

const drawerWidth = 240;

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate(ROUTES.AUTH);
  };

  const drawerContent = (
    <Box className={styles.drawerInner}>
      <Toolbar className={styles.logoContainer}>
        <Box className={styles.logo}>
          S
        </Box>
        <Typography variant="h6" className={styles.title}>
          SubSplit
        </Typography>
      </Toolbar>
      <Divider className={styles.divider} />
      <List className={styles.navList}>
        {NAVIGATION.map((item) => (
          <NavigationItem
            key={item.title}
            item={item}
            isActive={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              if (mobileOpen) handleDrawerToggle();
            }}
          />
        ))}
      </List>
      <Divider className={styles.divider} />
      <List className={styles.navList} sx={{ flexGrow: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <LogOut size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: '14px', fontWeight: 600 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile & Tablet Drawer (<1200px) */}
      <Drawer
        variant="temporary"
        open={mobileOpen || sidebarOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', lg: 'none' } }}
        PaperProps={{ className: styles.drawerPaper }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (>1200px) */}
      <Drawer
        variant="permanent"
        open
        sx={{ display: { xs: 'none', lg: 'block' } }}
        PaperProps={{ className: styles.drawerPaper }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
