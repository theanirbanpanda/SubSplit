import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Grid } from '@mui/material';
import { Sparkles, CheckCircle2, ArrowRight, TrendingDown, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COMPARISON_CURRENT, COMPARISON_SUBSPLIT } from '../data/subscriptions';
import { NetflixLogo, SpotifyLogo, YouTubeLogo } from './ServiceLogos';
import styles from './HeroSection.module.scss';

const TRUST_CHECK_ITEMS = ['Verified Hosts', 'Secure Payments', 'Instant Access'];

const SERVICE_LOGOS = {
  Netflix: NetflixLogo,
  Spotify: SpotifyLogo,
  YouTube: YouTubeLogo,
};

function HeroSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subsplit');
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

  const currentData = COMPARISON_CURRENT;
  const subsplitData = COMPARISON_SUBSPLIT;

  const currentTotal = useMemo(
    () => currentData.reduce((sum, item) => sum + item.price, 0),
    [currentData]
  );
  const subsplitTotal = useMemo(
    () => subsplitData.reduce((sum, item) => sum + item.price, 0),
    [subsplitData]
  );
  const saved = currentTotal - subsplitTotal;
  const savedPct = Math.round((saved / currentTotal) * 100);

  const activePricing = activeTab === 'current' ? currentData : subsplitData;
  const activeTotal = activeTab === 'current' ? currentTotal : subsplitTotal;

  return (
    <section
      className={`${styles.hero} ${styles.fadeInUp} ${isVisible ? styles.fadeInUpVisible : ''}`}
      ref={sectionRef}
      id="hero"
    >
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className={styles.container}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* ── Left Column ── */}
          <Grid item xs={12} md={6}>
            {/* Eyebrow badge */}
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowIcon}>
                <Sparkles size={13} />
              </span>
              India&apos;s #1 Subscription Sharing Marketplace
            </div>

            {/* Headline */}
            <h1 className={styles.headline}>
              Stop Paying Full Price
              <br />
              For Every{' '}
              <span className={styles.headlineAccent}>Subscription.</span>
            </h1>

            {/* Subtitle */}
            <p className={styles.subtitle}>
              Join verified subscription groups for Netflix, Spotify,
              ChatGPT, Prime Video and more. Pay only your share.
            </p>

            {/* CTA Buttons */}
            <div className={styles.ctaRow}>
              <button
                className={styles.ctaPrimary}
                onClick={() => navigate('/app/marketplace')}
                type="button"
              >
                Browse Marketplace
              </button>
              <button
                className={styles.ctaSecondary}
                onClick={() => navigate('/auth')}
                type="button"
              >
                Login
              </button>
            </div>

            {/* Trust Checkmarks */}
            <div className={styles.trustChecks}>
              {TRUST_CHECK_ITEMS.map((item) => (
                <div className={styles.trustItem} key={item}>
                  <CheckCircle2 size={16} color="#22c55e" />
                  <span className={styles.trustLabel}>{item}</span>
                </div>
              ))}
            </div>
          </Grid>

          {/* ── Right Column — Comparison Widget ── */}
          <Grid item xs={12} md={6}>
            <div className={styles.comparisonWidget}>
              {/* Tab Switcher */}
              <div className={styles.widgetTabs}>
                <button
                  className={`${styles.widgetTab} ${styles.widgetTabCurrent} ${activeTab === 'current' ? styles.widgetTabActive : ''
                    }`}
                  onClick={() => setActiveTab('current')}
                  type="button"
                >
                  CURRENT
                </button>
                <button
                  className={`${styles.widgetTab} ${styles.widgetTabSubsplit} ${activeTab === 'subsplit' ? styles.widgetTabActive : ''
                    }`}
                  onClick={() => setActiveTab('subsplit')}
                  type="button"
                >
                  SUBSPLIT
                </button>
              </div>

              {/* Transfer Icon */}
              <div className={styles.transferIcon}>
                <ArrowLeftRight size={20} />
              </div>

              {/* Pricing Rows */}
              <div className={styles.pricingRows}>
                {activePricing.map(({ service, price }) => {
                  const LogoComp = SERVICE_LOGOS[service];
                  return (
                    <div className={styles.pricingRow} key={service}>
                      <div className={styles.pricingService}>
                        {LogoComp && <LogoComp size={28} />}
                        <span className={styles.pricingServiceName}>{service}</span>
                      </div>
                      <span
                        className={`${styles.pricingAmount} ${activeTab === 'current'
                          ? styles.pricingAmountStrike
                          : styles.pricingAmountGreen
                          }`}
                      >
                        ₹{price}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Total Row */}
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span
                  className={`${styles.totalAmount} ${activeTab === 'current'
                    ? styles.totalAmountRed
                    : styles.totalAmountGreen
                    }`}
                >
                  ₹{activeTotal}
                </span>
              </div>
            </div>

            {/* Savings Banner */}
            <div className={styles.savingsBanner}>
              <span className={styles.savingsIcon}>
                <TrendingDown size={18} color="#22c55e" />
              </span>
              <span className={styles.savingsText}>
                You Save ₹{saved} ({savedPct}%) Every Month!
              </span>
            </div>
          </Grid>
        </Grid>
      </div>
    </section>
  );
}

export default HeroSection;
