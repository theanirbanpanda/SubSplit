import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Shield, Wallet, RefreshCw, UserPlus, Headphones } from 'lucide-react';
import styles from './QuickActions.module.scss';

const ACTIONS = [
  { label: 'Browse Marketplace', Icon: Store, path: '/app/marketplace', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  { label: 'Host Subscription', Icon: Shield, path: '/app/host', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
  { label: 'Wallet', Icon: Wallet, path: '/app/settlements', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { label: 'Transactions', Icon: RefreshCw, path: '/app/expenses', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  { label: 'Invite Friends', Icon: UserPlus, path: '/app/profile', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { label: 'Support', Icon: Headphones, path: '/app/profile', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Quick Actions</h3>
      <div className={styles.grid}>
        {ACTIONS.map((action, idx) => (
          <div 
            key={idx} 
            className={styles.actionBtn} 
            onClick={() => navigate(action.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate(action.path); }}
          >
            <div className={styles.iconWrapper} style={{ backgroundColor: action.bg, color: action.color }}>
              <action.Icon />
            </div>
            <div className={styles.label}>{action.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
