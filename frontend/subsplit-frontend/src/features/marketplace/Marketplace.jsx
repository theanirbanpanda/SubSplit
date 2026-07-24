import React, { useState, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import PublicNavbar from '../landing/components/PublicNavbar';
import MarketplaceHeader from './components/MarketplaceHeader';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import MarketplaceSidebar from './components/MarketplaceSidebar';
import FeaturedListings from './components/FeaturedListings';
import MarketplaceCard from './components/MarketplaceCard';
import EmptyState from './components/EmptyState';
import LiveActivityWidget from './components/LiveActivityWidget';

import Footer from '../landing/components/Footer';
import ScrollToTop from '../landing/components/ScrollToTop';
import { MOCK_LISTINGS } from './data/mockListings';

function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [priceRange, setPriceRange] = useState(600);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [instantOnly, setInstantOnly] = useState(false);
  const [sortBy, setSortBy] = useState('trending');

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPlatforms([]);
    setPriceRange(600);
    setVerifiedOnly(false);
    setInstantOnly(false);
    setSortBy('trending');
  };

  const filteredListings = useMemo(() => {
    let result = [...MOCK_LISTINGS];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.platform.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Platform filter
    if (selectedPlatforms.length > 0) {
      result = result.filter((item) => selectedPlatforms.includes(item.platform));
    }

    // Price range filter
    result = result.filter((item) => item.price <= priceRange);

    // Verified only filter
    if (verifiedOnly) {
      result = result.filter((item) => item.isVerifiedHost);
    }

    // Instant access filter
    if (instantOnly) {
      result = result.filter((item) => item.isEscrowProtected);
    }

    // Sort
    if (sortBy === 'price_low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'savings_high') {
      result.sort((a, b) => (b.savingsPercent || 0) - (a.savingsPercent || 0));
    } else if (sortBy === 'rating_high') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, selectedCategory, selectedPlatforms, priceRange, verifiedOnly, instantOnly, sortBy]);

  return (
    <Box sx={{ minHeight: '100vh', background: '#09090B', color: '#ffffff', overflowX: 'hidden' }}>
      <PublicNavbar />

      <Box sx={{ width: '92%', maxWidth: '1440px', mx: 'auto', pb: 8 }}>
        <MarketplaceHeader />

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* 12-column Desktop Layout */}
        <Grid container spacing={3.5}>
          {/* Persistent Left Sidebar (3 cols) */}
          <Grid item xs={12} md={3.2}>
            <MarketplaceSidebar
              selectedPlatforms={selectedPlatforms}
              setSelectedPlatforms={setSelectedPlatforms}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
              instantOnly={instantOnly}
              setInstantOnly={setInstantOnly}
              onReset={handleResetFilters}
            />
          </Grid>

          {/* Main Content Area (9 cols) */}
          <Grid item xs={12} md={8.8}>
            <FilterBar
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalResults={filteredListings.length}
            />

            {/* Featured Deals Carousel */}
            {selectedCategory === 'All' && !searchQuery && selectedPlatforms.length === 0 && (
              <FeaturedListings listings={MOCK_LISTINGS} />
            )}

            {/* All Listings Grid */}
            {filteredListings.length > 0 ? (
              <Grid container spacing={3}>
                {filteredListings.map((listing) => (
                  <Grid item xs={12} sm={6} md={4} key={listing.id}>
                    <MarketplaceCard listing={listing} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <EmptyState onReset={handleResetFilters} />
            )}
          </Grid>
        </Grid>
      </Box>

      <LiveActivityWidget />

      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default Marketplace;
