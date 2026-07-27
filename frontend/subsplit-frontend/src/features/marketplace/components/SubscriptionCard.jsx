import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

import styles from './SubscriptionCard.module.scss';

const SubscriptionCard = ({ listing, variant = 'large' }) => {
  const {
    title,
    category,
    price,
    originalPrice,
    savingsPercent,
    hostName,
    rating,
    seatsLeft,
    totalSeats,
    isAiVerified,
    iconBg,
    iconColor
  } = listing;

  const filledSeats = totalSeats - seatsLeft;
  const progressPercent = (filledSeats / totalSeats) * 100;

  return (
    <div className={`${styles.card} ${styles[`variant-${variant}`]}`}>
      {isAiVerified && variant === 'large' && (
        <div className={styles.aiVerifiedBadge}>
          <AutoAwesomeIcon /> AI Verified
        </div>
      )}

      <div 
        className={`${styles.logoContainer} ${variant === 'small' ? styles.small : ''}`}
        style={{ backgroundColor: iconBg }}
      >
        <SubscriptionsIcon className={styles.fallbackIcon} style={{ color: iconColor }} />
      </div>

      <h3 className={styles.title}>{title}</h3>
      <div className={styles.category}>{category}</div>

      <div className={styles.priceRow}>
        <div className={styles.currentPrice}>
          ₹{price}<span className={styles.period}>/month</span>
        </div>
        {originalPrice && (
          <div className={styles.originalPrice}>₹{originalPrice}</div>
        )}
        {savingsPercent && (
          <div className={styles.discount}>{savingsPercent}% OFF</div>
        )}
      </div>

      <div className={styles.divider}></div>

      <div className={styles.hostRow}>
        <span className={styles.hostLabel}>Host:</span>
        <span className={styles.hostName}>{hostName}</span>
        <div className={styles.rating}>
          <StarIcon /> {rating}
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.seatsInfo}>
          <span className={styles.seatsText}>{seatsLeft} seats left</span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
        <button className={styles.joinBtn}>Instant Join</button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
