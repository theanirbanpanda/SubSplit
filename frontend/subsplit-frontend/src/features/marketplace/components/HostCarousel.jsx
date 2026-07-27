import React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './HostCarousel.module.scss';
import { MOCK_LISTINGS } from '../data/mockListings';

const HostCarousel = () => {
  // Extract unique hosts from MOCK_LISTINGS for the carousel
  // The design has exactly 5 hosts
  const uniqueHosts = [];
  const map = new Map();
  for (const item of MOCK_LISTINGS) {
    if (!map.has(item.hostName)) {
      map.set(item.hostName, true);
      uniqueHosts.push({
        name: item.hostName,
        initials: item.host.initials,
        avatarBg: item.host.avatarBg,
        rating: item.host.rating,
        reviews: Math.floor(Math.random() * 1000) + 100, // mock reviews count
        orders: Math.floor(Math.random() * 400) + 100, // mock orders completed
        successRate: Math.floor(Math.random() * 5) + 95, // mock success rate
        activeListings: Math.floor(Math.random() * 10) + 5,
      });
    }
    if (uniqueHosts.length === 5) break;
  }

  // If we don't have 5, duplicate some to match the design length
  while(uniqueHosts.length < 5) {
      uniqueHosts.push({...uniqueHosts[0], name: uniqueHosts[0].name + ' (Copy)'});
  }

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>
          <VerifiedIcon className={styles.verifiedIcon} /> Top Verified Hosts
        </h3>
        <span className={styles.viewAll}>View all</span>
      </div>
      <div className={styles.carousel}>
        {uniqueHosts.map((host, index) => (
          <div key={index} className={styles.hostCard}>
            <div className={styles.avatarContainer} style={{ backgroundColor: host.avatarBg }}>
              {host.initials}
            </div>
            
            <div className={styles.hostName}>{host.name}</div>
            
            {host.rating > 4.8 && (
              <div className={styles.topHostBadge}>
                Top Host
              </div>
            )}
            
            <div className={styles.statsList}>
              <div className={styles.statItem}>
                ({host.reviews > 999 ? (host.reviews/1000).toFixed(1) + 'k' : host.reviews} reviews)
              </div>
              <div className={styles.statItem}>
                <CheckCircleIcon /> {host.orders} orders completed
              </div>
              <div className={styles.statItem}>
                <CheckCircleIcon /> {host.successRate}% success rate
              </div>
            </div>

            <div className={styles.footerStat}>
              {host.activeListings} active listings
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostCarousel;
