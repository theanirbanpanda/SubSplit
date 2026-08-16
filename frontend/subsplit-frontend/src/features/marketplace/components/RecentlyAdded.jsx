import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VerifiedIcon from '@mui/icons-material/Verified';
import styles from './RecentlyAdded.module.scss';

const RecentlyAdded = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});
  const { listings = [], myJoinRequests = [] } = useSelector((state) => state.marketplace);
  const { subscriptions = [] } = useSelector((state) => state.subscriptions || {});

  const availableListings = listings.filter((listing) => {
    if (user?.id && (listing.hostId === user.id || listing.host?.id === user.id)) return false;
    const isJoinee = myJoinRequests.some(
      (req) => (req.listingId === listing.id || req.listing?.id === listing.id) &&
        req.status !== 'REJECTED' && req.status !== 'CANCELLED'
    );
    if (isJoinee) return false;
    const isSubscribed = subscriptions.some(
      (sub) => sub.listingId === listing.id || sub.listing?.id === listing.id
    );
    if (isSubscribed) return false;
    return true;
  });

  const recentListings = [...availableListings].reverse().slice(0, 5);


  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>Recently Added</h3>
        <span className={styles.viewAll}>View all</span>
      </div>
      <div className={styles.carousel}>
        {recentListings.map((listing) => (
          <div
            key={listing.id}
            className={styles.compactCard}
            onClick={() => navigate(`/app/marketplace/${listing.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.logoRow}>
              <div className={styles.logo} style={{ backgroundColor: listing.iconBg || 'rgba(37,99,235,0.12)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {listing.logoUrl ? (
                  <img
                    src={listing.logoUrl}
                    alt={listing.title}
                    style={{ width: '60%', height: '60%', objectFit: 'contain' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <SubscriptionsIcon style={{ color: listing.iconColor || '#2563eb', display: listing.logoUrl ? 'none' : undefined }} />
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
                  {listing.host?.initials || 'VH'}
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
