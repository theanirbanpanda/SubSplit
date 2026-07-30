import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VerifiedIcon from '@mui/icons-material/Verified';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { setFilter, resetFilters } from '../marketplaceSlice';
import styles from './ListingTable.module.scss';

const ListingTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const { listings, loading, filters, myJoinRequests = [] } = useSelector((state) => state.marketplace);
  const { subscriptions = [] } = useSelector((state) => state.subscriptions || {});
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [priceAnchorEl, setPriceAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handleCategoryClick = (event) => setCategoryAnchorEl(event.currentTarget);
  const handleCategoryClose = () => setCategoryAnchorEl(null);
  const handleCategorySelect = (category) => {
    dispatch(setFilter({ category, trendingOnly: false }));
    handleCategoryClose();
  };

  const handlePriceClick = (event) => setPriceAnchorEl(event.currentTarget);
  const handlePriceClose = () => setPriceAnchorEl(null);
  const handlePriceSelect = (priceRangeString) => {
    dispatch(setFilter({ priceRangeString, trendingOnly: false }));
    handlePriceClose();
  };

  const handleSortClick = (event) => setSortAnchorEl(event.currentTarget);
  const handleSortClose = () => setSortAnchorEl(null);
  const handleSortSelect = (sortBy) => {
    dispatch(setFilter({ sortBy }));
    handleSortClose();
  };

  const handleTrendingToggle = () => {
    if (!filters.trendingOnly) {
      dispatch(setFilter({ 
        trendingOnly: true, 
        category: 'All', 
        priceRangeString: 'All Prices', 
        search: '' 
      }));
    } else {
      dispatch(setFilter({ trendingOnly: false }));
    }
  };

  const filteredListings = listings.filter((listing) => {
    // Exclude if current user is host
    if (user?.id && (listing.hostId === user.id || listing.host?.id === user.id)) {
      return false;
    }

    // Exclude if current user is already a joinee with a pending/approved request
    const isJoinee = myJoinRequests.some(
      (req) => (req.listingId === listing.id || req.listing?.id === listing.id) &&
               req.status !== 'REJECTED' && req.status !== 'CANCELLED'
    );
    if (isJoinee) return false;

    // Exclude if current user is already an active subscriber/member
    const isSubscribed = subscriptions.some(
      (sub) => sub.listingId === listing.id || sub.listing?.id === listing.id
    );
    if (isSubscribed) return false;

    // Search Filter

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        listing.title?.toLowerCase().includes(searchLower) ||
        listing.category?.toLowerCase().includes(searchLower) ||
        listing.hostName?.toLowerCase().includes(searchLower) ||
        listing.host?.name?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category Filter
    if (filters.category && filters.category !== 'All') {
      if (listing.category !== filters.category) return false;
    }
    
    // Price Filter
    if (filters.priceRangeString && filters.priceRangeString !== 'All Prices') {
       if (filters.priceRangeString === 'Under ₹100' && listing.price >= 100) return false;
       if (filters.priceRangeString === '₹100 - ₹200' && (listing.price < 100 || listing.price > 200)) return false;
       if (filters.priceRangeString === 'Above ₹200' && listing.price <= 200) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'Price: Low to High') return a.price - b.price;
    if (filters.sortBy === 'Price: High to Low') return b.price - a.price;
    return 0; // 'Recommended' (original order)
  });

  let finalFiltered = filteredListings;
  if (filters.trendingOnly) {
    const trendingSet = new Set();
    finalFiltered = [];
    for (const item of filteredListings) {
      const lowerTitle = item.title?.toLowerCase() || '';
      if (lowerTitle.includes('netflix') && !trendingSet.has('netflix')) {
        trendingSet.add('netflix');
        finalFiltered.push(item);
      } else if (lowerTitle.includes('chatgpt') && !trendingSet.has('chatgpt')) {
        trendingSet.add('chatgpt');
        finalFiltered.push(item);
      } else if (lowerTitle.includes('spotify') && !trendingSet.has('spotify')) {
        trendingSet.add('spotify');
        finalFiltered.push(item);
      } else if (lowerTitle.includes('udemy') && !trendingSet.has('udemy')) {
        trendingSet.add('udemy');
        finalFiltered.push(item);
      }
      if (trendingSet.size === 4) break;
    }
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>All Listings</h3>
      
      <div className={styles.filtersRow}>
        <button 
          className={styles.filterBtn}
          onClick={handleResetFilters}
        >
          <FilterListIcon /> All Filters
        </button>
        <button 
          className={styles.filterBtn} 
          onClick={handleCategoryClick}
          style={filters.category && filters.category !== 'All' ? { background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', borderColor: 'rgba(34, 197, 94, 0.3)' } : {}}
        >
          {filters.category && filters.category !== 'All' ? filters.category : 'Category'} <KeyboardArrowDownIcon />
        </button>
        <Menu
          anchorEl={categoryAnchorEl}
          open={Boolean(categoryAnchorEl)}
          onClose={handleCategoryClose}
          PaperProps={{
            sx: {
              background: '#1a1d24',
              color: '#f3f4f6',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              mt: 1,
            }
          }}
        >
          {['OTT', 'Music', 'Productivity', 'Gaming', 'Education'].map((cat) => (
            <MenuItem 
              key={cat} 
              onClick={() => handleCategorySelect(cat)}
              sx={{
                fontSize: '0.85rem',
                '&:hover': { background: 'rgba(255, 255, 255, 0.05)' }
              }}
            >
              {cat}
            </MenuItem>
          ))}
        </Menu>

        <button 
          className={`${styles.filterBtn} ${filters.trendingOnly ? styles.active : ''}`}
          onClick={handleTrendingToggle}
          style={filters.trendingOnly 
            ? { background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderColor: '#dc2626', fontWeight: 'bold' } 
            : { color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }
          }
        >
          <WhatshotIcon sx={{ fontSize: '1.2rem', mr: 0.5 }} /> Trending
        </button>

        <button 
          className={styles.filterBtn}
          onClick={handlePriceClick}
          style={filters.priceRangeString && filters.priceRangeString !== 'All Prices' ? { background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', borderColor: 'rgba(34, 197, 94, 0.3)' } : {}}
        >
          {filters.priceRangeString && filters.priceRangeString !== 'All Prices' ? filters.priceRangeString : 'Price'} <KeyboardArrowDownIcon />
        </button>
        <Menu
          anchorEl={priceAnchorEl}
          open={Boolean(priceAnchorEl)}
          onClose={handlePriceClose}
          PaperProps={{
            sx: {
              background: '#1a1d24',
              color: '#f3f4f6',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              mt: 1,
            }
          }}
        >
          {['All Prices', 'Under ₹100', '₹100 - ₹200', 'Above ₹200'].map((price) => (
            <MenuItem 
              key={price} 
              onClick={() => handlePriceSelect(price)}
              sx={{
                fontSize: '0.85rem',
                '&:hover': { background: 'rgba(255, 255, 255, 0.05)' }
              }}
            >
              {price}
            </MenuItem>
          ))}
        </Menu>
        
        <div className={styles.rightFilters}>
          <button 
            className={styles.filterBtn} 
            style={{ border: 'none', padding: 0 }}
            onClick={handleSortClick}
          >
            Sort by: {filters.sortBy && filters.sortBy !== 'Recommended' ? filters.sortBy : 'Recommended'} <KeyboardArrowDownIcon />
          </button>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleSortClose}
            PaperProps={{
              sx: {
                background: '#1a1d24',
                color: '#f3f4f6',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                mt: 1,
              }
            }}
          >
            {['Recommended', 'Price: Low to High', 'Price: High to Low'].map((sortOption) => (
              <MenuItem 
                key={sortOption} 
                onClick={() => handleSortSelect(sortOption)}
                sx={{
                  fontSize: '0.85rem',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.05)' }
                }}
              >
                {sortOption}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>

      <div className={styles.listContainer}>
        {loading && listings.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
            Loading live marketplace listings...
          </div>
        ) : finalFiltered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
            No listings found matching criteria.
          </div>
        ) : (
          finalFiltered.map((listing) => (
            <div
              key={listing.id}
              className={styles.listingCard}
              onClick={() => navigate(`/app/marketplace/${listing.id}`)}
            >
              <div 
                className={styles.cardCover} 
                style={{ backgroundColor: listing.iconBg || 'rgba(37,99,235,0.12)' }}
              >
                <SubscriptionsIcon className={styles.coverIcon} style={{ color: listing.iconColor || '#2563eb' }} />
                <div className={styles.categoryBadge}>{listing.category}</div>
                <div className={styles.seatsBadge}>{listing.seatsLeft} slots left</div>
              </div>
              
              <div className={styles.cardBody}>
                <h4 className={styles.listingTitle}>{listing.title}</h4>
                
                <div className={styles.hostRow}>
                  <div className={styles.hostAvatar} style={{ backgroundColor: listing.host?.avatarBg || '#2563eb' }}>
                    {listing.host?.initials || 'VH'}
                  </div>
                  <span className={styles.hostName}>
                    {listing.hostName || listing.host?.name} 
                    {listing.isVerifiedHost && <VerifiedIcon className={styles.verifiedIcon} />}
                  </span>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.priceContainer}>
                    <div className={styles.currentPrice}>
                      ₹{listing.price}<span>/mo</span>
                    </div>
                    {listing.originalPrice && (
                      <div className={styles.originalPrice}>₹{listing.originalPrice}</div>
                    )}
                  </div>
                  <button
                    className={styles.addBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/marketplace/${listing.id}`);
                    }}
                  >
                    ADD
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListingTable;
