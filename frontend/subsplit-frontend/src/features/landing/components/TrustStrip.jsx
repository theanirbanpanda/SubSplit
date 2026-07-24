import React from 'react';
import { Star } from 'lucide-react';
import styles from './TrustStrip.module.scss';

const AVATAR_COLORS = [
  '#3b82f6', '#22c55e', '#ef4444', '#f59e0b',
  '#a855f7', '#06b6d4', '#f43f5e', '#14b8a6',
];

const AVATARS = [
  { initials: 'AK', color: AVATAR_COLORS[0] },
  { initials: 'RS', color: AVATAR_COLORS[1] },
  { initials: 'PM', color: AVATAR_COLORS[2] },
  { initials: 'SJ', color: AVATAR_COLORS[3] },
  { initials: 'NK', color: AVATAR_COLORS[4] },
  { initials: 'VD', color: AVATAR_COLORS[5] },
  { initials: 'AR', color: AVATAR_COLORS[6] },
  { initials: 'DK', color: AVATAR_COLORS[7] },
];

function TrustStrip() {
  return (
    <section className={styles.trustStrip} aria-label="Social proof">
      <div className={styles.container}>
        <h2 className={styles.heading}>Trusted by Thousands of Smart Users</h2>

        <div className={styles.avatarRow}>
          {AVATARS.map(({ initials, color }) => (
            <div
              key={initials}
              className={styles.avatar}
              style={{ background: color }}
              aria-hidden="true"
            >
              {initials}
            </div>
          ))}
        </div>

        <div className={styles.ratingRow}>
          <div className={styles.stars} aria-label="5 star rating">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
            ))}
          </div>
          <span className={styles.ratingText}>
            <span className={styles.ratingBold}>4.9/5</span> from 12,000+ users
          </span>
        </div>
      </div>
    </section>
  );
}

export default TrustStrip;
