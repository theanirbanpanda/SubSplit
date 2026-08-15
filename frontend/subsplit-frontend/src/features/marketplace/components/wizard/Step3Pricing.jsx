import React from 'react';
import { Zap } from 'lucide-react';
import {
  getRecommendedPrice,
  computeFeeBreakdown,
  getPriceCompetitiveness,
} from '../../utils/pricingHelpers';
import styles from './CreateListingWizard.module.scss';

/**
 * Step 3 — Pricing
 * Props:
 *   product: object — selected catalog product
 *   price: string  — raw price string (empty or numeric)
 *   onChange: (price: string) => void
 */
function Step3Pricing({ product, price, onChange }) {
  const recommended = getRecommendedPrice(product);
  const priceNum = parseFloat(price) || 0;
  const { fee, earnings } = computeFeeBreakdown(priceNum);
  const { label: compLabel, level: compLevel, markerPct } = getPriceCompetitiveness(priceNum, recommended);

  const handleUseRecommended = () => {
    onChange(String(recommended));
  };

  return (
    <div>
      <h2 className={styles.stepHeading}>Set Your Price</h2>
      <p className={styles.stepDescription}>
        Choose how much members will pay per seat per month. Platform takes a 5% fee.
      </p>

      {/* Recommended Price Callout */}
      <div className={styles.recommendedCallout}>
        <div>
          <div className={styles.recommendedLabel}>
            <Zap size={12} style={{ display: 'inline', marginRight: 4 }} />
            Recommended Price
          </div>
          <div className={styles.recommendedAmount}>₹{recommended}/month</div>
        </div>
        <button
          className={styles.useThisBtn}
          onClick={handleUseRecommended}
          id="wizard-use-recommended-price"
        >
          Use This
        </button>
      </div>

      {/* Price Input */}
      <div className={styles.priceInputWrapper}>
        <span className={styles.currencyPrefix}>₹</span>
        <input
          className={styles.priceInput}
          type="number"
          min={1}
          max={50000}
          placeholder="0"
          value={price}
          onChange={(e) => onChange(e.target.value)}
          id="wizard-price-input"
        />
      </div>

      {/* Fee Breakdown */}
      <div className={styles.feeBreakdown}>
        <div className={styles.feeRow}>
          <span className={styles.feeRowLabel}>Seat Price</span>
          <span className={styles.feeRowValue}>₹{priceNum > 0 ? priceNum.toFixed(2) : '—'}</span>
        </div>
        <div className={styles.feeRow}>
          <span className={styles.feeRowLabel}>Platform Fee (5%)</span>
          <span className={styles.feeRowValue} data-type="fee">
            {priceNum > 0 ? `−₹${fee.toFixed(2)}` : '—'}
          </span>
        </div>
        <div className={styles.feeRow} data-highlight="true">
          <span className={styles.feeRowLabel} style={{ fontWeight: 800, color: '#f3f4f6' }}>
            Your Earnings
          </span>
          <span className={styles.feeRowValue} data-type="earnings">
            {priceNum > 0 ? `₹${earnings.toFixed(2)}/mo` : '—'}
          </span>
        </div>
      </div>

      {/* Price Competitiveness */}
      <div className={styles.competitivenessSection}>
        <div className={styles.competitivenessHeader}>
          <span className={styles.competitivenessTitle}>Price Competitiveness</span>
          <span className={styles.competitivenessBadge} data-level={compLevel}>
            {compLabel}
          </span>
        </div>
        <div className={styles.competitivenessBar}>
          <div
            className={styles.competitivenessMarker}
            style={{ left: `${markerPct}%` }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 6,
            fontSize: '0.65rem',
            color: '#71717A',
            fontWeight: 600,
          }}
        >
          <span>Excellent</span>
          <span>Good</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}

export default Step3Pricing;
