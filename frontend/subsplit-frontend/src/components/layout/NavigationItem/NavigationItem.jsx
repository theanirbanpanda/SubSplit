import React from 'react';
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import styles from './NavigationItem.module.scss';

function NavigationItem({ item, isActive, onClick }) {
  const IconComponent = item.icon;

  return (
    <ListItem disablePadding className={styles.navItem}>
      {isActive && <Box className={styles.activeIndicator} />}
      <ListItemButton
        onClick={onClick}
        className={`${styles.navBtn} ${isActive ? styles.active : ''}`}
      >
        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
          {IconComponent && <IconComponent size={20} />}
        </ListItemIcon>
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{ fontSize: '14px', fontWeight: isActive ? 600 : 500 }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default NavigationItem;
