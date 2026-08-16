import React from 'react';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

import styles from './SubscriptionCard.module.scss';

const SubscriptionCard = ({ listing, variant = 'large' }) => {
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
      onClick={() => navigate(`/app/marketplace/${id}`)}
      style={{ cursor: 'pointer' }}
    >
      {isAiVerified && variant === 'large' && (
        <div className={styles.aiVerifiedBadge}>
          <AutoAwesomeIcon /> AI Verified
        </div>
      )}

      <div 
        className={`${styles.logoContainer} ${variant === 'small' ? styles.small : ''}`}
        style={{ backgroundColor: iconBg || 'rgba(37,99,235,0.12)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={platform || title}
            style={{ width: '60%', height: '60%', objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <SubscriptionsIcon
          className={styles.fallbackIcon}
          style={{ color: iconColor || '#2563eb', display: logoUrl ? 'none' : undefined }}
        />
      </div>

      <h3 className={styles.title}>{title}</h3>
      <div className={styles.category}>{category}</div>

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

      <div className={styles.divider}></div>

      <div className={styles.hostRow}>
        <span className={styles.hostLabel}>Host:</span>
        <span className={styles.hostName}>{hostName}</span>
        {savingsPercent ? (
          <span style={{ marginLeft: 'auto', background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '2px 6px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 800 }}>
            Save {savingsPercent}%
          </span>
        ) : null}
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
        <button
          className={styles.joinBtn}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/app/marketplace/${id}`);
          }}
        >
          Instant Buy
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
