import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarketplaceListings, fetchCategories } from './marketplaceSlice';
import ScrollToTop from '../landing/components/ScrollToTop';

import MarketplaceHero from './components/MarketplaceHero';
import ListingTable from './components/ListingTable';

import styles from './Marketplace.module.scss';

function Marketplace() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.marketplace);

  useEffect(() => {
    dispatch(fetchMarketplaceListings(filters));
    dispatch(fetchCategories());
  }, [dispatch, filters]);

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
