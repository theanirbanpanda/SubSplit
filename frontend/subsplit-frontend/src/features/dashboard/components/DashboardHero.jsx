import React from 'react';
import { Leaf, Armchair } from 'lucide-react'; // Mocking the illustration
import styles from './DashboardHero.module.scss';

const DashboardHero = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.bgDecoration}></div>
      
      <div className={styles.textSection}>
        <h1>Good evening, Anirban <span role="img" aria-label="wave">👋</span></h1>
        <p>You have <strong>8</strong> active subscriptions</p>
        <p>You've saved <strong>₹1,240</strong> this month</p>
      </div>

      <div className={styles.illustrationSection}>
        {/* Simple mock illustration using icons and shapes */}
        <div style={{ position: 'relative' }}>
          <Leaf size={48} style={{ position: 'absolute', bottom: 10, left: -20 }} />
          <div style={{ 
            width: 30, 
            height: 40, 
            border: '2px solid rgba(255,255,255,0.1)', 
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            position: 'absolute',
            bottom: 0,
            left: -10
          }}></div>
        </div>
        <Armchair size={80} color="rgba(255, 255, 255, 0.4)" strokeWidth={1} />
      </div>
    </div>
  );
};

export default DashboardHero;
