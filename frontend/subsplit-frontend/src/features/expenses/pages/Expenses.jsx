import React, { useState } from 'react';
import { Box, Card, CardContent, Button } from '@mui/material';
import { Plus, Filter } from 'lucide-react';
import PageContainer from '../../../components/layout/PageContainer';
import SearchBox from '../../../components/ui/SearchBox';
import DataTable from '../../../components/ui/DataTable';
import StatusChip from '../../../components/ui/StatusChip';

function Expenses() {
    const [searchTerm, setSearchTerm] = useState('');

    const expensesColumns = [
        { field: 'date', headerName: 'Date' },
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

    const expensesData = [
        { id: 1, date: '2026-07-21', description: 'Grocery Market Shopping', group: 'Apartment 4B', amount: '$84.50', paidBy: 'You', status: 'Pending' },
        { id: 2, date: '2026-07-20', description: 'Internet Fiber Bill', group: 'Apartment 4B', amount: '$60.00', paidBy: 'Alex', status: 'Completed' },
        { id: 3, date: '2026-07-18', description: 'Airbnb Booking Tahoe', group: 'Trip to Tahoe', amount: '$450.00', paidBy: 'Sarah', status: 'Pending' },
        { id: 4, date: '2026-07-15', description: 'Gasoline & Fuel', group: 'Trip to Tahoe', amount: '$45.00', paidBy: 'You', status: 'Settled' },
        { id: 5, date: '2026-07-12', description: 'Lunch Team Order', group: 'Work Lunch Club', amount: '$38.20', paidBy: 'Mike', status: 'Completed' },
    ];

    const filteredData = expensesData.filter((item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.group.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageContainer
            title="Expenses"
            subtitle="View, filter, and manage all your shared expenses."
            action={
                <Button variant="contained" startIcon={<Plus size={18} />} sx={{ borderRadius: 2, textTransform: 'none', px: 2.5 }}>
                    Add New Expense
                </Button>
            }
        >
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ maxWidth: 360, flexGrow: 1 }}>
                    <SearchBox
                        placeholder="Search expenses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Box>
                <Button variant="outlined" startIcon={<Filter size={18} />} sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#cbd5e1', color: '#475569' }}>
                    Filter
                </Button>
            </Box>

            <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <DataTable
                        columns={expensesColumns}
                        data={filteredData}
                    />
                </CardContent>
            </Card>
        </PageContainer>
    );
}

export default Expenses;
