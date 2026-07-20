import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Avatar } from '@mui/material';
import { Plus, Users } from 'lucide-react';

function Groups() {
  const groups = [
    { id: 1, name: 'Roommates 2026', desc: 'Flat rent, electricity bills and internet', members: 3, balance: '-$45.00', color: '#f59e0b' },
    { id: 2, name: 'Road Trip to LA', desc: 'Gasoline, snacks and hotel stay', members: 4, balance: '+$120.50', color: '#10b981' },
    { id: 3, name: 'Sunday Dinner', desc: 'Food expenses on dinners', members: 5, balance: 'Settled', color: '#6366f1' }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Groups</Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>Organize splits with your friends.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          sx={{ bgcolor: '#2563eb', borderRadius: '8px', textTransform: 'none', px: 2.5, py: 1, fontWeight: 600 }}
        >
          Create Group
        </Button>
      </Box>

      <Grid container spacing={3}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: group.color, width: 44, height: 44 }}>
                    <Users size={22} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{group.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>{group.members} members</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3, minHeight: '40px' }}>
                  {group.desc}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc', p: 1.5, borderRadius: '8px' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>Your status</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: group.balance.startsWith('+') ? '#10b981' : group.balance.startsWith('-') ? '#ef4444' : '#64748b' }}>
                    {group.balance}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Groups;
