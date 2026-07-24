import React from 'react';
import PublicNavbar from '../landing/components/PublicNavbar';
import Footer from '../landing/components/Footer';
import ScrollToTop from '../landing/components/ScrollToTop';

import MarketplaceHero from './components/MarketplaceHero';
import CategoryChips from './components/CategoryChips';
import RecommendationSection from './components/RecommendationSection';
import TrendingSection from './components/TrendingSection';
import HostCarousel from './components/HostCarousel';
import ListingTable from './components/ListingTable';
import RecentlyAdded from './components/RecentlyAdded';
import ProtectionBanner from './components/ProtectionBanner';

import styles from './Marketplace.module.scss';

function Marketplace() {
  return (
    <div className={styles.marketplacePage}>
      <PublicNavbar />

      <div className={styles.container}>
        <MarketplaceHero />
        <CategoryChips />
        <RecommendationSection />
        <TrendingSection />
        <HostCarousel />
        <ListingTable />
        <RecentlyAdded />
        <ProtectionBanner />
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Marketplace;
