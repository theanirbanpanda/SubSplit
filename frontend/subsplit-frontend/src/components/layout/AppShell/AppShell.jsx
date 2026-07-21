import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from '../Header';
import Sidebar from '../Sidebar';
import styles from './AppShell.module.scss';

const AppShell = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box className={styles.wrapper}>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box component="main" className={styles.mainContent}>
        {children}
      </Box>
    </Box>
  );
};

export default AppShell;
