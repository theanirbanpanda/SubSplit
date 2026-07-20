import React from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemAvatar, ListItemText, Avatar, Chip } from '@mui/material';
import { Check, CheckCircle2, ArrowRight } from 'lucide-react';

function Settlements() {
  const settlements = [
    { id: 1, from: 'You', to: 'Alex', amount: '$45.00', status: 'Pending', date: 'July 20, 2026' },
    { id: 2, from: 'Emma', to: 'You', amount: '$85.50', status: 'Completed', date: 'July 18, 2026' },
    { id: 3, from: 'Ryan', to: 'You', amount: '$35.00', status: 'Completed', date: 'July 15, 2026' }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Settlements</Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>Resolve your balance sheets.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Check size={18} />}
          sx={{ bgcolor: '#2563eb', borderRadius: '8px', textTransform: 'none', px: 2.5, py: 1, fontWeight: 600 }}
        >
          Settle Up
        </Button>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <List sx={{ p: 0 }}>
          {settlements.map((settlement, index) => (
            <React.Fragment key={settlement.id}>
              <ListItem sx={{ py: 2, px: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: settlement.status === 'Completed' ? '#dcfce7' : '#fef3c7', color: settlement.status === 'Completed' ? '#16a34a' : '#d97706' }}>
                      {settlement.status === 'Completed' ? <CheckCircle2 size={20} /> : <ArrowRight size={20} />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{settlement.from}</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>paid</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2563eb' }}>{settlement.to}</Typography>
                      </Box>
                    }
                    secondary={settlement.date}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {settlement.amount}
                  </Typography>
                  <Chip 
                    label={settlement.status} 
                    size="small"
                    sx={{ 
                      bgcolor: settlement.status === 'Completed' ? '#dcfce7' : '#fef3c7', 
                      color: settlement.status === 'Completed' ? '#15803d' : '#b45309',
                      fontWeight: 600
                    }} 
                  />
                </Box>
              </ListItem>
              {index < settlements.length - 1 && <Paper sx={{ borderBottom: '1px solid #e2e8f0' }} elevation={0} />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default Settlements;
