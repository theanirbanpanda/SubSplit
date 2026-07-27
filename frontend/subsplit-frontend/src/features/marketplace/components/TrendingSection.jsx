import React from 'react';
import { useSelector } from 'react-redux';
import SubscriptionCard from './SubscriptionCard';
import styles from './TrendingSection.module.scss';

const TrendingSection = () => {
  const { listings } = useSelector((state) => state.marketplace);
  const trendingListings = listings.slice(3, 7);

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>
          <span className={styles.fireIcon}>🔥</span> Trending Today
        </h3>
        <span className={styles.viewAll}>View all</span>
      </div>
      <div className={styles.grid}>
        {trendingListings.map((listing) => (
          <SubscriptionCard key={listing.id} listing={listing} variant="small" />
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
