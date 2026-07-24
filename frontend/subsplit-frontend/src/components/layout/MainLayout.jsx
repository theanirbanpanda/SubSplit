import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

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
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const sidebarWidth = sidebarCollapsed ? 80 : 240;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#09090b', color: '#f3f4f6' }}>
      <Header 
        handleDrawerToggle={handleDrawerToggle} 
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
          pt: 11,
          pb: 8,
          px: { xs: 2.5, md: 4 },
          width: { xs: '100%', md: `calc(100% - ${sidebarWidth}px)` },
          transition: 'width 0.2s ease, margin 0.2s ease',
          maxWidth: '1500px',
          mx: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
