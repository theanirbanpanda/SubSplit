import React from 'react';
import { Camera, CheckCircle, MapPin, Calendar, Edit2, Layers, Wallet, CalendarDays, User } from 'lucide-react';
import styles from './ProfileHeader.module.scss';

const ProfileHeader = ({ onEditProfile }) => {
  return (
    <div className={styles.headerCard}>
      <div className={styles.leftSection}>
        <div className={styles.avatarWrapper}>
          <img 
            src="https://i.pravatar.cc/300?img=11" 
            alt="Anirban Das" 
            className={styles.avatar} 
          />
          <button className={styles.cameraBtn} aria-label="Change photo">
            <Camera />
          </button>
        </div>
        
        <div className={styles.userInfo}>
          <div className={styles.nameRow}>
            <h1>Anirban Das</h1>
            <CheckCircle className={styles.verifiedIcon} fill="currentColor" color="#111114" />
          </div>
          <div className={styles.email}>anirban.das@example.com</div>
          
          <div className={styles.metaInfo}>
            <div className={styles.metaItem}>
              <MapPin />
              <span>Kolkata, India</span>
            </div>
            <div className={styles.metaItem}>
              <Calendar />
              <span>Joined April 2024</span>
            </div>
          </div>
          
          <button className={styles.editBtn} onClick={onEditProfile}>
            <Edit2 /> Edit Profile
          </button>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.statItem}>
          <div className={`${styles.iconWrapper} ${styles.green}`}>
            <Layers />
          </div>
          <div className={styles.statLabel}>Active Subscriptions</div>
          <div className={styles.statValue}>8</div>
        </div>
        <div className={styles.statItem}>
          <div className={`${styles.iconWrapper} ${styles.purple}`}>
            <Wallet />
          </div>
          <div className={styles.statLabel}>Total Savings</div>
          <div className={styles.statValue}>₹12,480</div>
        </div>
        <div className={styles.statItem}>
          <div className={`${styles.iconWrapper} ${styles.yellow}`}>
            <CalendarDays />
          </div>
          <div className={styles.statLabel}>Total Orders</div>
          <div className={styles.statValue}>24</div>
        </div>
        <div className={styles.statItem}>
          <div className={`${styles.iconWrapper} ${styles.blue}`}>
            <User />
          </div>
          <div className={styles.statLabel}>Member Since</div>
          <div className={styles.statValue}>1 Year</div>
          <div className={styles.statSub}>on SubSplit</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
