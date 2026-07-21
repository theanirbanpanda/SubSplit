import React from 'react';
import { Box, Container } from '@mui/material';
import PageHeader from '../../ui/PageHeader';
import Breadcrumb from '../Breadcrumb';
import styles from './PageContainer.module.scss';

const PageContainer = ({
  children,
  title,
  subtitle,
  action,
  showBreadcrumb = true,
  maxWidth = 'lg',
  sx = {},
}) => {
  return (
    <Container maxWidth={maxWidth} disableGutters className={styles.container} sx={sx}>
      {showBreadcrumb && <Breadcrumb />}
      {title && <PageHeader title={title} subtitle={subtitle} action={action} />}
      <Box>{children}</Box>
    </Container>
  );
};

export default PageContainer;
