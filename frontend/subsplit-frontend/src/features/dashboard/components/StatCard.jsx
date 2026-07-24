import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StatCard.module.scss';

const StatCard = ({ title, value, icon: Icon, colorClass, linkTo }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(linkTo)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') navigate(linkTo); }}>
      <div className={`${styles.iconWrapper} ${styles[colorClass]}`}>
        <Icon />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
};

export default StatCard;
