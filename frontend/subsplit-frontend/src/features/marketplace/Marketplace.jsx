import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchMarketplaceListings, fetchCategories, fetchTopHosts } from './marketplaceSlice';
import ScrollToTop from '../landing/components/ScrollToTop';

import MarketplaceHero from './components/MarketplaceHero';
import HostCarousel from './components/HostCarousel';
import ListingTable from './components/ListingTable';
import RecentlyAdded from './components/RecentlyAdded';

import styles from './Marketplace.module.scss';

function Marketplace() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMarketplaceListings());
    dispatch(fetchCategories());
    dispatch(fetchTopHosts());
  }, [dispatch]);

  return (
    <div className={styles.marketplacePage}>
      <div className={styles.container}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <MarketplaceHero />
          <ListingTable />
        </div>
        <HostCarousel />
        <RecentlyAdded />
      </div>

      <ScrollToTop />
    </div>
  );
}

export default Marketplace;
