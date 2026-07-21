import React from 'react';
import { Breadcrumbs, Link as MuiLink, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '../../../config/routes';
import styles from './Breadcrumb.module.scss';

const Breadcrumb = ({ items = null, sx = {} }) => {
  const location = useLocation();

  const generateBreadcrumbs = () => {
    if (items) return items;

    const pathnames = location.pathname.split('/').filter((x) => x);
    const crumbs = [{ title: 'Home', path: ROUTES.DASHBOARD }];

    let currentPath = '';
    pathnames.forEach((name) => {
      currentPath += `/${name}`;
      const title = name.charAt(0).toUpperCase() + name.slice(1);
      crumbs.push({ title, path: currentPath });
    });

    return crumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <Box className={styles.breadcrumbWrapper} sx={sx}>
      <Breadcrumbs
        separator={<ChevronRight size={14} style={{ color: '#94a3b8' }} />}
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return isLast ? (
            <Typography
              key={crumb.path}
              variant="body2"
              sx={{ color: '#1e293b', fontWeight: 600, fontSize: '13px' }}
            >
              {crumb.title}
            </Typography>
          ) : (
            <MuiLink
              key={crumb.path}
              component={RouterLink}
              to={crumb.path}
              underline="hover"
              sx={{
                color: '#64748b',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {index === 0 && <Home size={14} />}
              {crumb.title}
            </MuiLink>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
