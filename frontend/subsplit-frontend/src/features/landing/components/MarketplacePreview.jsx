import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SUBSCRIPTIONS, CATEGORY_FILTERS } from '../data/subscriptions';
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
  const [activeFilter, setActiveFilter] = useState('all');
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const handleCardClick = useCallback(() => {
    navigate('/app/marketplace');
  }, [navigate]);

  const filteredSubs = useMemo(() => {
    if (activeFilter === 'all') return SUBSCRIPTIONS;
    return SUBSCRIPTIONS.filter((s) => s.category === activeFilter);
  }, [activeFilter]);

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
          {CATEGORY_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              role="tab"
              aria-selected={activeFilter === value}
              className={`${styles.filterChip} ${
                activeFilter === value ? styles.filterChipActive : ''
              }`}
              onClick={() => setActiveFilter(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Cards Grid ── */}
        <div className={styles.cardsGrid}>
          {filteredSubs.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              {...sub}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MarketplacePreview;
