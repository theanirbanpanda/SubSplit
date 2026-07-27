import React from 'react';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VerifiedIcon from '@mui/icons-material/Verified';
import { MOCK_LISTINGS } from '../data/mockListings';
import styles from './RecentlyAdded.module.scss';

const RecentlyAdded = () => {
  // Use last 4 listings from mock data reversed to simulate "recent"
  const recentListings = [...MOCK_LISTINGS].reverse().slice(0, 5);

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>Recently Added</h3>
        <span className={styles.viewAll}>View all</span>
      </div>
      <div className={styles.carousel}>
        {recentListings.map(listing => (
          <div key={listing.id} className={styles.compactCard}>
            <div className={styles.logoRow}>
              <div className={styles.logo} style={{ backgroundColor: listing.iconBg }}>
                <SubscriptionsIcon style={{ color: listing.iconColor }} />
              </div>
            </div>
            
            <div className={styles.title}>{listing.title}</div>
            <div className={styles.category}>{listing.category}</div>
            
            <div className={styles.price}>
              ₹{listing.price}<span>/month</span>
            </div>

            <div className={styles.divider}></div>
            
            <div className={styles.hostRow}>
              <div className={styles.hostInfo}>
                <div className={styles.hostName}>
                  {listing.host.initials} 
                  {listing.isVerifiedHost && <VerifiedIcon />}
                </div>
                <div className={styles.seats}>{listing.seatsLeft} seats left</div>
              </div>
              <div className={styles.newBadge}>New</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyAdded;
