'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Link from 'next/link';
import { Search, Plus, Filter, Download, Eye, MoreVertical, Coffee, ArrowLeft } from 'lucide-react';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import { Avatar } from '@/shared/ui/Avatar';
import { ROUTES } from '@/config/routes';

interface BreakItem {
  id: string;
  staffName: string;
  staffAvatar: string;
  breakName: string;
  startTime: string;
  endTime: string;
  repeat: string;
  status: 'Active' | 'Inactive';
}

const BREAKS_DATA: BreakItem[] = [
  { id: '1', staffName: 'Rahul Mehta', staffAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', breakName: 'Lunch Break', startTime: '01:00 PM', endTime: '01:30 PM', repeat: 'Every day', status: 'Active' },
  { id: '2', staffName: 'Neha Kapoor', staffAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80', breakName: 'Tea Break', startTime: '04:00 PM', endTime: '04:15 PM', repeat: 'Every day', status: 'Active' },
  { id: '3', staffName: 'Amit Kumar', staffAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', breakName: 'Lunch Break', startTime: '12:30 PM', endTime: '01:00 PM', repeat: 'Every day', status: 'Active' },
  { id: '4', staffName: 'Sneha Patel', staffAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', breakName: 'Tea Break', startTime: '03:30 PM', endTime: '03:45 PM', repeat: 'Every day', status: 'Inactive' },
  { id: '5', staffName: 'Pooja Sharma', staffAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80', breakName: 'Lunch Break', startTime: '01:30 PM', endTime: '02:00 PM', repeat: 'Every day', status: 'Active' },
];

export default function BreakSchedulePage() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', maxWidth: '100%', pb: 4 }}>
          {/* Header Title */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
            <Box>
              <Button component={Link} href={ROUTES.dashboard.staff.root} startIcon={<ArrowLeft size={16} />} sx={{ textTransform: 'none', fontWeight: 700, color: '#6B7280', p: 0, mb: 1 }}>
                Back to Staff
              </Button>
              <PageHeader title="Break Schedule" subtitle="Manage staff breaks and schedules" />
            </Box>

            <Button variant="contained" startIcon={<Plus size={18} />} sx={{ borderRadius: '12px', backgroundColor: '#7C3AED', fontWeight: 700, fontSize: '0.84rem', py: 1, px: 2.5, textTransform: 'none' }}>
              Add Break
            </Button>
          </Box>

          <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF', mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
              <Tabs value={selectedTab} onChange={(_, val) => setSelectedTab(val)} textColor="primary" indicatorColor="primary" sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', px: 2.5 } }}>
                <Tab label="All Breaks" />
                <Tab label="Break Rules" />
                <Tab label="Break Logs" />
              </Tabs>
            </Box>

            {/* Filter Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
              <TextField placeholder="Search by staff name..." size="small" sx={{ width: 260, '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: '0.84rem', height: 38 } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={16} color="#9CA3AF" /></InputAdornment> } }} />
              <Select size="small" defaultValue="range" sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 38, minWidth: 140 }}><MenuItem value="range">Date Range</MenuItem></Select>
              <Button variant="outlined" startIcon={<Filter size={16} />} sx={{ borderRadius: '12px', borderColor: '#E5E7EB', color: '#374151', fontWeight: 600, fontSize: '0.84rem', py: 0.8, px: 2, textTransform: 'none' }}>Filters</Button>
            </Box>

            {/* Table */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '1px solid #F3F4F6', py: 1.2 } }}>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Staff</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Break Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Start Time</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>End Time</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Repeat</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {BREAKS_DATA.map((brk) => (
                    <TableRow key={brk.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <Avatar name={brk.staffName} src={brk.staffAvatar} sx={{ width: 32, height: 32 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827' }}>{brk.staffName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>{brk.breakName}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>{brk.startTime}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>{brk.endTime}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#6B7280' }}>{brk.repeat}</TableCell>
                      <TableCell>
                        <Chip label={brk.status} size="small" sx={{ backgroundColor: brk.status === 'Active' ? 'rgba(16, 185, 129, 0.12)' : '#F3F4F6', color: brk.status === 'Active' ? '#10B981' : '#6B7280', fontWeight: 700, fontSize: '0.6875rem', height: 22 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2.5, mt: 1, borderTop: '1px solid #F3F4F6' }}>
              <Pagination count={2} page={1} size="small" color="primary" />
            </Box>
          </Card>

          {/* Break Rules Summary Box */}
          <Card sx={{ borderRadius: '20px', border: '1px solid #FEF3C7', p: 3, backgroundColor: '#FFFBEB' }}>
            <Typography variant="subtitle2" color="#92400E" sx={{ fontWeight: 800, fontSize: '0.875rem', mb: 2 }}>
              Break Rules Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Max Breaks / Day</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>2</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Min Break Duration</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>15 mins</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Auto Deduct</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#10B981' }}>Enabled</Typography>
              </Grid>
            </Grid>
          </Card>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
