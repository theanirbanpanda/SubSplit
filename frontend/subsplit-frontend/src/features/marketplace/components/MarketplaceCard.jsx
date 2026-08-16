import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VerifiedIcon from '@mui/icons-material/Verified';
import styles from './ListingTable.module.scss';

function MarketplaceCard({ listing }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.listingCard}
      onClick={() => navigate(`/app/marketplace/${listing.id}`)}
    >
      <div 
        className={styles.cardCover} 
        style={{ backgroundColor: listing.iconBg || 'rgba(37,99,235,0.12)', overflow: 'hidden' }}
      >
        {listing.logoUrl ? (
          <img
            src={listing.logoUrl}
            alt={listing.title}
            style={{ width: '50%', height: '50%', objectFit: 'contain', margin: 'auto', display: 'block', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'block'; }}
          />
        ) : null}
        <SubscriptionsIcon className={styles.coverIcon} style={{ color: listing.iconColor || '#2563eb', display: listing.logoUrl ? 'none' : 'block' }} />
        <div className={styles.categoryBadge}>{listing.category}</div>
        <div className={styles.seatsBadge}>{listing.seatsLeft} slots left</div>
      </div>
      
      <div className={styles.cardBody}>
        <h4 className={styles.listingTitle}>{listing.title}</h4>
        
        <div className={styles.hostRow}>
          <div className={styles.hostAvatar} style={{ backgroundColor: listing.host?.avatarBg || '#2563eb' }}>
            {listing.host?.initials || listing.hostName?.charAt(0) || 'VH'}
          </div>
          <span className={styles.hostName}>
            {listing.hostName || listing.host?.name} 
            {listing.isVerifiedHost && <VerifiedIcon className={styles.verifiedIcon} />}
          </span>
          {listing.savingsPercent > 0 && (
            <span className={styles.savingsBadge}>
              Save {listing.savingsPercent}%
            </span>
          )}
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.priceContainer}>
            <div className={styles.currentPrice}>
              ₹{listing.price}<span>/month</span>
            </div>
            {listing.originalPrice && listing.originalPrice > listing.price && (
              <div className={styles.originalPrice}>₹{listing.originalPrice}/month</div>
            )}
          </div>
          <button
            className={styles.addBtn}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/app/marketplace/${listing.id}`);
            }}
          >
            BUY
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarketplaceCard;

