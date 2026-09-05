import React from 'react';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

import styles from './SubscriptionCard.module.scss';

const SubscriptionCard = ({ listing, variant = 'large', isBlurred = false }) => {
  const navigate = useNavigate();

  const {
    id,
    title,
    category,
    price,
    originalPrice,
    savingsPercent,
    hostName,
    seatsLeft,
    totalSeats,
    isAiVerified,
    iconBg,
    iconColor,
    logoUrl,
    platform,
  } = listing;

  const filledSeats = (totalSeats || 4) - (seatsLeft || 1);
  const progressPercent = ((filledSeats) / (totalSeats || 4)) * 100;

  return (
    <div
      className={`${styles.card} ${styles[`variant-${variant}`]}`}
      onClick={() => { if (!isBlurred) navigate(`/app/marketplace/${id}`); }}
      style={{ cursor: isBlurred ? 'default' : 'pointer' }}
    >
      <div style={{ filter: isBlurred ? 'blur(6px)' : 'none', opacity: isBlurred ? 0.7 : 1, pointerEvents: isBlurred ? 'none' : 'auto', userSelect: isBlurred ? 'none' : 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {isAiVerified && variant === 'large' && (
        <div className={styles.aiVerifiedBadge}>
          <AutoAwesomeIcon /> AI Verified
        </div>
      )}

      <div className={`${styles.cardHeader} ${variant === 'small' ? styles.smallHeader : ''}`}>
        <div 
          className={`${styles.logoContainer} ${variant === 'small' ? styles.small : ''}`}
          style={{ backgroundColor: iconBg || 'rgba(37,99,235,0.12)' }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={platform || title}
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <SubscriptionsIcon
            className={styles.fallbackIcon}
            style={{ color: iconColor || '#2563eb', display: logoUrl ? 'none' : undefined }}
          />
        </div>
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>{title}</h3>
          {variant !== 'small' && <div className={styles.category}>{category}</div>}
        </div>
      </div>

      {variant === 'small' ? (
        <div className={`${styles.priceRow} ${styles.smallPriceRow}`}>
          <div className={styles.priceLeft}>
            <span className={styles.startsFromLabel}>Starts from</span>
            <span className={styles.currentPriceText}>₹{price}/mo</span>
          </div>
          {savingsPercent ? (
            <span className={styles.savingsBadge}>
              Save {savingsPercent}%
            </span>
          ) : null}
        </div>
      ) : (
        <div className={styles.priceRow}>
          <div className={styles.currentPrice}>
            ₹{price}<span className={styles.period}>/month</span>
          </div>
          {originalPrice && originalPrice > price && (
            <div className={styles.originalPrice}>₹{originalPrice}/month</div>
          )}
          {savingsPercent ? (
            <div className={styles.discount}>Save {savingsPercent}%</div>
          ) : null}
        </div>
      )}



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
        <button
          className={styles.joinBtn}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/app/marketplace/${id}`);
          }}
        >
          Buy
        </button>
      </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
