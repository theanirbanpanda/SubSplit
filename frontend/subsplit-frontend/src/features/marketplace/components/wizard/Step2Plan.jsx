import React, { useMemo, useState } from 'react';
import { Mail, Users, Calendar, AlertCircle } from 'lucide-react';
import styles from './CreateListingWizard.module.scss';

/**
 * Step 2 \u2014 Plan Details
 * Props:
 *   product: object \u2014 selected catalog product (from Step 1)
 *   plan: {
 *     seatsUsed: number,
 *     maxMembers: string,
 *     renewalDate: string,   // ISO date "YYYY-MM-DD"
 *     billingCycle: 'MONTHLY' | 'YEARLY',
 *   }
 *   onChange: (patch) => void
 */
function Step2Plan({ product, plan, onChange }) {
  const { name, category, accessMethod, brandColor, initials, maxCapacity } = product;
  const isEmail = accessMethod === 'Invite via Email';
  const tileBg = `${brandColor}28`;

  // Track which fields have been interacted with (touched)
  const [touched, setTouched] = useState({ maxMembers: false, seatsUsed: false });

  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const seatsUsedNum = parseInt(plan.seatsUsed, 10) || 0;
  const maxMembersNum = parseInt(plan.maxMembers, 10) || 0;
  const availableSeats = maxMembersNum - seatsUsedNum;

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

  // ── Validation hints (visual only \u2014 actual gating is in parent) ─────────────
  // maxCapacity from the Excel master catalog (product-level hard limit)
  const hardMax = maxCapacity || 10;

  const isMaxEmpty = !plan.maxMembers || String(plan.maxMembers).trim() === '';
  const maxMembersError = !isMaxEmpty && touched.maxMembers && (maxMembersNum < 2 || maxMembersNum > hardMax);
  const maxMembersErrorMsg = maxMembersNum < 2
    ? 'Must be at least 2'
    : `Cannot exceed ${hardMax} (plan limit)`;

  const isSeatsEmpty = !plan.seatsUsed || String(plan.seatsUsed).trim() === '';
  const seatsError = !isSeatsEmpty && touched.seatsUsed && (seatsUsedNum < 1 || seatsUsedNum >= maxMembersNum);

  // ── Max Renewal Date ────────────────────────────────────────────────────────
  const maxRenewalDate = useMemo(() => {
    const d = new Date();
    if (plan.billingCycle === 'MONTHLY') {
      d.setMonth(d.getMonth() + 1);
    } else {
      d.setFullYear(d.getFullYear() + 1);
    }
    return d.toISOString().split('T')[0];
  }, [plan.billingCycle]);

  return (
    <div>
      <h2 className={styles.stepHeading}>Plan Details</h2>
      <p className={styles.stepDescription}>
        These details come from the product you selected \u2014 you only need to fill in your specific
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
            {category} \u00b7 {accessMethod}
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

      {/* Max Members + Seats Used + Available Seats row */}
      <div className={styles.formRow3}>
        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <label className={styles.formLabel} htmlFor="wizard-max-members">
            Maximum Members
            <span style={{ color: '#71717A', fontWeight: 500, fontSize: '0.72rem', marginLeft: 6 }}>
              (max {hardMax})
            </span>
          </label>
          <input
            id="wizard-max-members"
            type="number"
            min={2}
            max={hardMax}
            className={styles.formInput}
            value={plan.maxMembers}
            onChange={(e) => onChange({ maxMembers: e.target.value })}
            onBlur={() => markTouched('maxMembers')}
            placeholder="e.g. 5"
            style={maxMembersError ? { borderColor: '#EF4444' } : {}}
          />
          {maxMembersError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <AlertCircle size={12} color="#EF4444" />
              <span style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: 600 }}>
                {maxMembersErrorMsg}
              </span>
            </div>
          )}
        </div>

        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <label className={styles.formLabel} htmlFor="wizard-seats-used">
            Seats Currently Used
          </label>
          <input
            id="wizard-seats-used"
            type="number"
            min={1}
            max={maxMembersNum - 1}
            className={styles.formInput}
            value={plan.seatsUsed}
            onChange={(e) => onChange({ seatsUsed: e.target.value })}
            onBlur={() => markTouched('seatsUsed')}
            placeholder="1"
            style={seatsError ? { borderColor: '#EF4444' } : {}}
          />
          {seatsError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <AlertCircle size={12} color="#EF4444" />
              <span style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: 600 }}>
                Must be between 1 and {Math.max(1, maxMembersNum - 1)}
              </span>
            </div>
          )}
        </div>

        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <label className={styles.formLabel}>
            Available Seats
          </label>
          <input
            type="text"
            className={styles.formInput}
            value={availableSeats >= 0 ? availableSeats : '\u2014'}
            readOnly
            style={{ 
              color: availableSeats > 0 ? '#22C55E' : '#EF4444', 
              fontWeight: 800, 
              backgroundColor: 'rgba(255,255,255,0.02)' 
            }}
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

      {/* Renewal Date */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="wizard-renewal-date">
          Renewal Date
        </label>
        <input
          id="wizard-renewal-date"
          type="date"
          className={styles.formInput}
          value={plan.renewalDate}
          onChange={(e) => onChange({ renewalDate: e.target.value })}
          onClick={(e) => {
            if (typeof e.target.showPicker === 'function') {
              try { e.target.showPicker(); } catch (err) {}
            }
          }}
          onKeyDown={(e) => e.preventDefault()}
          min={new Date().toISOString().split('T')[0]}
          max={maxRenewalDate}
        />
        <div style={{ marginTop: 6, fontSize: '0.75rem', color: '#71717A' }}>
          Date must be within 1 {plan.billingCycle === 'MONTHLY' ? 'month' : 'year'}.
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


