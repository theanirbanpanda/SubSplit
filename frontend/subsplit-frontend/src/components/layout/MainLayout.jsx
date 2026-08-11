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
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', maxHeight: '100vh', overflow: 'hidden', background: '#09090b', color: '#f3f4f6' }}>
      {/* 1. Left Column: Sidebar (Nav) */}
      <Sidebar 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        sidebarWidth={sidebarWidth}
      />

      {/* 2. Right Column: Header at top + Main content below (Pure Flex Flow) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0, height: '100%', overflow: 'hidden' }}>
        <Header 
          handleDrawerToggle={handleDrawerToggle} 
          toggleSidebar={toggleSidebar}
          sidebarWidth={sidebarWidth} 
        />

        {/* Scrollable Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2.5, md: 3.5 }, maxWidth: '1500px', mx: 'auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
