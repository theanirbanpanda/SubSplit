import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Tv2, Bot } from 'lucide-react';
import styles from './RenewalList.module.scss';

const MOCK_RENEWALS = [
  { id: '1', title: 'Spotify Premium', date: 'Tomorrow', price: '₹59', Icon: Music, color: '#1db954', bg: '#0c5c27' },
  { id: '2', title: 'Netflix Premium', date: '28 July 2026', price: '₹149', Icon: Tv2, color: '#e50914', bg: '#6b0005' },
  { id: '3', title: 'ChatGPT Plus', date: '02 Aug 2026', price: '₹399', Icon: Bot, color: '#10a37f', bg: '#0b5b47' },
];

const RenewalList = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3>Upcoming Renewals</h3>
        <span className={styles.viewAll} onClick={() => navigate('/app/settlements')}>
          View all
        </span>
      </div>

      <div className={styles.list}>
        {MOCK_RENEWALS.map(item => (
          <div key={item.id} className={styles.listItem} onClick={() => navigate(`/app/groups/${item.id}`)} style={{ cursor: 'pointer' }}>
            <div className={styles.leftContent}>
              <div className={styles.logo} style={{ backgroundColor: item.bg, color: item.color }}>
                <item.Icon size={18} />
              </div>
              <div className={styles.textInfo}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.date}>{item.date}</span>
              </div>
            </div>
            <div className={styles.price}>{item.price}</div>
          </div>
        ))}
      </div>

      <button className={styles.actionBtn} onClick={() => navigate('/app/settlements')}>
        View all renewals
      </button>
    </div>
  );
};

export default RenewalList;
