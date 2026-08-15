import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import styles from './DashboardHero.module.scss';

const DashboardHero = ({ pendingCount = 0, onNeedsActionClick }) => {
  const navigate = useNavigate();
  const { summaryStats, loading } = useSelector((state) => state.subscriptions);
  const { myJoinRequests } = useSelector((state) => state.marketplace);

  // Real data — no fallbacks that could pass as real numbers
  const monthlySpend = summaryStats?.monthlySpend;
  const totalSavings = summaryStats?.totalSavings;

  const needsActionCount = (myJoinRequests || []).filter(
    (r) => r.status === 'PENDING' || r.status === 'CREDENTIALS_SHARED'
  ).length;

  const formatRs = (val) => (val != null ? `Rs.${Number(val).toLocaleString('en-IN')}` : null);

  return (
    <div className={styles.heroCard}>
      {/* Top row: icon + title + button */}
      <div className={styles.topRow}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTile}>
            <ShieldCheck size={26} color="#fff" strokeWidth={2} />
          </div>
          <div className={styles.titleStack}>
            <div className={styles.eyebrow}>
              <ShieldCheck size={11} color="#3b82f6" />
              <span>VERIFIED BUYER</span>
            </div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
          </div>
        </div>

        <button
          className={styles.findPassBtn}
          onClick={() => navigate('/app/marketplace')}
          id="dashboard-find-pass-btn"
        >
          <Search size={15} strokeWidth={2.5} />
          <span>Find a Pass</span>
        </button>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Stats row */}
      <div className={styles.statsRow}>
        {/* Spend chip */}
        <div className={styles.statChip}>
          <div className={styles.chipIcon} data-color="neutral">
            <CreditCard size={14} color="#a1a1aa" />
          </div>
          <div className={styles.chipText}>
            {loading && monthlySpend == null ? (
              <span className={styles.loading}>—</span>
            ) : monthlySpend != null ? (
              <strong className={styles.spendValue}>{formatRs(monthlySpend)}</strong>
            ) : (
              <span className={styles.noData}>—</span>
            )}
            <span className={styles.chipLabel}>spend/mo</span>
          </div>
        </div>

        {/* Saved chip */}
        <div className={styles.statChip}>
          <div className={styles.chipIcon} data-color="green">
            <TrendingUp size={14} color="#22c55e" />
          </div>
          <div className={styles.chipText}>
            {loading && totalSavings == null ? (
              <span className={styles.loading}>—</span>
            ) : totalSavings != null ? (
              <strong className={styles.savedValue}>{formatRs(totalSavings)}</strong>
            ) : (
              <span className={styles.noData}>—</span>
            )}
            <span className={styles.chipLabel}>saved</span>
          </div>
        </div>

        {/* Needs action pill */}
        {needsActionCount > 0 && (
          <button
            className={styles.needsActionPill}
            onClick={onNeedsActionClick}
            id="dashboard-needs-action-pill"
          >
            <AlertCircle size={12} color="#f59e0b" />
            <span>{needsActionCount} needs action</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardHero;
