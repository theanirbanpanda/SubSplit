import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, fetchMarketplaceListings } from '../marketplaceSlice';
import GridViewIcon from '@mui/icons-material/GridView';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TheatersIcon from '@mui/icons-material/Theaters';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloudIcon from '@mui/icons-material/Cloud';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GamesIcon from '@mui/icons-material/Games';
import styles from './CategoryChips.module.scss';

const getIconForCategory = (name) => {
  switch (name?.toLowerCase()) {
    case 'ott':
    case 'entertainment':
      return <TheatersIcon />;
    case 'music':
      return <MusicNoteIcon />;
    case 'ai tools':
      return <AutoAwesomeIcon />;
    case 'productivity':
      return <AssignmentIcon />;
    case 'cloud storage':
      return <CloudIcon />;
    case 'gaming':
      return <GamesIcon />;
    case 'learning':
      return <MenuBookIcon />;
    default:
      return <GridViewIcon />;
  }
};

const CategoryChips = () => {
  const dispatch = useDispatch();
  const { categories: apiCategories, filters } = useSelector((state) => state.marketplace);

  const activeCategory = filters?.category || 'All';

  const allCategories = [
    { id: 'all', name: 'All' },
    ...apiCategories.map((c) => ({ id: c.id, name: c.name, listingCount: c.listingCount })),
  ];

  const handleCategoryClick = (categoryName) => {
    dispatch(setFilter({ category: categoryName }));
    dispatch(fetchMarketplaceListings({ category: categoryName === 'All' ? null : categoryName }));
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Quick Categories</h3>
      <div className={styles.chipsContainer}>
        {allCategories.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <div
              key={cat.id}
              className={`${styles.chip} ${isActive ? styles.active : ''}`}
              onClick={() => handleCategoryClick(cat.name)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.iconWrapper}>
                {getIconForCategory(cat.name)}
              </div>
              <span>{cat.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChips;
