import React from 'react';
import { Box, Grid } from '@mui/material';
import { Layers, Wallet, Clock, CreditCard } from 'lucide-react';
import DashboardHero from './components/DashboardHero';
import StatCard from './components/StatCard';
import SubscriptionCarousel from './components/SubscriptionCarousel';
import RenewalList from './components/RenewalList';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import ProtectionBanner from '../marketplace/components/ProtectionBanner';

function Dashboard() {
  return (
    <Box sx={{ color: '#f3f4f6', pb: 4 }}>
      {/* ─── Hero Section ─── */}
      <Box sx={{ mb: 3 }}>
        <DashboardHero />
      </Box>

      {/* ─── 4 Metric Stat Cards ─── */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active Subscriptions" 
            value="8" 
            icon={Layers} 
            colorClass="green" 
            linkTo="/app/groups" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Monthly Savings" 
            value="₹1,240" 
            icon={Wallet} 
            colorClass="purple" 
            linkTo="/app/expenses" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Upcoming Renewals" 
            value="3" 
            icon={Clock} 
            colorClass="yellow" 
            linkTo="/app/notifications" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Wallet Balance" 
            value="₹560" 
            icon={CreditCard} 
            colorClass="blue" 
            linkTo="/app/settlements" 
          />
        </Grid>
      </Grid>

      {/* ─── Subscription Carousel ─── */}
      <Box sx={{ mb: 4 }}>
        <SubscriptionCarousel />
      </Box>

      {/* ─── Lower Grid (Renewals, Activity, Quick Actions) ─── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left Column - Renewals */}
        <Grid item xs={12} md={4}>
          <RenewalList />
        </Grid>

        {/* Middle Column - Activity */}
        <Grid item xs={12} md={4}>
          <ActivityFeed />
        </Grid>

        {/* Right Column - Quick Actions */}
        <Grid item xs={12} md={4}>
          <QuickActions />
        </Grid>
      </Grid>

      {/* ─── Protection Banner ─── */}
      <ProtectionBanner />
    </Box>
  );
}

export default Dashboard;
