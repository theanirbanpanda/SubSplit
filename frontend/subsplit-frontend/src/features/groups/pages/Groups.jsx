import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import { Plus, Users, ArrowRight } from 'lucide-react';
import PageContainer from '../../../components/layout/PageContainer';
import SearchBox from '../../../components/ui/SearchBox';

function Groups() {
    const [searchTerm, setSearchTerm] = useState('');

    const groupsList = [
        { id: 1, name: 'Apartment 4B', membersCount: 4, balance: 'You are owed $42.50', isOwed: true, color: '#2563eb', category: 'Home' },
        { id: 2, name: 'Trip to Tahoe', membersCount: 5, balance: 'You owe $15.00', isOwed: false, color: '#10b981', category: 'Travel' },
        { id: 3, name: 'Weekend BBQ Party', membersCount: 8, balance: 'Settled up', isOwed: null, color: '#f59e0b', category: 'Event' },
        { id: 4, name: 'Work Lunch Club', membersCount: 3, balance: 'You are owed $18.00', isOwed: true, color: '#8b5cf6', category: 'Work' },
    ];

    const filteredGroups = groupsList.filter((g) =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageContainer
            title="Groups"
            subtitle="Manage your shared groups and track balances."
            action={
                <Button variant="contained" startIcon={<Plus size={18} />} sx={{ borderRadius: 2, textTransform: 'none', px: 2.5 }}>
                    Create Group
                </Button>
            }
        >
            <Box sx={{ mb: 3, maxWidth: 360 }}>
                <SearchBox
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            <Grid container spacing={3}>
                {filteredGroups.map((group) => (
                    <Grid item xs={12} sm={6} md={4} key={group.id}>
                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid #e2e8f0',
                                borderRadius: 3,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
                                    borderColor: '#cbd5e1',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2.5,
                                            bgcolor: `${group.color}15`,
                                            color: group.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Users size={24} />
                                    </Box>
                                    <Chip label={group.category} size="small" sx={{ borderRadius: 1.5, fontWeight: 600, fontSize: '12px' }} />
                                </Box>

                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#0f172a' }}>
                                    {group.name}
                                </Typography>

                                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                                    {group.membersCount} active members
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px dashed #e2e8f0' }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: 700,
                                            color: group.isOwed === true ? '#10b981' : group.isOwed === false ? '#ef4444' : '#64748b'
                                        }}
                                    >
                                        {group.balance}
                                    </Typography>

                                    <Button size="small" endIcon={<ArrowRight size={16} />} sx={{ textTransform: 'none', fontWeight: 600 }}>
                                        View
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </PageContainer>
    );
}

export default Groups;
