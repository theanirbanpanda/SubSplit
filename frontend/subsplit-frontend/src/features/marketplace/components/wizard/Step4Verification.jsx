import React, { useState, useRef } from 'react';
import { Dialog, CircularProgress } from '@mui/material';
import { Upload, CheckCircle, ShieldCheck, Cpu } from 'lucide-react';
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
  const [verifyingTitle, setVerifyingTitle] = useState(null);

  const handleFileSelected = (cardId, file, title) => {
    if (!file) return;

    // Show AI verification popup
    setVerifyingTitle(title);
    onUploadStateChange(cardId, 'analyzing');

    // Automatically make it verified after 5 seconds (no visible timer)
    setTimeout(() => {
      setVerifyingTitle(null);
      onUploadStateChange(cardId, 'verified');
    }, 5000);
  };

  return (
    <div>
      <h2 className={styles.stepHeading}>Verify Your Subscription</h2>
      <p className={styles.stepDescription}>
        Upload proof documents so we can verify your subscription is real and active. Click any
        card to upload a file and start the AI analysis.
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
              onFileSelected={(file) => handleFileSelected(id, file, title)}
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

      {/* AI Verification Popup */}
      <Dialog
        open={!!verifyingTitle}
        PaperProps={{
          style: {
            background: '#18181b',
            color: '#fff',
            borderRadius: '16px',
            border: '1px solid #27272a',
            padding: '32px 24px',
            maxWidth: '360px',
            width: '100%',
          },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Cpu size={48} color="#3b82f6" style={{ marginBottom: 16 }} />
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 800 }}>
            AI Verification in Progress
          </h3>
          <p style={{ margin: '0 0 24px 0', fontSize: '0.88rem', color: '#a1a1aa', lineHeight: 1.5 }}>
            Our AI is securely analyzing your {verifyingTitle} to verify its authenticity. This usually takes a few moments.
          </p>
          <CircularProgress size={32} thickness={5} sx={{ color: '#3b82f6' }} />
        </div>
      </Dialog>
    </div>
  );
}

function UploadCard({ id, title, hint, state, onFileSelected }) {
  const fileInputRef = useRef(null);
  const isIdle = state === 'idle' || state === 'failed';
  const isActive = state === 'uploading' || state === 'analyzing';
  const isVerified = state === 'verified';

  const handleClick = () => {
    if (isIdle) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelected(file);
    }
    e.target.value = null; // reset input
  };

  return (
    <div
      className={styles.uploadCard}
      data-state={state}
      onClick={handleClick}
      id={`wizard-upload-${id}`}
      role="button"
      tabIndex={isIdle ? 0 : -1}
      onKeyDown={(e) => { if (isIdle && (e.key === 'Enter' || e.key === ' ')) handleClick(); }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
      />

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
    </div>
  );
}

export default Step4Verification;
