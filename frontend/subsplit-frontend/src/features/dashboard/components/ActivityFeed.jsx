import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, User, RefreshCw, Wallet } from 'lucide-react';
import styles from './ActivityFeed.module.scss';

const MOCK_ACTIVITY = [
  { id: '1', title: 'Joined Canva Pro', date: 'Yesterday, 10:30 PM', Icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  { id: '2', title: 'Host delivered credentials for Netflix Premium', date: 'Yesterday, 6:45 PM', Icon: User, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
  { id: '3', title: 'Renewal successful for Spotify Premium', date: 'Yesterday, 9:15 AM', price: '₹59', priceColor: 'neutral', Icon: RefreshCw, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  { id: '4', title: 'Wallet credited', date: 'Referral bonus from Ankit • 20 Jul, 8:20 PM', price: '+₹100', priceColor: 'green', Icon: Wallet, color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
];

const ActivityFeed = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>Recent Activity</h3>
        <span className={styles.viewAll} onClick={() => navigate('/app/notifications')}>
          View all
        </span>
      </div>

      <div className={styles.list}>
        {MOCK_ACTIVITY.map(item => (
          <div key={item.id} className={styles.listItem}>
            <div className={styles.leftContent}>
              <div className={styles.iconWrapper} style={{ backgroundColor: item.bg, color: item.color }}>
                <item.Icon />
              </div>
              <div className={styles.textInfo}>
                <div className={styles.title}>
                  {item.title}
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
            {item.price && (
              <div className={`${styles.amount} ${item.priceColor === 'neutral' ? styles.neutral : ''}`}>
                {item.price}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
