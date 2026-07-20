import React from 'react';
import { Box, Typography, Paper, Avatar, Grid, TextField, Button } from '@mui/material';
import { User, Mail, CreditCard, Shield } from 'lucide-react';

function Profile() {
  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Profile Settings</Typography>

      <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: '16px', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#2563eb', fontSize: '32px', fontWeight: 600 }}>U</Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>User SubSplit</Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>Member since July 2026</Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Full Name" 
              defaultValue="User SubSplit" 
              fullWidth 
              InputProps={{
                startAdornment: <User size={18} style={{marginRight: '8px', color: '#64748b'}} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Email Address" 
              defaultValue="user@subsplit.com" 
              fullWidth 
              InputProps={{
                startAdornment: <Mail size={18} style={{marginRight: '8px', color: '#64748b'}} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Default Currency" 
              defaultValue="USD ($)" 
              fullWidth 
              InputProps={{
                startAdornment: <CreditCard size={18} style={{marginRight: '8px', color: '#64748b'}} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Account Security" 
              defaultValue="Two-Factor Off" 
              disabled
              fullWidth 
              InputProps={{
                startAdornment: <Shield size={18} style={{marginRight: '8px', color: '#94a3b8'}} />
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#2563eb', borderRadius: '8px', textTransform: 'none', px: 4, py: 1.2, fontWeight: 600 }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Profile;
