import React from 'react';
import { Outlet } from 'react-router-dom';
import AppShell from '../AppShell';

const AppLayout = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export default AppLayout;
