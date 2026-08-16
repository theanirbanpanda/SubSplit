import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchMarketplaceListings, fetchCategories } from './marketplaceSlice';
import ScrollToTop from '../landing/components/ScrollToTop';

import MarketplaceHero from './components/MarketplaceHero';
import ListingTable from './components/ListingTable';

import styles from './Marketplace.module.scss';

function Marketplace() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMarketplaceListings());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className={styles.marketplacePage}>
      <div className={styles.container}>
        <div className={styles.mainFlow}>
          <MarketplaceHero />
          <ListingTable />
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
}

export default Marketplace;
