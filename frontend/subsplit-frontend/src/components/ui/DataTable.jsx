import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material';
import EmptyState from './EmptyState';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title="No Records" description={emptyMessage} />;
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}
    >
      <Table>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell
                key={col.key || index}
                align={col.align || 'left'}
                sx={{ fontWeight: 600, color: '#475569', ...col.headerSx }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={row.id || rowIndex}
              hover
              onClick={() => onRowClick && onRowClick(row)}
              sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((col, colIndex) => (
                <TableCell
                  key={col.key || colIndex}
                  align={col.align || 'left'}
                  sx={col.sx}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
