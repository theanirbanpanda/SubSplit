import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMySubscriptions } from '../../groups/subscriptionsSlice';
import { MoreVertical, ChevronRight, Tv2, Music, Bot, Zap } from 'lucide-react';
import styles from './SubscriptionCarousel.module.scss';

const PROVIDER_ICONS = {
  netflix: { Icon: Tv2, color: '#e50914', bg: '#6b0005' },
  spotify: { Icon: Music, color: '#1db954', bg: '#0c5c27' },
  chatgpt: { Icon: Bot, color: '#10a37f', bg: '#0b5b47' },
  youtube: { Icon: Tv2, color: '#ff0000', bg: '#6b0000' },
};

const DEFAULT_THEME = { Icon: Zap, color: '#3b82f6', bg: '#1e3a8a' };

const MOCK_MY_SUBS = [
  { id: 'gpt-1', title: 'ChatGPT Plus', expiry: 'Expires in 18 days', color: '#10a37f', bg: '#0b5b47', action: 'Open', Icon: Bot },
  { id: 'nflx-1', title: 'Netflix Premium', expiry: 'Expires in 24 days', color: '#e50914', bg: '#6b0005', action: 'Manage', Icon: Tv2 },
  { id: 'sptf-1', title: 'Spotify Premium', expiry: 'Expires in 12 days', color: '#1db954', bg: '#0c5c27', action: 'Open', Icon: Music },
  { id: 'ytb-1', title: 'YouTube Premium', expiry: 'Expires in 30 days', color: '#ff0000', bg: '#6b0000', action: 'Open', Icon: Tv2 },
];

const SubscriptionCarousel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subscriptions } = useSelector((state) => state.subscriptions);

  useEffect(() => {
    if (!subscriptions || subscriptions.length === 0) {
      dispatch(fetchMySubscriptions());
    }
  }, [dispatch, subscriptions]);

  const displaySubs = subscriptions.length > 0
    ? subscriptions.map((sub) => {
        const prov = (sub.providerName || sub.title || '').toLowerCase();
        const theme = Object.keys(PROVIDER_ICONS).find(k => prov.includes(k))
          ? PROVIDER_ICONS[Object.keys(PROVIDER_ICONS).find(k => prov.includes(k))]
          : DEFAULT_THEME;

        return {
          id: sub.id,
          title: sub.title,
          expiry: sub.daysLeft != null ? `Expires in ${sub.daysLeft} days` : `Renews ${sub.renewalDate || 'soon'}`,
          action: 'Manage',
          ...theme,
        };
      })
    : MOCK_MY_SUBS;

  return (
    <div className={styles.carouselSection}>
      <div className={styles.headerRow}>
        <h3>My Subscriptions</h3>
        <span className={styles.viewAll} onClick={() => navigate('/app/groups')}>
          View all <ChevronRight size={14} />
        </span>
      </div>

      <div className={styles.carousel}>
        {displaySubs.map(sub => (
          <div key={sub.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.logoRow}>
                <div className={styles.logo} style={{ backgroundColor: sub.bg, color: sub.color }}>
                  <sub.Icon size={28} />
                </div>
                <div className={styles.textInfo}>
                  <span className={styles.title}>{sub.title}</span>
                  <span className={styles.expiry}>{sub.expiry}</span>
                </div>
              </div>
              <MoreVertical size={20} className={styles.menuBtn} />
            </div>
            
            <button 
              className={styles.actionBtn}
              onClick={() => navigate(`/app/groups`)}
            >
              {sub.action}
            </button>
          </div>
        ))}
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
          <div 
            onClick={() => navigate('/app/groups')}
            style={{
              width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            <ChevronRight size={20} color="#9ca3af" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCarousel;

