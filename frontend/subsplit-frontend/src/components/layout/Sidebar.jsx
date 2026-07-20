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
import {
  LayoutDashboard,
  Users,
  Receipt,
  DollarSign,
  User,
  LogOut
} from 'lucide-react';
import { closeSidebar } from '../../features/ui/uiSlice';
import styles from './layout.module.scss';

const drawerWidth = 240;

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { text: 'Groups', icon: <Users size={20} />, path: '/groups' },
    { text: 'Expenses', icon: <Receipt size={20} />, path: '/expenses' },
    { text: 'Settlements', icon: <DollarSign size={20} />, path: '/settlements' },
    { text: 'Profile', icon: <User size={20} />, path: '/profile' }
  ];

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
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding className={styles.navItem}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (mobileOpen) handleDrawerToggle();
                }}
                className={`${styles.navBtn} ${isActive ? styles.active : ''}`}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: '14px', fontWeight: isActive ? 600 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider className={styles.divider} />
      <List className={styles.navList} sx={{ flexGrow: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/auth')}
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
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
        PaperProps={{ className: styles.drawerPaper }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open={sidebarOpen}
        sx={{ display: { xs: 'none', md: 'block' } }}
        PaperProps={{ className: styles.drawerPaper }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
