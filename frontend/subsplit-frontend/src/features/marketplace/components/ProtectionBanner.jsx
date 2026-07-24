import React from 'react';
import ShieldCheckIcon from '@mui/icons-material/ShieldOutlined'; // Using outlined shield for banner
import styles from './ProtectionBanner.module.scss';

const ProtectionBanner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <ShieldCheckIcon />
        </div>
        <div className={styles.text}>
          <h4>We've got your back!</h4>
          <p>
            All payments are protected. Get full refund if you face any issues with access or removal.
          </p>
        </div>
      </div>
      <button className={styles.actionBtn}>How Protection Works</button>
    </div>
  );
};

export default ProtectionBanner;
