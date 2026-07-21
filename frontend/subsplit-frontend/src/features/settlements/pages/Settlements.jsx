import React from 'react';
import { Box, Card, CardContent, Button, Typography, Grid } from '@mui/material';
import { CheckCircle2, DollarSign, Clock, ArrowRight } from 'lucide-react';
import PageContainer from '../../../components/layout/PageContainer';
import DataTable from '../../../components/ui/DataTable';
import StatusChip from '../../../components/ui/StatusChip';

function Settlements() {
    const settlementsColumns = [
        { field: 'date', headerName: 'Date' },
        { field: 'payer', headerName: 'Payer' },
        { field: 'payee', headerName: 'Recipient' },
        { field: 'amount', headerName: 'Amount' },
        {
            field: 'status',
            headerName: 'Status',
            renderCell: (row) => <StatusChip status={row.status} />
        },
    ];

    const settlementsData = [
        { id: 1, date: '2026-07-20', payer: 'Alex Johnson', payee: 'You', amount: '$42.50', status: 'Completed' },
        { id: 2, date: '2026-07-18', payer: 'You', payee: 'Sarah Connor', amount: '$15.00', status: 'Pending' },
        { id: 3, date: '2026-07-10', payer: 'Michael Scott', payee: 'You', amount: '$18.00', status: 'Completed' },
    ];

    return (
        <PageContainer
            title="Settlements"
            subtitle="Settle up pending debts and track payment records."
            action={
                <Button variant="contained" color="success" startIcon={<CheckCircle2 size={18} />} sx={{ borderRadius: 2, textTransform: 'none', px: 2.5 }}>
                    Settle Up Now
                </Button>
            }
        >
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#f0fdf4' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle2" sx={{ color: '#166534', fontWeight: 600, mb: 1 }}>
                                Total Pending Received
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#15803d' }}>
                                $42.50
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#fef2f2' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle2" sx={{ color: '#991b1b', fontWeight: 600, mb: 1 }}>
                                Total Pending Payable
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#b91c1c' }}>
                                $15.00
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
                Settlement History
            </Typography>

            <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <DataTable
                        columns={settlementsColumns}
                        data={settlementsData}
                    />
                </CardContent>
            </Card>
        </PageContainer>
    );
}

export default Settlements;
