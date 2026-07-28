import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@mui/material';
import { Layers, Wallet, Clock, CreditCard } from 'lucide-react';
import { fetchSubscriptionSummary } from '../groups/subscriptionsSlice';
import DashboardHero from './components/DashboardHero';
import StatCard from './components/StatCard';
import SubscriptionCarousel from './components/SubscriptionCarousel';
import RenewalList from './components/RenewalList';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import ProtectionBanner from '../marketplace/components/ProtectionBanner';

function Dashboard() {
  const dispatch = useDispatch();
  const { summaryStats, subscriptions } = useSelector((state) => state.subscriptions);

  useEffect(() => {
    dispatch(fetchSubscriptionSummary());
  }, [dispatch]);

  const activeCount = summaryStats?.totalActiveSubscriptions ?? (subscriptions.length > 0 ? subscriptions.length : 3);
  const monthlySavings = summaryStats?.totalSavings != null ? `₹${summaryStats.totalSavings}` : '₹1,240';

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
            value={String(activeCount)} 
            icon={Layers} 
            colorClass="green" 
            linkTo="/app/groups" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Monthly Savings" 
            value={monthlySavings} 
            icon={Wallet} 
            colorClass="purple" 
            linkTo="/app/expenses" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Upcoming Renewals" 
            value={String(activeCount)} 
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
