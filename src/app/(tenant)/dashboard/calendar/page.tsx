'use client';

import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { AddAppointmentModal } from '@/shared/components/modals/AddAppointmentModal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import {
  Filter,
  MoreVertical,
  Plus,
} from 'lucide-react';
import React, { useState } from 'react';

interface CalendarAppointmentBlock {
  id: string;
  customerName: string;
  serviceName: string;
  timeRange: string;
  stylistIndex: number; // 0: Alex, 1: Sophia, 2: Ryan, 3: Olivia
  topPx: number;
  heightPx: number;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stylists = [
    'Alex Johnson',
    'Sophia Martinez',
    'Ryan Cooper',
    'Olivia Rhye',
  ];

  const timeSlots = [
    '9 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
  ];

  // Precise positions for the left resource grid
  const calendarBlocks: CalendarAppointmentBlock[] = [
    // Alex Johnson
    {
      id: 'blk_1',
      customerName: 'John Doe',
      serviceName: 'Haircut',
      timeRange: '09:00 - 09:45',
      stylistIndex: 0,
      topPx: 10,
      heightPx: 55,
      bgColor: '#F3E8FF',
      borderColor: '#C084FC',
      textColor: '#6B21A8',
    },
    {
      id: 'blk_2',
      customerName: 'Michael Lee',
      serviceName: 'Hair Spa',
      timeRange: '10:30 - 11:10',
      stylistIndex: 0,
      topPx: 120,
      heightPx: 55,
      bgColor: '#FFF7ED',
      borderColor: '#FDBA74',
      textColor: '#C2410C',
    },
    {
      id: 'blk_3',
      customerName: 'Isabelle Davis',
      serviceName: 'Facial',
      timeRange: '01:00 - 01:45',
      stylistIndex: 0,
      topPx: 270,
      heightPx: 55,
      bgColor: '#EFF6FF',
      borderColor: '#93C5FD',
      textColor: '#1D4ED8',
    },
    {
      id: 'blk_4',
      customerName: 'Mason Clark',
      serviceName: 'Haircut',
      timeRange: '03:00 - 03:45',
      stylistIndex: 0,
      topPx: 410,
      heightPx: 55,
      bgColor: '#FFF7ED',
      borderColor: '#FDBA74',
      textColor: '#C2410C',
    },

    // Sophia Martinez
    {
      id: 'blk_5',
      customerName: 'Emma Watson',
      serviceName: 'Hair Color',
      timeRange: '09:00 - 10:00',
      stylistIndex: 1,
      topPx: 10,
      heightPx: 70,
      bgColor: '#FEF3C7',
      borderColor: '#FCD34D',
      textColor: '#B45309',
    },
    {
      id: 'blk_6',
      customerName: 'Sophia Miller',
      serviceName: 'Haircut',
      timeRange: '10:00 - 10:30',
      stylistIndex: 1,
      topPx: 90,
      heightPx: 55,
      bgColor: '#E0F2FE',
      borderColor: '#7DD3FC',
      textColor: '#0369A1',
    },
    {
      id: 'blk_7',
      customerName: 'Lunch Break',
      serviceName: '',
      timeRange: '12:30 - 01:00',
      stylistIndex: 1,
      topPx: 230,
      heightPx: 40,
      bgColor: '#F3F4F6',
      borderColor: '#D1D5DB',
      textColor: '#4B5563',
    },
    {
      id: 'blk_8',
      customerName: 'James Taylor',
      serviceName: 'Hair Spa',
      timeRange: '01:00 - 01:40',
      stylistIndex: 1,
      topPx: 270,
      heightPx: 55,
      bgColor: '#FCE7F3',
      borderColor: '#F472B6',
      textColor: '#BE185D',
    },

    // Ryan Cooper
    {
      id: 'blk_9',
      customerName: 'David Smith',
      serviceName: 'Beard Trim',
      timeRange: '09:30 - 10:00',
      stylistIndex: 2,
      topPx: 45,
      heightPx: 50,
      bgColor: '#E0F2FE',
      borderColor: '#7DD3FC',
      textColor: '#0369A1',
    },
    {
      id: 'blk_10',
      customerName: 'Charlotte White',
      serviceName: 'Hair Color',
      timeRange: '01:15 - 02:15',
      stylistIndex: 2,
      topPx: 290,
      heightPx: 70,
      bgColor: '#DCFCE7',
      borderColor: '#86EFAC',
      textColor: '#15803D',
    },
    {
      id: 'blk_11',
      customerName: 'Amelia Wright',
      serviceName: 'Hair Spa',
      timeRange: '03:00 - 04:00',
      stylistIndex: 2,
      topPx: 410,
      heightPx: 65,
      bgColor: '#FCE7F3',
      borderColor: '#F472B6',
      textColor: '#BE185D',
    },

    // Olivia Rhye
    {
      id: 'blk_12',
      customerName: 'Olivia Brown',
      serviceName: 'Facial',
      timeRange: '09:15 - 10:00',
      stylistIndex: 3,
      topPx: 25,
      heightPx: 55,
      bgColor: '#FFE4E6',
      borderColor: '#FDA4AF',
      textColor: '#BE123C',
    },
    {
      id: 'blk_13',
      customerName: 'Ava Wilson',
      serviceName: 'Hair Color',
      timeRange: '10:15 - 11:15',
      stylistIndex: 3,
      topPx: 105,
      heightPx: 65,
      bgColor: '#F3E8FF',
      borderColor: '#C084FC',
      textColor: '#6B21A8',
    },
  ];

  const tableAppointments = [
    {
      time: '09:00 AM',
      customer: 'John Doe',
      service: 'Haircut',
      staff: 'Alex Johnson',
      status: 'Confirmed',
      statusColor: '#10B981',
      statusBg: 'rgba(16, 185, 129, 0.12)',
      payment: 'Paid',
      paymentColor: '#10B981',
      paymentBg: 'rgba(16, 185, 129, 0.08)',
      amount: '$25',
    },
    {
      time: '10:00 AM',
      customer: 'Emma Watson',
      service: 'Hair Color',
      staff: 'Sophia Martinez',
      status: 'Checked In',
      statusColor: '#3B82F6',
      statusBg: 'rgba(59, 130, 246, 0.12)',
      payment: 'Unpaid',
      paymentColor: '#EF4444',
      paymentBg: 'rgba(239, 68, 68, 0.08)',
      amount: '$85',
    },
    {
      time: '11:30 AM',
      customer: 'David Smith',
      service: 'Beard Trim',
      staff: 'Ryan Cooper',
      status: 'In Progress',
      statusColor: '#7C3AED',
      statusBg: 'rgba(124, 58, 237, 0.12)',
      payment: 'Paid',
      paymentColor: '#10B981',
      paymentBg: 'rgba(16, 185, 129, 0.08)',
      amount: '$20',
    },
    {
      time: '01:00 PM',
      customer: 'Olivia Brown',
      service: 'Facial',
      staff: 'Olivia Rhye',
      status: 'Confirmed',
      statusColor: '#10B981',
      statusBg: 'rgba(16, 185, 129, 0.12)',
      payment: 'Paid',
      paymentColor: '#10B981',
      paymentBg: 'rgba(16, 185, 129, 0.08)',
      amount: '$60',
    },
    {
      time: '02:30 PM',
      customer: 'Michael Lee',
      service: 'Hair Spa',
      staff: 'Alex Johnson',
      status: 'Pending',
      statusColor: '#F59E0B',
      statusBg: 'rgba(245, 158, 11, 0.12)',
      payment: 'Unpaid',
      paymentColor: '#EF4444',
      paymentBg: 'rgba(239, 68, 68, 0.08)',
      amount: '$45',
    },
    {
      time: '04:00 PM',
      customer: 'Sophia Miller',
      service: 'Haircut',
      staff: 'Ryan Cooper',
      status: 'Confirmed',
      statusColor: '#10B981',
      statusBg: 'rgba(16, 185, 129, 0.12)',
      payment: 'Paid',
      paymentColor: '#10B981',
      paymentBg: 'rgba(16, 185, 129, 0.08)',
      amount: '$25',
    },
    {
      time: '05:00 PM',
      customer: 'Ava Wilson',
      service: 'Hair Color',
      staff: 'Sophia Martinez',
      status: 'Confirmed',
      statusColor: '#10B981',
      statusBg: 'rgba(16, 185, 129, 0.12)',
      payment: 'Unpaid',
      paymentColor: '#EF4444',
      paymentBg: 'rgba(239, 68, 68, 0.08)',
      amount: '$85',
    },
    {
      time: '06:00 PM',
      customer: 'Liam Johnson',
      service: 'Haircut',
      staff: 'James Carter',
      status: 'Cancelled',
      statusColor: '#EF4444',
      statusBg: 'rgba(239, 68, 68, 0.12)',
      payment: '-',
      paymentColor: '#9CA3AF',
      paymentBg: 'transparent',
      amount: '-',
    },
  ];

  return (
    <AuthGuard>
      <DashboardLayout>
        {/* Top Calendar Toolbar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            mb: 3.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" color="#111827" sx={{ fontWeight: 800 }}>
              July 27 – August 2, 2025
            </Typography>

            {/* Day / Week / Month Switcher */}
            <Box
              sx={{
                display: 'flex',
                backgroundColor: '#F3F4F6',
                p: 0.5,
                borderRadius: '10px',
              }}
            >
              {(['Day', 'Week', 'Month'] as const).map((mode) => (
                <Button
                  key={mode}
                  size="small"
                  onClick={() => setViewMode(mode)}
                  sx={{
                    px: 1.8,
                    py: 0.5,
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    backgroundColor: viewMode === mode ? '#FFFFFF' : 'transparent',
                    color: viewMode === mode ? '#7C3AED' : '#6B7280',
                    boxShadow: viewMode === mode ? '0px 2px 6px rgba(0, 0, 0, 0.06)' : 'none',
                    '&:hover': {
                      backgroundColor: viewMode === mode ? '#FFFFFF' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {mode}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              sx={{
                borderRadius: '12px',
                backgroundColor: '#6D28D9',
                fontWeight: 700,
                px: 2.5,
                py: 1,
                textTransform: 'none',
                boxShadow: '0px 6px 16px rgba(109, 40, 217, 0.25)',
                '&:hover': {
                  backgroundColor: '#5B21B6',
                },
              }}
              onClick={() => setIsAddModalOpen(true)}
            >
              + New Appointment
            </Button>

            <Button
              variant="outlined"
              startIcon={<Filter size={16} />}
              sx={{
                borderRadius: '12px',
                borderColor: '#E5E7EB',
                color: '#374151',
                fontWeight: 600,
                px: 2,
                py: 1,
                backgroundColor: '#FFFFFF',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                  borderColor: '#D1D5DB',
                },
              }}
            >
              Filter
            </Button>
          </Box>
        </Box>

        {/* Main Grid: Left Interactive Resource Calendar & Right Table */}
        <Grid container spacing={3}>
          {/* Left Column: Interactive Resource Calendar (60%) */}
          <Grid size={{ xs: 12, lg: 7, xl: 7 }}>
            <Card
              sx={{
                borderRadius: '20px',
                border: '1px solid #F3F4F6',
                p: 2.5,
                overflowX: 'auto',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Box sx={{ minWidth: 600, position: 'relative' }}>
                {/* Header Stylists */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '60px repeat(4, 1fr)',
                    borderBottom: '1px solid #E5E7EB',
                    pb: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Typography variant="caption" color="#9CA3AF" align="center" sx={{ fontWeight: 700 }}>
                    Time
                  </Typography>
                  {stylists.map((stf, idx) => (
                    <Typography key={idx} variant="subtitle2" color="#111827" align="center" sx={{ fontWeight: 700 }}>
                      {stf}
                    </Typography>
                  ))}
                </Box>

                {/* Resource Grid Body */}
                <Box sx={{ position: 'relative', minHeight: 480 }}>
                  {/* Time Rows */}
                  {timeSlots.map((time, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '60px repeat(4, 1fr)',
                        height: 65,
                        borderBottom: '1px solid #F3F4F6',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography variant="caption" color="#9CA3AF" sx={{ fontWeight: 600, pt: 0.5 }}>
                        {time}
                      </Typography>
                      <Box sx={{ borderLeft: '1px solid #F3F4F6', height: '100%' }} />
                      <Box sx={{ borderLeft: '1px solid #F3F4F6', height: '100%' }} />
                      <Box sx={{ borderLeft: '1px solid #F3F4F6', height: '100%' }} />
                      <Box sx={{ borderLeft: '1px solid #F3F4F6', height: '100%' }} />
                    </Box>
                  ))}

                  {/* Absolute Appointment Blocks */}
                  {calendarBlocks.map((blk) => {
                    const colWidthPercent = 22.5; // (100% - 60px) / 4 ~ 22.5%
                    const leftPercent = 14 + blk.stylistIndex * colWidthPercent;

                    return (
                      <Box
                        key={blk.id}
                        sx={{
                          position: 'absolute',
                          top: `${blk.topPx}px`,
                          left: `${leftPercent}%`,
                          width: '21%',
                          height: `${blk.heightPx}px`,
                          backgroundColor: blk.bgColor,
                          borderLeft: `4px solid ${blk.borderColor}`,
                          borderRadius: '10px',
                          p: 1,
                          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
                          cursor: 'pointer',
                          transition: 'transform 0.15s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                          },
                        }}
                      >
                        <Typography variant="subtitle2" color={blk.textColor} noWrap sx={{ fontWeight: 800, fontSize: '0.8125rem' }}>
                          {blk.customerName}
                        </Typography>
                        {blk.serviceName && (
                          <Typography variant="caption" color={blk.textColor} noWrap sx={{ opacity: 0.85, fontSize: '0.72rem', display: 'block' }}>
                            {blk.serviceName}
                          </Typography>
                        )}
                        <Typography variant="caption" color={blk.textColor} sx={{ opacity: 0.75, mt: 0.2, fontSize: '0.6875rem', display: 'block' }}>
                          {blk.timeRange}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Right Column: Appointments Data Table (40%) */}
          <Grid size={{ xs: 12, lg: 5, xl: 5 }}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Service</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Staff</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Payment</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }} align="right">Amount</TableCell>
                      <TableCell sx={{ width: 40 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableAppointments.map((row, idx) => (
                      <TableRow key={idx} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={{ fontSize: '0.78125rem', fontWeight: 600, color: '#9CA3AF' }}>
                          {row.time}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                          {row.customer}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.78125rem', color: '#4B5563' }}>
                          {row.service}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.78125rem', color: '#4B5563' }}>
                          {row.staff}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            sx={{
                              backgroundColor: row.statusBg,
                              color: row.statusColor,
                              fontWeight: 700,
                              height: 22,
                              fontSize: '0.6875rem',
                              borderRadius: '6px',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {row.payment !== '-' ? (
                            <Chip
                              label={row.payment}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: row.paymentColor,
                                color: row.paymentColor,
                                fontWeight: 700,
                                height: 20,
                                fontSize: '0.6875rem',
                                borderRadius: '6px',
                              }}
                            />
                          ) : (
                            <Typography variant="caption" color="text.secondary">-</Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <MoreVertical size={16} color="#9CA3AF" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Table Footer & Pagination */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pt: 2.5,
                  mt: 1,
                  borderTop: '1px solid #F3F4F6',
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Showing 1 to 8 of 24 appointments
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Pagination count={3} page={1} size="small" color="primary" />
                  <Select size="small" defaultValue={10} sx={{ height: 28, fontSize: '0.75rem', borderRadius: '6px' }}>
                    <MenuItem value={10}>10 / page</MenuItem>
                    <MenuItem value={20}>20 / page</MenuItem>
                  </Select>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
        
        <AddAppointmentModal 
          open={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      </DashboardLayout>
    </AuthGuard>
  );
}
