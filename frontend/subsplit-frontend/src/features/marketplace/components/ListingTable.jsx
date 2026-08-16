import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VerifiedIcon from '@mui/icons-material/Verified';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { setFilter, resetFilters } from '../marketplaceSlice';
import styles from './ListingTable.module.scss';

const PAGE_SIZE = 8;

const MARKETPLACE_CATEGORIES = [
  'Design & Creative',
  'Productivity',
  'Cloud Storage',
  'Security & Privacy',
  'Developer Tools',
  'Multimedia',
];

const ListingTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  const { user } = useSelector((state) => state.auth || {});
  const { listings, loading, filters, myJoinRequests = [] } = useSelector((state) => state.marketplace);
  const { subscriptions = [] } = useSelector((state) => state.subscriptions || {});
  
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [priceAnchorEl, setPriceAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

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
      const selected = filters.category.toLowerCase().trim();
      const listingCat = (listing.category || '').toLowerCase().trim();

      const isMatch =
        listingCat === selected ||
        (selected === 'design & creative' && (listingCat === 'design' || listingCat === 'design & creative')) ||
        (selected === 'security & privacy' && (listingCat === 'security' || listingCat === 'security & privacy')) ||
        (selected === 'multimedia' && (listingCat === 'multimedia' || listingCat === 'multimedia & entertainment' || listingCat === 'ott' || listingCat === 'music' || listingCat === 'gaming' || listingCat === 'entertainment')) ||
        (selected === 'productivity' && (listingCat === 'productivity' || listingCat === 'education' || listingCat === 'learning')) ||
        (selected === 'developer tools' && (listingCat === 'developer tools' || listingCat === 'dev tools' || listingCat === 'ai' || listingCat === 'developer')) ||
        (selected === 'cloud storage' && (listingCat === 'cloud storage' || listingCat === 'cloud'));

      if (!isMatch) return false;
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

  // Reset to page 1 whenever any filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.category, filters.priceRangeString, filters.trendingOnly, filters.sortBy]);

  // Pagination calculations
  const totalFiltered = finalFiltered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));

  // If current page is beyond totalPages due to filtering down, adjust it
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalFiltered);
  const paginatedListings = finalFiltered.slice(startIndex, endIndex);

  // Smooth scroll to table top
  const scrollToTableTop = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const mainEl = document.querySelector('main');
    if (mainEl && tableRef.current) {
      const topPos = tableRef.current.offsetTop - 80;
      mainEl.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      scrollToTableTop();
    }
  };

  // Generate dynamic page list with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  return (
    <div className={styles.section} ref={tableRef} id="listings-table-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 className={styles.title}>
          All Listings <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>({totalFiltered})</span>
        </h3>
        {totalPages > 1 && (
          <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>
            Page <span style={{ color: '#4ade80', fontWeight: 800 }}>{currentPage}</span> of {totalPages}
          </span>
        )}
      </div>
      
      <div className={styles.filtersRow}>
        <div className={styles.leftFilters}>
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
            <MenuItem 
              onClick={() => handleCategorySelect('All')}
              sx={{
                fontSize: '0.85rem',
                fontWeight: !filters.category || filters.category === 'All' ? 700 : 400,
                color: !filters.category || filters.category === 'All' ? '#4ade80' : 'inherit',
                '&:hover': { background: 'rgba(255, 255, 255, 0.05)' }
              }}
            >
              All Categories
            </MenuItem>
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <MenuItem 
                key={cat} 
                onClick={() => handleCategorySelect(cat)}
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: filters.category === cat ? 700 : 400,
                  color: filters.category === cat ? '#4ade80' : 'inherit',
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
        </div>
        
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
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', gridColumn: '1 / -1' }}>
            Loading live marketplace listings...
          </div>
        ) : finalFiltered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', gridColumn: '1 / -1' }}>
            No listings found matching criteria.
          </div>
        ) : (
          paginatedListings.map((listing) => (
            <div
              key={listing.id}
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
                    {listing.host?.initials || 'VH'}
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
          ))
        )}
      </div>

      {/* Centered Page Navigation */}
      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <div className={styles.paginationControls}>
            {/* First Page */}
            <button
              type="button"
              className={styles.navBtn}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
              title="First Page"
            >
              <ChevronsLeft size={16} />
            </button>

            {/* Prev Page */}
            <button
              type="button"
              className={styles.navBtn}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page Number Buttons */}
            <div className={styles.pagesList}>
              {getPageNumbers().map((p, idx) => {
                if (p === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className={styles.pageEllipsis}>
                      •••
                    </span>
                  );
                }
                return (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.pageNumberBtn} ${currentPage === p ? styles.activePage : ''}`}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Next Page */}
            <button
              type="button"
              className={styles.navBtn}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>

            {/* Last Page */}
            <button
              type="button"
              className={styles.navBtn}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
              title="Last Page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingTable;
