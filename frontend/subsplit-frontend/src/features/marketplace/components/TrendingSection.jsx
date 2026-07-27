import React from 'react';
import SubscriptionCard from './SubscriptionCard';
import { MOCK_LISTINGS } from '../data/mockListings';
import styles from './TrendingSection.module.scss';

const TrendingSection = () => {
  // Use listings 4 to 8 for trending
  const trendingListings = MOCK_LISTINGS.slice(4, 8);

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>
          <span className={styles.fireIcon}>🔥</span> Trending Today
        </h3>
        <span className={styles.viewAll}>View all</span>
      </div>
      <div className={styles.grid}>
        {trendingListings.map(listing => (
          <SubscriptionCard key={listing.id} listing={listing} variant="small" />
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
