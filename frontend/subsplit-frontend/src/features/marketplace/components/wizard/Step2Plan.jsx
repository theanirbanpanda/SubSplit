import React, { useMemo } from 'react';
import { Mail, Users, Calendar, AlertCircle } from 'lucide-react';
import styles from './CreateListingWizard.module.scss';

/**
 * Step 2 — Plan Details
 * Props:
 *   product: object — selected catalog product (from Step 1)
 *   plan: {
 *     seatsUsed: number,
 *     renewalDate: string,   // ISO date "YYYY-MM-DD"
 *     billingCycle: 'MONTHLY' | 'YEARLY',
 *   }
 *   onChange: (patch) => void
 */
function Step2Plan({ product, plan, onChange }) {
  const { name, category, accessMethod, maxMembers, brandColor, initials } = product;
  const isEmail = accessMethod === 'Invite via Email';
  const tileBg = `${brandColor}28`;

  const seatsUsedNum = parseInt(plan.seatsUsed, 10) || 0;
  const availableSeats = maxMembers - seatsUsedNum;

  // ── Renewal countdown ───────────────────────────────────────────────────────
  const { daysRemaining, progressPct } = useMemo(() => {
    if (!plan.renewalDate) return { daysRemaining: null, progressPct: 0 };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const renewal = new Date(plan.renewalDate);
    if (isNaN(renewal.getTime())) return { daysRemaining: null, progressPct: 0 };

    const msLeft = renewal - today;
    const days = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

    // Show 30-day window as full bar; > 30 days = 100%, < 0 = 0%
    const pct = Math.min(100, Math.max(0, Math.round((days / 30) * 100)));
    return { daysRemaining: days, progressPct: pct };
  }, [plan.renewalDate]);

  // ── Validation hints (visual only — actual gating is in parent) ─────────────
  const seatsError =
    plan.seatsUsed !== '' && (seatsUsedNum < 1 || seatsUsedNum >= maxMembers);

  return (
    <div>
      <h2 className={styles.stepHeading}>Plan Details</h2>
      <p className={styles.stepDescription}>
        These details come from the product you selected — you only need to fill in your specific
        plan.
      </p>

      {/* Product summary card */}
      <div className={styles.productSummaryCard}>
        <div
          className={styles.logoTile}
          style={{ background: tileBg, color: brandColor, width: 44, height: 44 }}
        >
          {initials}
        </div>
        <div className={styles.productSummaryInfo}>
          <div className={styles.productSummaryName}>{name}</div>
          <div className={styles.productSummaryMeta}>
            {category} · {accessMethod}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isEmail ? (
            <Mail size={14} color="#71717A" />
          ) : (
            <Users size={14} color="#71717A" />
          )}
        </div>
      </div>

      {/* Seats Used + Renewal Date row */}
      <div className={styles.formRow}>
        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <label className={styles.formLabel} htmlFor="wizard-seats-used">
            Seats Currently Used
          </label>
          <input
            id="wizard-seats-used"
            type="number"
            min={1}
            max={maxMembers - 1}
            className={styles.formInput}
            value={plan.seatsUsed}
            onChange={(e) => onChange({ seatsUsed: e.target.value })}
            placeholder="1"
            style={seatsError ? { borderColor: '#EF4444' } : {}}
          />
          {seatsError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <AlertCircle size={12} color="#EF4444" />
              <span style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: 600 }}>
                Must be between 1 and {maxMembers - 1}
              </span>
            </div>
          )}
        </div>

        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <label className={styles.formLabel} htmlFor="wizard-renewal-date">
            Renewal Date
          </label>
          <input
            id="wizard-renewal-date"
            type="date"
            className={styles.formInput}
            value={plan.renewalDate}
            onChange={(e) => onChange({ renewalDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Billing Cycle */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Billing Cycle</label>
        <div className={styles.billingToggle}>
          <button
            type="button"
            className={styles.billingOption}
            data-active={plan.billingCycle === 'MONTHLY' ? 'true' : 'false'}
            onClick={() => onChange({ billingCycle: 'MONTHLY' })}
            id="wizard-billing-monthly"
          >
            Monthly
          </button>
          <button
            type="button"
            className={styles.billingOption}
            data-active={plan.billingCycle === 'YEARLY' ? 'true' : 'false'}
            onClick={() => onChange({ billingCycle: 'YEARLY' })}
            id="wizard-billing-yearly"
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Max Members + Available Seats tiles */}
      <div className={styles.metaRow}>
        <div className={styles.metaTile}>
          <div className={styles.metaTileLabel}>Maximum Members</div>
          <div className={styles.metaTileValue}>{maxMembers}</div>
        </div>
        <div className={styles.metaTile}>
          <div className={styles.metaTileLabel}>Available Seats</div>
          <div
            className={styles.metaTileValue}
            style={{ color: availableSeats > 0 ? '#22C55E' : '#EF4444' }}
          >
            {availableSeats >= 0 ? availableSeats : '—'}
          </div>
        </div>
      </div>

      {/* Renewal countdown */}
      {plan.renewalDate && daysRemaining !== null && (
        <div className={styles.countdownSection}>
          <div className={styles.countdownHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} color="#A1A1AA" />
              <span className={styles.countdownLabel}>Renewal Countdown</span>
            </div>
            <span className={styles.countdownDays}>
              {daysRemaining > 0 ? `${daysRemaining} Days Remaining` : 'Expires today or past'}
            </span>
          </div>
          <div className={styles.countdownBar}>
            <div
              className={styles.countdownFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Step2Plan;
