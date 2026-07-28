import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box } from '@mui/material';
import { Leaf, Armchair } from 'lucide-react';
import styles from './DashboardHero.module.scss';

const DashboardHero = () => {
  const { user } = useSelector((state) => state.auth);
  const { summaryStats } = useSelector((state) => state.subscriptions);

  const displayName = user?.firstName || user?.fullName || 'User';
  const activeCount = summaryStats?.totalActiveSubscriptions ?? 3;
  const totalSavings = summaryStats?.totalSavings != null ? `₹${summaryStats.totalSavings}` : '₹1,240';
  const initials = displayName[0]?.toUpperCase() || 'U';

  return (
    <div className={styles.heroContainer}>
      <div className={styles.bgDecoration}></div>
      
      <div className={styles.textSection} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Avatar
          src={user?.profileImage || ''}
          alt={displayName}
          sx={{ width: 56, height: 56, bgcolor: '#2563eb', fontWeight: 900, fontSize: '1.2rem', border: '2px solid rgba(255,255,255,0.2)' }}
        >
          {initials}
        </Avatar>

        <div>
          <h1>Welcome back, {displayName} <span role="img" aria-label="wave">👋</span></h1>
          <p>You have <strong>{activeCount}</strong> active subscriptions</p>
          <p>You've saved <strong>{totalSavings}</strong> this month</p>
        </div>
      </div>


      <div className={styles.illustrationSection}>
        {/* Simple mock illustration using icons and shapes */}
        <div style={{ position: 'relative' }}>
          <Leaf size={48} style={{ position: 'absolute', bottom: 10, left: -20 }} />
          <div style={{ 
            width: 30, 
            height: 40, 
            border: '2px solid rgba(255,255,255,0.1)', 
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            position: 'absolute',
            bottom: 0,
            left: -10
          }}></div>
        </div>
        <Armchair size={80} color="rgba(255, 255, 255, 0.4)" strokeWidth={1} />
      </div>
    </div>
  );
};

export default DashboardHero;
