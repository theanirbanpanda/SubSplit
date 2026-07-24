import React from 'react';
import SubscriptionCard from './SubscriptionCard';
import { MOCK_LISTINGS } from '../data/mockListings';
import styles from './RecommendationSection.module.scss';

const RecommendationSection = () => {
  // Use first 3 listings for recommended
  const recommendedListings = MOCK_LISTINGS.slice(0, 3);

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>Recommended For You</h3>
        <span className={styles.viewAll}>View all</span>
      </div>
      <div className={styles.grid}>
        {recommendedListings.map(listing => (
          <SubscriptionCard key={listing.id} listing={listing} variant="large" />
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
