import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { MessageSquare } from 'lucide-react';

function Messages() {
  return (
    <Box sx={{ py: 4, px: 0, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <Paper elevation={0} sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#111114', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <MessageSquare size={32} color="#22c55e" />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#f3f4f6' }}>
          Messages
        </Typography>
        <Typography variant="body1" sx={{ color: '#9ca3af', textAlign: 'center', maxWidth: 400 }}>
          Your conversation history will appear here. Start a chat with a host or a group member to see messages.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Messages;
