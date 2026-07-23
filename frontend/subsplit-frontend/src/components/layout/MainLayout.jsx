import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0d0e11', color: '#f3f4f6' }}>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 11,
          pb: 8,
          px: { xs: 2.5, md: 4 },
          width: { md: `calc(100% - 240px)` },
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
