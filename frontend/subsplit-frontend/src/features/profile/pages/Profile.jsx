import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Card, CardContent, Typography, Avatar, Button, Grid, TextField } from '@mui/material';
import { User, Mail, Phone, Shield, LogOut, Save } from 'lucide-react';
import PageContainer from '../../../components/layout/PageContainer';
import { logoutUser } from '../../auth/authSlice';

function Profile() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <PageContainer
            title="User Profile"
            subtitle="Manage your personal information and security settings."
            action={
                <Button variant="outlined" color="error" startIcon={<LogOut size={18} />} onClick={handleLogout} sx={{ borderRadius: 2, textTransform: 'none', px: 2.5 }}>
                    Sign Out
                </Button>
            }
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, textAlign: 'center', p: 3 }}>
                        <CardContent>
                            <Avatar
                                sx={{
                                    width: 96,
                                    height: 96,
                                    mx: 'auto',
                                    mb: 2,
                                    bgcolor: '#2563eb',
                                    fontSize: 36,
                                    fontWeight: 700,
                                }}
                            >
                                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                {user?.fullName || 'User Profile'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                                {user?.email || 'user@example.com'}
                            </Typography>

                            <Button variant="contained" size="small" sx={{ borderRadius: 2, textTransform: 'none' }}>
                                Change Avatar
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, p: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0f172a' }}>
                                Account Details
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        defaultValue={user?.fullName || ''}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        defaultValue={user?.email || ''}
                                        variant="outlined"
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        defaultValue={user?.phone || ''}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Role"
                                        defaultValue={user?.role || 'USER'}
                                        variant="outlined"
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" startIcon={<Save size={18} />} sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
                                    Save Changes
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </PageContainer>
    );
}

export default Profile;
