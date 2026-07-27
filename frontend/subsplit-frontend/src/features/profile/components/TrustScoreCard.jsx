import React from 'react';
import { Star, ShieldCheck, MessageCircle, ThumbsUp, CheckCircle2 } from 'lucide-react';
import styles from './TrustScoreCard.module.scss';

const TrustScoreCard = () => {
  // 4.8 out of 5 is 96%
  // Circumference of semi-circle with r=50 is ~157. 
  // Dashoffset for 96% is 157 - (157 * 0.96) = ~6
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Trust Score</h2>

      <div className={styles.content}>
        <div className={styles.leftSection}>
          <div className={styles.gaugeContainer} style={{ width: 120, height: 60, position: 'relative' }}>
            <svg width="120" height="65" viewBox="0 0 120 65" style={{ position: 'absolute', top: 0, left: 0 }}>
              <path 
                d="M 10,60 A 50,50 0 0,1 110,60" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.08)" 
                strokeWidth="10" 
                strokeLinecap="round" 
              />
              <path 
                d="M 10,60 A 50,50 0 0,1 110,60" 
                fill="none" 
                stroke="#22c55e" 
                strokeWidth="10" 
                strokeLinecap="round"
                strokeDasharray="157"
                strokeDashoffset="6"
              />
            </svg>
          </div>
          
          <div className={styles.scoreWrapper}>
            <div className={styles.scoreValue}>
              4.8 <Star fill="#f59e0b" color="#f59e0b" />
            </div>
            <div className={styles.scoreLabel}>Excellent</div>
          </div>
          <div className={styles.reviewsCount}>Based on 32 reviews</div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.metricRow}>
            <div className={styles.metricLeft}>
              <ShieldCheck /> Reliability
            </div>
            <div className={styles.metricScore}>4.9/5</div>
          </div>
          <div className={styles.metricRow}>
            <div className={styles.metricLeft}>
              <MessageCircle /> Communication
            </div>
            <div className={styles.metricScore}>4.8/5</div>
          </div>
          <div className={styles.metricRow}>
            <div className={styles.metricLeft}>
              <ThumbsUp /> Satisfaction
            </div>
            <div className={styles.metricScore}>4.8/5</div>
          </div>
          <div className={styles.metricRow}>
            <div className={styles.metricLeft}>
              <CheckCircle2 /> On-time Payment
            </div>
            <div className={styles.metricScore}>4.9/5</div>
          </div>
        </div>
      </div>

      <button className={styles.actionBtn}>
        View All Reviews
      </button>
    </div>
  );
};

export default TrustScoreCard;
