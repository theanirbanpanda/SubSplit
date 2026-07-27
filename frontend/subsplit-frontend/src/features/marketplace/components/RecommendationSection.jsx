import React from 'react';
import { useSelector } from 'react-redux';
import SubscriptionCard from './SubscriptionCard';
import styles from './RecommendationSection.module.scss';

const RecommendationSection = () => {
  const { listings } = useSelector((state) => state.marketplace);
  const recommendedListings = listings.slice(0, 3);

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>Recommended For You</h3>
        <span className={styles.viewAll}>View all</span>
      </div>
      <div className={styles.grid}>
        {recommendedListings.map((listing) => (
          <SubscriptionCard key={listing.id} listing={listing} variant="large" />
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
