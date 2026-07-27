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
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import { Avatar } from '@/shared/ui/Avatar';
import { ROUTES } from '@/config/routes';

interface LeaveItem {
  id: string;
  staffName: string;
  staffAvatar: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const LEAVES_DATA: LeaveItem[] = [
  {
    id: '1',
    staffName: 'Vikram Joshi',
    staffAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    leaveType: 'Casual Leave',
    startDate: '25 Jul 2025',
    endDate: '26 Jul 2025',
    duration: '2 Days',
    status: 'Pending',
  },
  {
    id: '2',
    staffName: 'Neha Kapoor',
    staffAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    leaveType: 'Sick Leave',
    startDate: '24 Jul 2025',
    endDate: '24 Jul 2025',
    duration: '1 Day',
    status: 'Approved',
  },
  {
    id: '3',
    staffName: 'Rahul Mehta',
    staffAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    leaveType: 'Casual Leave',
    startDate: '22 Jul 2025',
    endDate: '23 Jul 2025',
    duration: '2 Days',
    status: 'Approved',
  },
  {
    id: '4',
    staffName: 'Amit Kumar',
    staffAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    leaveType: 'Personal Leave',
    startDate: '20 Jul 2025',
    endDate: '20 Jul 2025',
    duration: '1 Day',
    status: 'Rejected',
  },
  {
    id: '5',
    staffName: 'Sneha Patel',
    staffAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    leaveType: 'Casual Leave',
    startDate: '18 Jul 2025',
    endDate: '18 Jul 2025',
    duration: '1 Day',
    status: 'Approved',
  },
];

export default function LeaveManagementPage() {
  const [selectedTab, setSelectedTab] = useState(0);

  const getStatusChipProps = (status: LeaveItem['status']) => {
    switch (status) {
      case 'Approved':
        return { bg: '#ECFDF5', color: '#10B981' };
      case 'Pending':
        return { bg: '#FFF7ED', color: '#F97316' };
      case 'Rejected':
        return { bg: '#FEE2E2', color: '#EF4444' };
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', maxWidth: '100%', pb: 4 }}>
          {/* Header Title Section & Controls */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Button
                component={Link}
                href={ROUTES.dashboard.staff.root}
                startIcon={<ArrowLeft size={16} />}
                sx={{ textTransform: 'none', fontWeight: 700, color: '#6B7280', p: 0, mb: 1 }}
              >
                Back to Staff
              </Button>
              <PageHeader
                title="Leave Management"
                subtitle="Manage staff leaves and requests"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<Download size={16} />}
                sx={{ borderRadius: '12px', borderColor: '#E5E7EB', color: '#374151', fontWeight: 600, fontSize: '0.84rem', py: 0.9, px: 2, textTransform: 'none' }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                sx={{ borderRadius: '12px', backgroundColor: '#7C3AED', fontWeight: 700, fontSize: '0.84rem', py: 1, px: 2.5, textTransform: 'none' }}
              >
                Add Leave
              </Button>
            </Box>
          </Box>

          {/* Main Card */}
          <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
              <Tabs
                value={selectedTab}
                onChange={(_, val) => setSelectedTab(val)}
                textColor="primary"
                indicatorColor="primary"
                sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', px: 2.5 } }}
              >
                <Tab label="All Leaves" />
                <Tab label="Pending Approval" />
                <Tab label="Approved" />
                <Tab label="Rejected" />
              </Tabs>
            </Box>

            {/* Filter Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search by staff name..."
                size="small"
                sx={{ width: 260, '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: '0.84rem', height: 38 } }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={16} color="#9CA3AF" /></InputAdornment> } }}
              />

              <Select size="small" defaultValue="all" sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 38, minWidth: 140 }}>
                <MenuItem value="all">Leave Type</MenuItem>
                <MenuItem value="casual">Casual Leave</MenuItem>
                <MenuItem value="sick">Sick Leave</MenuItem>
              </Select>

              <Select size="small" defaultValue="range" sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 38, minWidth: 140 }}>
                <MenuItem value="range">Date Range</MenuItem>
              </Select>

              <Button variant="outlined" startIcon={<Filter size={16} />} sx={{ borderRadius: '12px', borderColor: '#E5E7EB', color: '#374151', fontWeight: 600, fontSize: '0.84rem', py: 0.8, px: 2, textTransform: 'none' }}>
                Filters
              </Button>
            </Box>

            {/* Table */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '1px solid #F3F4F6', py: 1.2 } }}>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Staff</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Leave Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {LEAVES_DATA.map((leave) => {
                    const statusStyle = getStatusChipProps(leave.status);
                    return (
                      <TableRow key={leave.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Avatar name={leave.staffName} src={leave.staffAvatar} sx={{ width: 32, height: 32 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827' }}>
                              {leave.staffName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>{leave.leaveType}</TableCell>
                        <TableCell sx={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>{leave.startDate}</TableCell>
                        <TableCell sx={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>{leave.endDate}</TableCell>
                        <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>{leave.duration}</TableCell>
                        <TableCell>
                          <Chip label={leave.status} size="small" sx={{ backgroundColor: statusStyle.bg, color: statusStyle.color, fontWeight: 700, fontSize: '0.6875rem', height: 22, borderRadius: '6px' }} />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small"><Eye size={16} color="#6B7280" /></IconButton>
                          <IconButton size="small"><MoreVertical size={16} color="#6B7280" /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2.5, mt: 1, borderTop: '1px solid #F3F4F6' }}>
              <Pagination count={3} page={1} size="small" color="primary" />
            </Box>
          </Card>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
