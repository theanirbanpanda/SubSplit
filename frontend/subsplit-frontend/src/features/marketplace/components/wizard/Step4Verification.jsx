import React, { useState } from 'react';
import { Upload, CheckCircle, ShieldCheck } from 'lucide-react';
import { simulateVerification } from '../../utils/verificationService';
import styles from './CreateListingWizard.module.scss';

const UPLOAD_CARDS = [
  {
    id: 'invoice',
    title: 'Subscription Invoice',
    hint: 'Recent billing invoice PDF or screenshot',
  },
  {
    id: 'billing',
    title: 'Billing Screenshot',
    hint: 'Screenshot of the payment / billing page',
  },
  {
    id: 'renewal',
    title: 'Renewal Screenshot',
    hint: 'Next renewal date visible on account',
  },
  {
    id: 'dashboard',
    title: 'Subscription Dashboard',
    hint: 'Account / subscription settings page',
  },
];

/**
 * Step 4 — Verification
 * Props:
 *   uploadStates: { [cardId]: 'idle'|'uploading'|'analyzing'|'verified'|'failed' }
 *   onUploadStateChange: (cardId, state) => void
 */
function Step4Verification({ uploadStates, onUploadStateChange }) {
  const anyVerified = Object.values(uploadStates).some((s) => s === 'verified');

  const handleCardClick = async (cardId) => {
    const state = uploadStates[cardId];
    // Only allow clicking idle or failed cards
    if (state !== 'idle' && state !== 'failed') return;

    await simulateVerification((newState) => {
      onUploadStateChange(cardId, newState);
    });
  };

  return (
    <div>
      <h2 className={styles.stepHeading}>Verify Your Subscription</h2>
      <p className={styles.stepDescription}>
        Upload proof documents so we can verify your subscription is real and active. Click any
        card to simulate the upload and AI analysis.
      </p>

      {/* Verified Banner */}
      {anyVerified && (
        <div className={styles.verifiedBanner}>
          <ShieldCheck size={18} color="#22C55E" />
          <span className={styles.verifiedBannerText}>Product Verified — at least one document confirmed.</span>
        </div>
      )}

      {/* Upload Cards Grid */}
      <div className={styles.uploadGrid}>
        {UPLOAD_CARDS.map(({ id, title, hint }) => {
          const state = uploadStates[id] || 'idle';
          return (
            <UploadCard
              key={id}
              id={id}
              title={title}
              hint={hint}
              state={state}
              onClick={() => handleCardClick(id)}
            />
          );
        })}
      </div>

      <p
        style={{
          fontSize: '0.76rem',
          color: '#71717A',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        At least one verified document is required to continue. All documents are encrypted and
        stored securely.
      </p>
    </div>
  );
}

function UploadCard({ id, title, hint, state, onClick }) {
  const isIdle = state === 'idle';
  const isActive = state === 'uploading' || state === 'analyzing';
  const isVerified = state === 'verified';

  return (
    <div
      className={styles.uploadCard}
      data-state={state}
      onClick={onClick}
      id={`wizard-upload-${id}`}
      role="button"
      tabIndex={isIdle ? 0 : -1}
      onKeyDown={(e) => { if (isIdle && (e.key === 'Enter' || e.key === ' ')) onClick(); }}
    >
      {isVerified ? (
        <CheckCircle size={28} color="#22C55E" />
      ) : isActive ? (
        <div className={styles.spinner} />
      ) : (
        <Upload size={24} color="#A1A1AA" />
      )}

      <div className={styles.uploadCardTitle}>{title}</div>

      {isIdle && (
        <div className={styles.uploadCardStatus} data-state={state}>
          {hint}
        </div>
      )}
      {(state === 'uploading') && (
        <div className={styles.uploadCardStatus} data-state={state}>Uploading…</div>
      )}
      {(state === 'analyzing') && (
        <div className={styles.uploadCardStatus} data-state={state}>Analyzing…</div>
      )}
      {isVerified && (
        <div className={styles.uploadCardStatus} data-state={state}>Verified</div>
      )}
      {state === 'failed' && (
        <div className={styles.uploadCardStatus} data-state={state}>Failed — click to retry</div>
      )}
    </div>
  );
}

export default Step4Verification;
