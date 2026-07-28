import React, { useState } from 'react';
import { ShieldCheck, Zap, Headphones, PlusCircle } from 'lucide-react';
import CreateListingModal from './CreateListingModal';
import styles from './MarketplaceHero.module.scss';

const MarketplaceHero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.heroBanner}>
      <div className={styles.heroLeft}>
        <div className={styles.headerTop}>
          <div className={styles.trustBadge}>
            <div className={styles.dot}></div>
            <span>#1 Trusted Platform</span>
          </div>
        </div>
        
        <h1 className={styles.title}>
          Your favourite subscriptions, <span className={styles.highlight}>for less.</span>
        </h1>
        
        <p className={styles.subtitle}>
          Join verified subscription groups and save up to 80% every month. <br />
          Safe. Affordable. Instant.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <ShieldCheck size={16} /> AI Verified
          </div>
          <div className={styles.feature}>
            <ShieldCheck size={16} /> Payment Protection
          </div>
          <div className={styles.feature}>
            <Zap size={16} /> Instant Join
          </div>
          <div className={styles.feature}>
            <Headphones size={16} /> 24/7 Support
          </div>
        </div>
      </div>

      <div className={styles.heroRight}>
        <button
          onClick={() => setIsModalOpen(true)}
          className={styles.ctaButton}
        >
          <PlusCircle size={20} />
          <span>List Subscription</span>
        </button>
        <div className={styles.ctaHint}>Recover up to 80% of cost</div>
      </div>

      <CreateListingModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MarketplaceHero;
