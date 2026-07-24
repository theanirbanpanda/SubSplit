import React from 'react';
import GridViewIcon from '@mui/icons-material/GridView';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TheatersIcon from '@mui/icons-material/Theaters';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CodeIcon from '@mui/icons-material/Code';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CloudIcon from '@mui/icons-material/Cloud';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import styles from './CategoryChips.module.scss';

const categories = [
  { name: 'All', icon: <GridViewIcon /> },
  { name: 'AI Tools', icon: <AutoAwesomeIcon /> },
  { name: 'Entertainment', icon: <TheatersIcon /> },
  { name: 'Music', icon: <MusicNoteIcon /> },
  { name: 'Productivity', icon: <AssignmentIcon /> },
  { name: 'Design', icon: <ColorLensIcon /> },
  { name: 'Development', icon: <CodeIcon /> },
  { name: 'Learning', icon: <MenuBookIcon /> },
  { name: 'Cloud Storage', icon: <CloudIcon /> },
  { name: 'More', icon: <MoreHorizIcon /> },
];

const CategoryChips = () => {
  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Quick Categories</h3>
      <div className={styles.chipsContainer}>
        {categories.map((category, index) => (
          <div 
            key={category.name} 
            className={`${styles.chip} ${index === 0 ? styles.active : ''}`}
          >
            <div className={styles.iconWrapper}>
              {category.icon}
            </div>
            <span>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChips;
