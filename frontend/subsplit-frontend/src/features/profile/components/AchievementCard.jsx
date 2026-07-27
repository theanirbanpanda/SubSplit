import React from 'react';
import { Leaf, Shield, Award } from 'lucide-react';
import { Tooltip } from '@mui/material';
import styles from './AchievementCard.module.scss';

const AchievementCard = () => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Achievements</h2>

      <div className={styles.badgesRow}>
        <Tooltip title="Joined in the first 3 months" arrow placement="top">
          <div className={`${styles.badgeItem} ${styles.green}`}>
            <div className={styles.hexContainer}>
              <div className={styles.hexInner}>
                <Leaf />
              </div>
            </div>
            <div className={styles.badgeTitle}>Early Adopter</div>
            <div className={styles.badgeSub}>Apr 2024</div>
          </div>
        </Tooltip>

        <Tooltip title="Successfully hosted 10+ orders" arrow placement="top">
          <div className={`${styles.badgeItem} ${styles.purple}`}>
            <div className={styles.hexContainer}>
              <div className={styles.hexInner}>
                <Shield />
              </div>
            </div>
            <div className={styles.badgeTitle}>Trusted Member</div>
            <div className={styles.badgeSub}>10 Orders</div>
          </div>
        </Tooltip>

        <Tooltip title="Saved more than ₹10,000" arrow placement="top">
          <div className={`${styles.badgeItem} ${styles.yellow}`}>
            <div className={styles.hexContainer}>
              <div className={styles.hexInner}>
                <Award />
              </div>
            </div>
            <div className={styles.badgeTitle}>Top Saver</div>
            <div className={styles.badgeSub}>₹10K Saved</div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default AchievementCard;
