import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VerifiedIcon from '@mui/icons-material/Verified';
import styles from './ListingTable.module.scss';

const ListingTable = () => {
  const navigate = useNavigate();
  const { listings, loading } = useSelector((state) => state.marketplace);

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>All Listings</h3>
      
      <div className={styles.filtersRow}>
        <button className={`${styles.filterBtn} ${styles.active}`}>
          <FilterListIcon /> All Filters
        </button>
        <button className={styles.filterBtn}>
          Category <KeyboardArrowDownIcon />
        </button>
        <button className={styles.filterBtn}>
          Price <KeyboardArrowDownIcon />
        </button>
        <button className={styles.filterBtn}>
          Join Type <KeyboardArrowDownIcon />
        </button>
        <button className={styles.filterBtn}>
          Status <KeyboardArrowDownIcon />
        </button>
        <button className={styles.filterBtn}>
          More <KeyboardArrowDownIcon />
        </button>
        
        <div className={styles.rightFilters}>
          <button className={styles.filterBtn} style={{ border: 'none', padding: 0 }}>
            Sort by: Recommended <KeyboardArrowDownIcon />
          </button>
        </div>
      </div>

      <div className={styles.listContainer}>
        {loading && listings.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
            Loading live marketplace listings...
          </div>
        ) : listings.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
            No listings found matching criteria.
          </div>
        ) : (
          listings.map((listing) => (
            <div
              key={listing.id}
              className={styles.listingRow}
              onClick={() => navigate(`/app/marketplace/${listing.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.subCol}>
                <div className={styles.logo} style={{ backgroundColor: listing.iconBg || 'rgba(37,99,235,0.12)' }}>
                  <SubscriptionsIcon style={{ color: listing.iconColor || '#2563eb' }} />
                </div>
                <div className={styles.subInfo}>
                  <span className={styles.subName}>{listing.title}</span>
                  <span className={styles.subCategory}>{listing.category}</span>
                </div>
              </div>

              <div className={styles.hostCol}>
                <div className={styles.hostAvatar} style={{ backgroundColor: listing.host?.avatarBg || '#2563eb' }}>
                  {listing.host?.initials || 'VH'}
                </div>
                <span className={styles.hostName}>
                  {listing.hostName || listing.host?.name} 
                  {listing.isVerifiedHost && <VerifiedIcon />}
                </span>
              </div>

              <div className={styles.statusCol}>
                {listing.seatsLeft} left
              </div>

              <div className={styles.priceCol}>
                <div className={styles.currentPrice}>
                  ₹{listing.price}<span>/month</span>
                </div>
                {listing.originalPrice && (
                  <div className={styles.originalPrice}>₹{listing.originalPrice}</div>
                )}
              </div>

              <button
                className={styles.joinBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/app/marketplace/${listing.id}`);
                }}
              >
                Join
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListingTable;
