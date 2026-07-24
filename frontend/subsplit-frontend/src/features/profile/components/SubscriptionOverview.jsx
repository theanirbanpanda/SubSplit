import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Bot, Tv2, Music } from 'lucide-react';
import styles from './SubscriptionOverview.module.scss';

const MOCK_SUBS = [
  { id: '1', title: 'ChatGPT Plus', expiry: 'Expires in 18 days', price: '₹399', Icon: Bot, color: '#10a37f', bg: '#0b5b47' },
  { id: '2', title: 'Netflix Premium', expiry: 'Expires in 24 days', price: '₹149', Icon: Tv2, color: '#e50914', bg: '#6b0005' },
  { id: '3', title: 'Spotify Premium', expiry: 'Expires in 12 days', price: '₹59', Icon: Music, color: '#1db954', bg: '#0c5c27' },
  { id: '4', title: 'YouTube Premium', expiry: 'Expires in 30 days', price: '₹129', Icon: Tv2, color: '#ff0000', bg: '#6b0000' },
];

const SubscriptionMiniCard = ({ sub, onClick }) => (
  <div 
    className={styles.miniCard} 
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
  >
    <div className={styles.cardTopRow}>
      <div className={styles.logo} style={{ backgroundColor: sub.bg, color: sub.color }}>
        <sub.Icon />
      </div>
      <div className={styles.textInfo}>
        <div className={styles.title}>{sub.title}</div>
        <div className={styles.expiry}>{sub.expiry}</div>
      </div>
    </div>
    <div className={styles.priceTag}>
      <strong>{sub.price}</strong> / month
    </div>
  </div>
);

const SubscriptionOverview = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>My Subscriptions Overview</h3>
        <span className={styles.viewAll} onClick={() => navigate('/app/groups')}>
          View all <ChevronRight />
        </span>
      </div>

      <div className={styles.cardsContainer}>
        {MOCK_SUBS.map(sub => (
          <SubscriptionMiniCard 
            key={sub.id} 
            sub={sub} 
            onClick={() => navigate(`/app/groups/${sub.id}`)} 
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionOverview;
