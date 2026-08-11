import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';
import styles from './ActivityFeed.module.scss';

/**
 * ActivityFeed — Note: the MOCK_ACTIVITY array that previously lived here has
 * been removed. The full activity/notification feed already exists at
 * /app/notifications. This component now surfaces a single link to that page,
 * as directed by the restyle spec (instruction 5).
 */
const ActivityFeed = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>Recent Activity</h3>
      </div>

      <div className={styles.linkCard} onClick={() => navigate('/app/notifications')} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') navigate('/app/notifications'); }}>
        <div className={styles.linkIcon}>
          <Bell size={18} color="#a1a1aa" />
        </div>
        <span className={styles.linkText}>View all activity &amp; notifications</span>
        <ChevronRight size={16} color="#a1a1aa" />
      </div>
    </div>
  );
};

export default ActivityFeed;
