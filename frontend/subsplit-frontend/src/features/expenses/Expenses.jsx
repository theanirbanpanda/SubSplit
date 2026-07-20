import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Plus } from 'lucide-react';

function Expenses() {
  const expenses = [
    { id: 1, desc: 'Groceries', group: 'Roommates 2026', amount: '$85.40', date: 'July 20, 2026', paidBy: 'Alex' },
    { id: 2, desc: 'Gasoline', group: 'Road Trip to LA', amount: '$60.00', date: 'July 19, 2026', paidBy: 'You' },
    { id: 3, desc: 'Movie Tickets', group: 'Road Trip to LA', amount: '$35.00', date: 'July 18, 2026', paidBy: 'Emma' }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Expenses</Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>Manage your shared logs.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          sx={{ bgcolor: '#2563eb', borderRadius: '8px', textTransform: 'none', px: 2.5, py: 1, fontWeight: 600 }}
        >
          Add Expense
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Group</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Paid By</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{expense.desc}</TableCell>
                <TableCell>{expense.group}</TableCell>
                <TableCell>{expense.paidBy}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{expense.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Expenses;
