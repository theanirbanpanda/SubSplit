import React from 'react';
import { Grid, Box, Card, CardContent, Typography, Button } from '@mui/material';
import { DollarSign, Users, Receipt, TrendingUp, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import PageContainer from '../../../components/layout/PageContainer';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import StatusChip from '../../../components/ui/StatusChip';

function Dashboard() {
  const stats = [
    { title: 'Total Owed to You', value: '$120.50', icon: ArrowUpRight, trend: '+12%', color: '#10b981', valueColor: '#065f46' },
    { title: 'Total You Owe', value: '$45.00', icon: ArrowDownRight, trend: '-5%', color: '#ef4444', valueColor: '#7f1d1d' },
    { title: 'Active Groups', value: '4', icon: Users, trend: '2 new', color: '#2563eb', valueColor: '#1e3a8a' },
    { title: 'Recent Expenses', value: '18', icon: Receipt, trend: 'This month', color: '#8b5cf6', valueColor: '#4c1d95' },
  ];

  const recentExpensesColumns = [
    { field: 'description', headerName: 'Description' },
    { field: 'group', headerName: 'Group' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'paidBy', headerName: 'Paid By' },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (row) => <StatusChip status={row.status} />
    },
  ];

  const recentExpensesData = [
    { id: 1, description: 'Weekend Grocery Trip', group: 'Apartment 4B', amount: '$84.50', paidBy: 'You', status: 'Pending' },
    { id: 2, description: 'Electricity Bill - July', group: 'Apartment 4B', amount: '$120.00', paidBy: 'Alex', status: 'Completed' },
    { id: 3, description: 'Dinner at Italian Bistro', group: 'Trip to Tahoe', amount: '$156.20', paidBy: 'Sarah', status: 'Pending' },
    { id: 4, description: 'Gasoline & Tolls', group: 'Trip to Tahoe', amount: '$45.00', paidBy: 'You', status: 'Settled' },
  ];

  return (
    <PageContainer
      title="Dashboard Overview"
      subtitle="Track your shared expenses, balances, and group activities."
      action={
        <Button variant="contained" startIcon={<Plus size={18} />} sx={{ borderRadius: 2, textTransform: 'none', px: 2.5 }}>
          Add Expense
        </Button>
      }
    >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
          <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              valueColor={stat.valueColor}
              trend={stat.trend}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
          Recent Activity
        </Typography>
        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <DataTable
              columns={recentExpensesColumns}
              data={recentExpensesData}
            />
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;
