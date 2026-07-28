import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarketplaceListings, fetchCategories } from '../../marketplace/marketplaceSlice';
import { ServiceLogo } from './ServiceLogos';
import styles from './MarketplacePreview.module.scss';

const SubscriptionCard = React.memo(function SubscriptionCard({
  title, subtitle, price, original, seatsLeft, rating, logoKey, onClick,
}) {
  return (
    <article className={styles.subCard} onClick={onClick} tabIndex={0} role="link">
      <div className={styles.subLogo}>
        <ServiceLogo logoKey={logoKey} size={40} />
      </div>
      <h3 className={styles.subTitle}>{title}</h3>
      <p className={styles.subSubtitle}>{subtitle}</p>
      <div className={styles.subPriceRow}>
        <span className={styles.subPrice}>₹{price}</span>
        <span className={styles.subPriceUnit}>/month</span>
        <span className={styles.subOriginal}>₹{original}</span>
      </div>
      <div className={styles.subFooter}>
        <span className={styles.subSeats}>{seatsLeft} seats left</span>
        <span className={styles.subRating}>
          <Star size={12} fill="#f59e0b" color="#f59e0b" />
          {rating}
        </span>
      </div>
    </article>
  );
});

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

  const categoryOptions = useMemo(() => {
    const defaultCategories = [{ id: 'all', name: 'All' }];
    if (!categories || categories.length === 0) return defaultCategories;
    return [
      ...defaultCategories,
      ...categories.map(c => ({ id: c.name.toLowerCase(), name: c.name }))
    ];
  }, [categories]);

  const filteredSubs = useMemo(() => {
    if (activeFilter === 'all') return listings.slice(0, 6);
    return listings
      .filter((s) => s.category?.toLowerCase() === activeFilter.toLowerCase())
      .slice(0, 6);
  }, [activeFilter, listings]);

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

        {/* ── Category Filters ── */}
        <div className={styles.filterRow} role="tablist" aria-label="Filter subscriptions">
          {categoryOptions.map(({ id, name }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeFilter === id}
              className={`${styles.filterChip} ${
                activeFilter === id ? styles.filterChipActive : ''
              }`}
              onClick={() => setActiveFilter(id)}
              type="button"
            >
              {name}
            </button>
          ))}
        </div>

        {/* ── Cards Grid ── */}
        <div className={styles.cardsGrid}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', width: '100%' }}>
              Loading listings...
            </div>
          ) : filteredSubs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', width: '100%' }}>
              No listings found for this category.
            </div>
          ) : (
            filteredSubs.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                title={sub.title}
                subtitle={sub.description ? (sub.description.length > 40 ? sub.description.substring(0, 40) + '...' : sub.description) : 'Verified Plan'}
                price={sub.price}
                original={sub.originalPrice}
                seatsLeft={sub.seatsLeft}
                rating={sub.host?.rating || 4.9}
                logoKey={sub.platform ? sub.platform.toLowerCase() : 'default'}
                onClick={() => handleCardClick(sub.id)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default MarketplacePreview;
