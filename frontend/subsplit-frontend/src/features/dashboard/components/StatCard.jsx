import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StatCard.module.scss';

const StatCard = ({ title, value, icon: Icon, colorClass, linkTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!linkTo) return;
    if (linkTo.startsWith('#')) {
      const el = document.querySelector(linkTo);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(linkTo);
    }
  };

  return (
    <div className={styles.card} onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}>

      <div className={`${styles.iconWrapper} ${styles[colorClass]}`}>
        <Icon />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
};

export default StatCard;
