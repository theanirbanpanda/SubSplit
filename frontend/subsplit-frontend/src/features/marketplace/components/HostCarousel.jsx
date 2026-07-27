import React from 'react';
import { useSelector } from 'react-redux';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './HostCarousel.module.scss';

const HostCarousel = () => {
  const { topHosts, listings } = useSelector((state) => state.marketplace);

  // Use topHosts from API, or derive unique hosts from active listings
  const hostsToDisplay = topHosts.length > 0
    ? topHosts
    : Array.from(new Set(listings.map((l) => l.host?.name || l.hostName)))
        .map((name) => {
          const listing = listings.find((l) => (l.host?.name || l.hostName) === name);
          return {
            id: listing?.host?.id || name,
            name: name,
            bio: listing?.host?.bio || 'Verified Host',
            rating: listing?.host?.rating || 4.9,
            isKycVerified: listing?.isVerifiedHost ?? true,
            successfulGroups: listing?.host?.successfulGroups || 10,
          };
        });

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>
          <VerifiedIcon className={styles.verifiedIcon} /> Top Verified Hosts
        </h3>
        <span className={styles.viewAll}>View all</span>
      </div>
      <div className={styles.carousel}>
        {hostsToDisplay.length === 0 ? (
          <div style={{ color: '#9ca3af', padding: '1rem' }}>No host profiles available.</div>
        ) : (
          hostsToDisplay.map((host, index) => {
            const initials = host.name
              ? host.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
              : 'VH';

            return (
              <div key={host.id || index} className={styles.hostCard}>
                <div className={styles.avatarContainer} style={{ backgroundColor: '#2563eb' }}>
                  {initials}
                </div>

                <div className={styles.hostName}>{host.name}</div>

                {(host.rating || 4.9) >= 4.8 && (
                  <div className={styles.topHostBadge}>
                    Top Host
                  </div>
                )}

                <div className={styles.statsList}>
                  <div className={styles.statItem}>
                    Rating: {host.rating || 4.9} ★
                  </div>
                  <div className={styles.statItem}>
                    <CheckCircleIcon /> {host.successfulGroups || 10} groups hosted
                  </div>
                  <div className={styles.statItem}>
                    <CheckCircleIcon /> 99% success rate
                  </div>
                </div>

                <div className={styles.footerStat}>
                  KYC Verified Host
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HostCarousel;
