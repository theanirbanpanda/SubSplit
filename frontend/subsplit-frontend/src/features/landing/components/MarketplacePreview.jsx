import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarketplaceListings, fetchCategories } from '../../marketplace/marketplaceSlice';
import { ServiceLogo } from './ServiceLogos';
import styles from './MarketplacePreview.module.scss';

import SubscriptionCard from '../../marketplace/components/SubscriptionCard';

function MarketplacePreview() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { listings, categories, loading } = useSelector((state) => state.marketplace);
  const [activeFilter, setActiveFilter] = useState('all');
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch marketplace data for the preview
    dispatch(fetchMarketplaceListings());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCardClick = useCallback((id) => {
    navigate(`/app/marketplace/${id}`);
  }, [navigate]);

  const filteredSubs = useMemo(() => {
    return listings.slice(0, 6);
  }, [listings]);

  return (
    <section
      id="marketplace"
      className={styles.marketplace}
      ref={sectionRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <div className={styles.container}>
        {/* ── Header Row ── */}
        <div className={styles.headerRow}>
          <h2 className={styles.sectionTitle}>Explore Popular Subscriptions</h2>
          <button
            className={styles.viewAll}
            onClick={() => navigate('/app/marketplace')}
            type="button"
          >
            View all <ArrowRight size={16} />
          </button>
        </div>

        {/* ── Cards Grid ── */}
        <div className={styles.cardsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '32px' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', width: '100%' }}>
              Loading listings...
            </div>
          ) : filteredSubs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', width: '100%' }}>
              No listings found for this category.
            </div>
          ) : (
            filteredSubs.map((sub, index) => (
              <SubscriptionCard
                key={sub.id}
                listing={sub}
                variant="small"
                isBlurred={index === 5}
              />
            ))
          )}
        </div>

        {/* ── Login to See More ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px', color: '#9ca3af', fontSize: '1rem' }}>
          <span>
            ...and hundreds more.{' '}
            <button
              onClick={() => navigate('/auth')}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                textDecoration: 'underline',
                fontSize: '1rem',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
                fontWeight: 500,
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#60a5fa'}
              onMouseOut={(e) => e.currentTarget.style.color = '#3b82f6'}
            >
              Sign in to see all
            </button>
          </span>
        </div>
      </div>
    </section>
  );
}

export default MarketplacePreview;
