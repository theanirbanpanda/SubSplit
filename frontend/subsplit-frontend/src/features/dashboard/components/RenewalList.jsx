import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  const { subscriptions, loading } = useSelector((state) => state.subscriptions);

  // Derive renewal items from real subscription data
  const renewalItems = subscriptions
    .filter((s) => s.statusDisplay !== 'Cancelled' && s.statusDisplay !== 'Expired')
    .map((s) => {
      const prov = (s.providerName || s.title || '').toLowerCase();
      const key = Object.keys(PROVIDER_ICONS).find((k) => prov.includes(k));
      const { Icon, color, bg } = key ? PROVIDER_ICONS[key] : DEFAULT_ICON;
      const dateLabel =
        s.daysLeft != null && s.daysLeft <= 1
          ? 'Tomorrow'
          : s.renewalDate || (s.daysLeft != null ? `In ${s.daysLeft} days` : 'Upcoming');
      return { id: s.id, title: s.title, date: dateLabel, price: s.price != null ? `Rs.${s.price}` : null, Icon, color, bg };
    });

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
            <div key={item.id} className={styles.listItem}>
              <div className={styles.leftContent}>
                <div className={styles.logo} style={{ backgroundColor: item.bg, color: item.color }}>
                  <item.Icon size={18} />
                </div>
                <div className={styles.textInfo}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.date}>{item.date}</span>
                </div>
              </div>
              {item.price && <div className={styles.price}>{item.price}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenewalList;
