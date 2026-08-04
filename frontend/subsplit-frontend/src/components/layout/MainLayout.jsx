import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from '../../features/landing/components/Footer';

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const sidebarWidth = sidebarCollapsed ? 80 : 240;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#09090b', color: '#f3f4f6' }}>
      <Header 
        handleDrawerToggle={handleDrawerToggle} 
        toggleSidebar={toggleSidebar}
        sidebarWidth={sidebarWidth} 
      />
      <Sidebar 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        sidebarWidth={sidebarWidth}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pt: 11,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flexGrow: 1, px: { xs: 2.5, md: 4 }, pb: 8, maxWidth: '1500px', mx: 'auto', width: '100%' }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default MainLayout;
