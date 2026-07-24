import React from 'react';
import { ShieldCheck, Zap, Headphones } from 'lucide-react';
import styles from './MarketplaceHero.module.scss';

const MarketplaceHero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.trustBadge}>
          <div className={styles.dot}></div>
          <span>India's Most Trusted Subscription Sharing Marketplace</span>
        </div>
        
        <h1 className={styles.title}>
          Your favourite<br />
          subscriptions, <span className={styles.highlight}>for less.</span>
        </h1>
        
        <p className={styles.subtitle}>
          Join verified subscription groups and save up to 80% every month. Safe. Affordable. Instant.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <ShieldCheck /> AI Verified Hosts
          </div>
          <div className={styles.feature}>
            <ShieldCheck /> Payment Protection
          </div>
          <div className={styles.feature}>
            <Zap /> Instant / Easy Join
          </div>
          <div className={styles.feature}>
            <Headphones /> 24/7 Support
          </div>
        </div>
      </div>

      <div className={styles.savingsCardWrapper}>
        <div className={styles.savingsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.label}>Total Savings</div>
            <div className={styles.amount}>
              ₹24,650
              <span className={styles.period}>this year</span>
            </div>
          </div>
          
          <div className={styles.chartContainer}>
            {/* Simple mock chart using SVG path matching the design's green line */}
            <svg viewBox="0 0 300 80" preserveAspectRatio="none">
              <path d="M0,60 C40,55 60,65 100,50 C140,35 160,45 200,30 C240,15 280,10 300,5" />
            </svg>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Joined Groups</span>
              <span className={styles.statValue}>12</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Active Now</span>
              <span className={styles.statValue}>8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHero;
