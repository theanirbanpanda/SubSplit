import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Plus } from 'lucide-react';
import styles from './Expenses.module.scss';

function Expenses() {
  const expenses = [
    { id: 1, desc: 'Groceries', group: 'Roommates 2026', amount: '₹850', date: 'July 20, 2026', paidBy: 'Alex' },
    { id: 2, desc: 'Gasoline', group: 'Road Trip to LA', amount: '₹600', date: 'July 19, 2026', paidBy: 'You' },
    { id: 3, desc: 'Movie Tickets', group: 'Road Trip to LA', amount: '₹350', date: 'July 18, 2026', paidBy: 'Emma' }
  ];

  return (
    <div className={styles.expensesContainer}>
      <div className={styles.headerSection}>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>Expenses & Shared Logs</h1>
          <p className={styles.subtitle}>Track shared subscription costs and group expense logs.</p>
        </div>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', borderRadius: '0.75rem', textTransform: 'none', px: 2.5, py: 1, fontWeight: 700 }}
        >
          Add Expense
        </Button>
      </div>

      <TableContainer component={Paper} elevation={0} sx={{ background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', width: '100%' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#1c1e24' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#f3f4f6' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f3f4f6' }}>Group</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f3f4f6' }}>Paid By</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f3f4f6' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#f3f4f6' }} align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                <TableCell sx={{ fontWeight: 700, color: '#f3f4f6' }}>{expense.desc}</TableCell>
                <TableCell sx={{ color: '#9ca3af' }}>{expense.group}</TableCell>
                <TableCell sx={{ color: '#9ca3af' }}>{expense.paidBy}</TableCell>
                <TableCell sx={{ color: '#9ca3af' }}>{expense.date}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#22c55e' }}>{expense.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Expenses;

