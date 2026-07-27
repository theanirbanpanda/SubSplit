import React from 'react';
import { ShieldCheck } from 'lucide-react';
import styles from './VerificationCard.module.scss';

const VerificationCard = ({ onViewDetails }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Verification</h2>
      
      <div className={styles.content}>
        <div className={styles.statusRow}>
          <ShieldCheck />
          <span>Verified User</span>
        </div>
        <p>Your identity has been verified</p>
      </div>

      <button className={styles.actionBtn} onClick={onViewDetails}>
        View Details
      </button>
    </div>
  );
};

export default VerificationCard;
