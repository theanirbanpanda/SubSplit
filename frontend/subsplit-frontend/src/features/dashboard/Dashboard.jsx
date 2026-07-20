import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Card, 
  CardContent, 
  Avatar, 
  Chip 
} from '@mui/material';
import { Plus, Users, CreditCard } from 'lucide-react';

function Dashboard() {
  const groups = [
    { id: 1, name: 'Roommates 2026', balance: '$45.00', status: 'you owe', color: '#f59e0b' },
    { id: 2, name: 'Road Trip to LA', balance: '$120.50', status: 'you are owed', color: '#10b981' }
  ];

  const expenses = [
    { id: 1, desc: 'Groceries', group: 'Roommates 2026', amount: '$85.40', date: 'Today', paidBy: 'Alex' },
    { id: 2, desc: 'Gasoline', group: 'Road Trip to LA', amount: '$60.00', date: 'Yesterday', paidBy: 'You' }
  ];

  return (
    <Box>
      <Box className="page-header">
        <Box>
          <Typography variant="h4" className="page-title">Dashboard</Typography>
          <Typography variant="body2" className="page-subtitle">Welcome back to your expense overview.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          className="btn-primary"
        >
          Add Expense
        </Button>
      </Box>

      <Grid container spacing={3} className="mb-4">
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} className="stat-card">
            <Typography variant="caption" className="stat-title" sx={{ color: '#10b981' }}>You are owed</Typography>
            <Typography variant="h4" className="stat-value" sx={{ color: '#065f46' }}>$120.50</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} className="stat-card">
            <Typography variant="caption" className="stat-title" sx={{ color: '#f59e0b' }}>You owe</Typography>
            <Typography variant="h4" className="stat-value" sx={{ color: '#9a3412' }}>$45.00</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} className="stat-card">
            <Typography variant="caption" className="stat-title" sx={{ color: '#6366f1' }}>Total Balance</Typography>
            <Typography variant="h4" className="stat-value" sx={{ color: '#3730a3' }}>+$75.50</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className="section-title">Active Groups</Typography>
          <Grid container spacing={2}>
            {groups.map((group) => (
              <Grid item xs={12} key={group.id}>
                <Card elevation={0} className="card-flat hoverable">
                  <CardContent className="card-content-flex">
                    <Box className="flex-center-y">
                      <Avatar sx={{ bgcolor: group.color }}>
                        <Users size={20} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" className="font-semibold">{group.name}</Typography>
                        <Typography variant="body2" className="text-muted">3 members</Typography>
                      </Box>
                    </Box>
                    <Box className="text-right">
                      <Typography variant="subtitle1" className="font-bold">{group.balance}</Typography>
                      <Chip label={group.status} size="small" className="font-semibold" sx={{ fontSize: '10px' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" className="section-title">Recent Expenses</Typography>
          <Grid container spacing={2}>
            {expenses.map((expense) => (
              <Grid item xs={12} key={expense.id}>
                <Card elevation={0} className="card-flat">
                  <CardContent className="card-content-flex">
                    <Box className="flex-center-y">
                      <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb' }}>
                        <CreditCard size={20} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" className="font-semibold">{expense.desc}</Typography>
                        <Typography variant="body2" className="text-muted">Paid by {expense.paidBy} • {expense.group}</Typography>
                      </Box>
                    </Box>
                    <Box className="text-right">
                      <Typography variant="subtitle1" className="font-bold">{expense.amount}</Typography>
                      <Typography variant="caption" className="text-muted">{expense.date}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
