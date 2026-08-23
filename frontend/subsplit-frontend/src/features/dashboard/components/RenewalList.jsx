import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../marketplace/marketplaceSlice';
import { Tv2, Music, Bot, Zap } from 'lucide-react';
import styles from './RenewalList.module.scss';

const PROVIDER_ICONS = {
  netflix: { Icon: Tv2, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  spotify: { Icon: Music, color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  chatgpt: { Icon: Bot, color: '#14b8a6', bg: 'rgba(20,184,166,0.15)' },
};
const DEFAULT_ICON = { Icon: Zap, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' };

const RenewalList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subscriptions, loading } = useSelector((state) => state.subscriptions);

  // Derive renewal items from real subscription data
  const renewalItems = subscriptions
    .filter((s) => s.statusDisplay !== 'Cancelled' && s.statusDisplay !== 'Expired')
    .map((s) => {
      const prov = (s.providerName || s.title || '').toLowerCase();
      const key = Object.keys(PROVIDER_ICONS).find((k) => prov.includes(k));
      const { Icon, color, bg } = key ? PROVIDER_ICONS[key] : DEFAULT_ICON;
      let dateLabel = 'Upcoming';
      if (s.daysLeft != null) {
        if (s.daysLeft <= 1) dateLabel = 'Ends tomorrow';
        else dateLabel = `Ends in ${s.daysLeft} days`;
      } else if (s.renewalDate) {
        dateLabel = `Ends on ${s.renewalDate}`;
      }
      return { id: s.id, title: s.title, providerName: prov || s.title, date: dateLabel, Icon, color, bg };
    });

  const handleItemClick = (item) => {
    dispatch(setFilter({ search: item.providerName, category: 'All', priceRangeString: 'All Prices', trendingOnly: false }));
    navigate('/app/marketplace');
  };

  if (loading && renewalItems.length === 0) {
    return (
      <div className={styles.section}>
        <div className={styles.headerRow}>
          <h3>Upcoming Renewals</h3>
        </div>
        <p className={styles.emptyMsg}>Loading…</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>Upcoming Renewals</h3>
        <span className={styles.viewAll} onClick={() => navigate('/app/settlements')}>
          View all
        </span>
      </div>

      {renewalItems.length === 0 ? (
        <p className={styles.emptyMsg}>No upcoming renewals.</p>
      ) : (
        <div className={styles.list}>
          {renewalItems.map((item) => (
            <div 
              key={item.id} 
              className={styles.listItem}
              onClick={() => handleItemClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.leftContent}>
                <div className={styles.logo} style={{ backgroundColor: item.bg, color: item.color }}>
                  <item.Icon size={18} />
                </div>
                <div className={styles.textInfo}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.date}>{item.date}</span>
                </div>
              </div>
              <div className={styles.rightContent}>
                <button 
                  className={styles.renewBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(item);
                  }}
                >
                  Check Listings
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenewalList;
