import React from 'react';
import { ShieldCheck } from 'lucide-react';
import MarketplaceCard from '../MarketplaceCard';
import { computeFeeBreakdown } from '../../utils/pricingHelpers';
import styles from './CreateListingWizard.module.scss';

/**
 * Step 5 — Review & Publish
 * Displays a summary of all wizard values and a live MarketplaceCard preview.
 * The actual publish action is triggered by the parent (wizard footer button).
 *
 * Props:
 *   product: object
 *   plan: { seatsUsed, renewalDate, billingCycle }
 *   price: string
 *   uploadStates: object
 *   publishLoading: boolean
 *   publishError: string | null
 */
function Step5Review({ product, plan, price, uploadStates, publishLoading, publishError }) {
  const priceNum = parseFloat(price) || 0;
  const { earnings } = computeFeeBreakdown(priceNum);
  const seatsUsedNum = parseInt(plan.seatsUsed, 10) || 0;
  const availableSeats = product.maxMembers - seatsUsedNum;
  const anyVerified = Object.values(uploadStates).some((s) => s === 'verified');

  // ── Compute countdown display ────────────────────────────────────────────────
  let daysRemainingStr = '—';
  if (plan.renewalDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const renewal = new Date(plan.renewalDate);
    if (!isNaN(renewal.getTime())) {
      const days = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24));
      daysRemainingStr = `${days} days`;
    }
  }

  // ── Synthesize a listing object for MarketplaceCard ─────────────────────────
  // MarketplaceCard expects: { id, title, price, seatsLeft, totalSeats,
  //   isVerifiedHost, isEscrowProtected, iconColor, iconBg, host, hostName }
  const previewListing = {
    id: 'preview',
    title: product.name,
    price: priceNum,
    seatsLeft: availableSeats,
    totalSeats: product.maxMembers,
    isVerifiedHost: anyVerified,
    isEscrowProtected: true,
    iconColor: product.brandColor,
    iconBg: `${product.brandColor}28`,
    hostName: 'You',
    host: { initials: 'Y', avatarBg: '#2563EB', responseTime: '< 5m' },
  };

  const billingLabel = plan.billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly';

  return (
    <div>
      <h2 className={styles.stepHeading}>Review & Publish</h2>
      <p className={styles.stepDescription}>
        Confirm all details before publishing. This will make your listing live on the marketplace.
      </p>

      {publishError && (
        <div
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 10,
            padding: '12px 14px',
            marginBottom: 16,
            color: '#EF4444',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          {publishError}
        </div>
      )}

      <div className={styles.reviewGrid}>
        {/* Summary List */}
        <div>
          <div className={styles.previewLabel} style={{ marginBottom: 10 }}>
            Listing Summary
          </div>
          <div className={styles.summaryList}>
            <SummaryRow label="Product" value={product.name} />
            <SummaryRow label="Category" value={product.category} />
            <SummaryRow label="Access Method" value={product.accessMethod} />
            <SummaryRow label="Seats Available" value={availableSeats} highlight="green" />
            <SummaryRow label="Billing Cycle" value={billingLabel} />
            <SummaryRow
              label="Renewal Date"
              value={plan.renewalDate ? new Date(plan.renewalDate).toLocaleDateString('en-IN') : '—'}
            />
            <SummaryRow label="Days Remaining" value={daysRemainingStr} />
            <SummaryRow
              label="Price / Seat"
              value={priceNum > 0 ? `₹${priceNum}/mo` : '—'}
              highlight="blue"
            />
            <SummaryRow
              label="Estimated Earnings"
              value={priceNum > 0 ? `₹${earnings.toFixed(2)}/mo` : '—'}
              highlight="green"
            />
            <SummaryRow
              label="Verification"
              value={anyVerified ? '✓ Verified' : 'Not verified'}
              highlight={anyVerified ? 'green' : undefined}
            />
          </div>
        </div>

        {/* Listing Preview using real MarketplaceCard */}
        <div className={styles.previewSection}>
          <div className={styles.previewLabel}>Listing Preview</div>
          <div style={{ pointerEvents: 'none', opacity: publishLoading ? 0.5 : 1 }}>
            <MarketplaceCard listing={previewListing} />
          </div>
          {anyVerified && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.75rem',
                color: '#22C55E',
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              <ShieldCheck size={13} />
              Verified badge will appear on your listing
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div className={styles.summaryRow}>
      <span className={styles.summaryKey}>{label}</span>
      <span className={styles.summaryVal} data-highlight={highlight}>
        {value}
      </span>
    </div>
  );
}

export default Step5Review;
