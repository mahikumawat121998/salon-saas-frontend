'use client';

import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { Avatar } from '@/shared/ui/Avatar';
import { Card, CardContent } from '@/shared/ui/Card';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import {
  ArrowUpRight,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  MoreVertical,
  PhoneCall,
  SlidersHorizontal,
  UserCheck,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

// Sparkline SVG Component
function Sparkline({ color = '#7C3AED', points = [10, 25, 18, 30, 22, 40] }: { color?: string; points?: number[] }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const height = 36;
  const width = 110;
  const pathPoints = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / (max - min || 1)) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' L ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <path d={`M ${pathPoints}`} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MainDashboardPage() {
  const [dayView, setDayView] = useState('Day View');
  const [revenueFilter, setRevenueFilter] = useState('This Week');
  const [servicesFilter, setServicesFilter] = useState('This Week');

  const todaySchedule = [
    {
      time: '09:00 AM',
      client: 'John Doe',
      phone: '+91 98765 43210',
      service: 'Haircut',
      duration: '30 min • $25',
      stylist: 'Alex',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      status: 'Confirmed',
      statusColor: '#10B981',
      statusBg: 'rgba(16, 185, 129, 0.12)',
    },
    {
      time: '10:00 AM',
      client: 'Emma Watson',
      phone: '+91 91234 56789',
      service: 'Hair Color',
      duration: '60 min • $85',
      stylist: 'Sophia',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      status: 'Checked In',
      statusColor: '#3B82F6',
      statusBg: 'rgba(59, 130, 246, 0.12)',
    },
    {
      time: '11:30 AM',
      client: 'David Smith',
      phone: '+91 99887 76655',
      service: 'Beard Trim',
      duration: '30 min • $20',
      stylist: 'Ryan',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      status: 'In Progress',
      statusColor: '#7C3AED',
      statusBg: 'rgba(124, 58, 237, 0.12)',
    },
    {
      time: '01:00 PM',
      client: 'Olivia Brown',
      phone: '+91 88990 11223',
      service: 'Facial',
      duration: '45 min • $60',
      stylist: 'Sophia',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      status: 'Confirmed',
      statusColor: '#10B981',
      statusBg: 'rgba(16, 185, 129, 0.12)',
    },
    {
      time: '02:30 PM',
      client: 'Michael Lee',
      phone: '+91 77665 44321',
      service: 'Hair Spa',
      duration: '40 min • $45',
      stylist: 'Alex',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
      status: 'Pending',
      statusColor: '#F59E0B',
      statusBg: 'rgba(245, 158, 11, 0.12)',
    },
    {
      time: '04:00 PM',
      client: 'Sophia Miller',
      phone: '+91 66778 99001',
      service: 'Haircut',
      duration: '30 min • $25',
      stylist: 'Ryan',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      status: 'Confirmed',
      statusColor: '#10B981',
      statusBg: 'rgba(16, 185, 129, 0.12)',
    },
  ];

  const staffAvailability = [
    {
      name: 'Alex Johnson',
      role: 'Senior Stylist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      status: 'Busy',
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      timeline: [1, 1, 1, 0, 1, 1],
    },
    {
      name: 'Sophia Martinez',
      role: 'Color Specialist',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      status: 'Available',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
      timeline: [0, 0, 1, 0, 0, 0],
    },
    {
      name: 'Ryan Cooper',
      role: 'Beard Expert',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
      status: 'Busy',
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      timeline: [1, 1, 0, 1, 1, 0],
    },
    {
      name: 'Olivia Rhye',
      role: 'Spa Therapist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      status: 'Available',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
      timeline: [0, 1, 1, 1, 0, 0],
    },
    {
      name: 'James Carter',
      role: 'Stylist',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      status: 'Break',
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.12)',
      timeline: [0, 0, 0, 0, 0, 0],
    },
  ];

  const upcomingCustomers = [
    {
      name: 'John Doe',
      time: '09:00 AM',
      service: 'Haircut',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Emma Watson',
      time: '10:00 AM',
      service: 'Hair Color',
      phone: '+91 91234 56789',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'David Smith',
      time: '11:30 AM',
      service: 'Beard Trim',
      phone: '+91 99887 76655',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    },
  ];

  const popularServices = [
    { name: 'Haircut', count: 423, percent: 85, icon: '✂️' },
    { name: 'Hair Color', count: 233, percent: 65, icon: '💇' },
    { name: 'Facial', count: 183, percent: 50, icon: '💆' },
    { name: 'Hair Spa', count: 97, percent: 35, icon: '🧖' },
    { name: 'Beard Trim', count: 64, percent: 25, icon: '🪒' },
  ];

  const recentActivities = [
    {
      icon: '💳',
      text: 'Emma Watson paid $85 for Hair Color',
      time: '10:30 AM',
      bg: '#EFF6FF',
    },
    {
      icon: '👤',
      text: 'Alex Johnson completed Haircut for John Doe',
      time: '09:15 AM',
      bg: '#F0FDF4',
    },
    {
      icon: '👤',
      text: 'New customer registered - Olivia Brown',
      time: 'Yesterday, 8:45 PM',
      bg: '#FEF2F2',
    },
    {
      icon: '📅',
      text: 'Appointment rescheduled by David Smith',
      time: 'Yesterday, 6:30 PM',
      bg: '#FFFBEB',
    },
    {
      icon: '📦',
      text: 'Inventory updated - Loreal Hair Color',
      time: 'Yesterday, 4:20 PM',
      bg: '#F3E8FF',
    },
  ];

  return (
    <AuthGuard>
      <DashboardLayout>
        {/* Top Greeting Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3.5,
          }}
        >
          <Box>
            <Typography variant="h4" color="#111827" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
              Good Morning, Rahul 👋
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Monday, 27 July 2025 • Today looks busy. You have <strong>24 appointments</strong>.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<SlidersHorizontal size={18} />}
            sx={{
              borderRadius: '12px',
              borderColor: '#E5E7EB',
              color: '#374151',
              fontWeight: 600,
              px: 2.2,
              py: 1,
              backgroundColor: '#FFFFFF',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#F9FAFB',
                borderColor: '#D1D5DB',
              },
            }}
          >
            Customize Dashboard
          </Button>
        </Box>

        {/* Top 4 KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 3.5 }}>
          {/* Revenue */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ borderRadius: '20px', p: 2.5, border: '1px solid #F3F4F6' }}>
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '12px',
                        backgroundColor: '#F3E8FF',
                        color: '#7C3AED',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <DollarSign size={22} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Today’s Revenue
                    </Typography>
                    <Typography variant="h4" color="#111827" sx={{ fontWeight: 800, mt: 0.5 }}>
                      $3,420
                    </Typography>
                    <Typography variant="caption" color="success.main" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, fontWeight: 600 }}>
                      <ArrowUpRight size={14} /> 12.5% vs yesterday
                    </Typography>
                  </Box>
                  <Box sx={{ pt: 2 }}>
                    <Sparkline color="#7C3AED" points={[15, 22, 18, 30, 24, 38]} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Appointments */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ borderRadius: '20px', p: 2.5, border: '1px solid #F3F4F6' }}>
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '12px',
                        backgroundColor: '#EFF6FF',
                        color: '#3B82F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <CalendarIcon size={22} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Appointments
                    </Typography>
                    <Typography variant="h4" color="#111827" sx={{ fontWeight: 800, mt: 0.5 }}>
                      24
                    </Typography>
                    <Typography variant="caption" color="success.main" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, fontWeight: 600 }}>
                      <ArrowUpRight size={14} /> 8.3% vs yesterday
                    </Typography>
                  </Box>
                  <Box sx={{ pt: 2 }}>
                    <Sparkline color="#3B82F6" points={[10, 18, 14, 25, 20, 32]} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Staff Working */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ borderRadius: '20px', p: 2.5, border: '1px solid #F3F4F6' }}>
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '12px',
                        backgroundColor: '#ECFDF5',
                        color: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <Users size={22} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Staff Working
                    </Typography>
                    <Typography variant="h4" color="#111827" sx={{ fontWeight: 800, mt: 0.5 }}>
                      12 / 15
                    </Typography>
                    <Chip
                      label="80% Active"
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        color: '#10B981',
                        fontWeight: 700,
                        height: 22,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                  <Box sx={{ pt: 1 }}>
                    <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: '0.75rem' } }}>
                      <Avatar name="Alex" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" />
                      <Avatar name="Sophia" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80" />
                      <Avatar name="Ryan" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80" />
                    </AvatarGroup>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* New Customers */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ borderRadius: '20px', p: 2.5, border: '1px solid #F3F4F6' }}>
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '12px',
                        backgroundColor: '#FFF7ED',
                        color: '#F97316',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <UserCheck size={22} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      New Customers
                    </Typography>
                    <Typography variant="h4" color="#111827" sx={{ fontWeight: 800, mt: 0.5 }}>
                      18
                    </Typography>
                    <Typography variant="caption" color="success.main" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, fontWeight: 600 }}>
                      <ArrowUpRight size={14} /> 20% vs yesterday
                    </Typography>
                  </Box>
                  <Box sx={{ pt: 2 }}>
                    <Sparkline color="#F97316" points={[8, 14, 12, 22, 18, 28]} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Middle Section: Today's Schedule & Staff Availability */}
        <Grid container spacing={3} sx={{ mb: 3.5 }}>
          {/* Left Column: Today's Schedule */}
          <Grid size={{ xs: 12, lg: 7, xl: 8 }}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3 }}>
              {/* Header Controls */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CalendarIcon size={20} color="#7C3AED" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Today’s Schedule
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton size="small" sx={{ border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                    <ChevronLeft size={16} />
                  </IconButton>
                  <Button size="small" variant="outlined" sx={{ borderRadius: '8px', color: '#374151', borderColor: '#E5E7EB', textTransform: 'none' }}>
                    Today
                  </Button>
                  <IconButton size="small" sx={{ border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                    <ChevronRight size={16} />
                  </IconButton>

                  <Select
                    size="small"
                    value={dayView}
                    onChange={(e) => setDayView(e.target.value)}
                    sx={{ borderRadius: '8px', fontSize: '0.8125rem', height: 32 }}
                  >
                    <MenuItem value="Day View">Day View</MenuItem>
                    <MenuItem value="Week View">Week View</MenuItem>
                  </Select>
                </Box>
              </Box>

              {/* Timeline List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {todaySchedule.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: '14px',
                      backgroundColor: '#FAFAFC',
                      borderLeft: `4px solid ${item.statusColor}`,
                    }}
                  >
                    {/* Time */}
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, minWidth: 70 }}>
                      {item.time}
                    </Typography>

                    {/* Client Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 160 }}>
                      <Avatar name={item.client} src={item.avatar} sx={{ width: 36, height: 36 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          {item.client}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {item.phone}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Service & Duration */}
                    <Box sx={{ minWidth: 140 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {item.service}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {item.duration}
                      </Typography>
                    </Box>

                    {/* Stylist */}
                    <Typography variant="body2" color="#374151" sx={{ fontWeight: 600 }}>
                      {item.stylist}
                    </Typography>

                    {/* Status Pill */}
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{
                        backgroundColor: item.statusBg,
                        color: item.statusColor,
                        fontWeight: 700,
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                      }}
                    />

                    {/* Actions Menu */}
                    <IconButton size="small">
                      <MoreVertical size={16} color="#9CA3AF" />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button color="primary" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
                  View Full Calendar →
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Right Column: Staff Availability & Upcoming Customers */}
          <Grid size={{ xs: 12, lg: 5, xl: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Staff Availability Card */}
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                    Staff Availability
                  </Typography>
                  <Button size="small" color="primary" sx={{ fontSize: '0.8125rem', textTransform: 'none', fontWeight: 600 }}>
                    View All
                  </Button>
                </Box>

                {/* Timeline Axis Labels */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 6, mb: 1, color: '#9CA3AF', fontSize: '0.6875rem' }}>
                  <span>9 AM</span>
                  <span>1 PM</span>
                  <span>5 PM</span>
                  <span>9 PM</span>
                </Box>

                {/* Staff Rows */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                  {staffAvailability.map((staff, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, width: 140 }}>
                        <Avatar name={staff.name} src={staff.avatar} sx={{ width: 32, height: 32 }} />
                        <Box sx={{ overflow: 'hidden' }}>
                          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                            {staff.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.6875rem', display: 'block' }}>
                            {staff.role}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Bar indicator */}
                      <Box sx={{ flexGrow: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, mx: 1.5, position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: staff.status === 'Busy' ? '80%' : staff.status === 'Available' ? '100%' : '40%', backgroundColor: staff.color }} />
                      </Box>

                      {/* Status Badge */}
                      <Chip
                        label={staff.status}
                        size="small"
                        sx={{
                          backgroundColor: staff.bg,
                          color: staff.color,
                          fontWeight: 700,
                          height: 20,
                          fontSize: '0.6875rem',
                          borderRadius: '6px',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Card>

              {/* Upcoming Customers Card */}
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                    Upcoming Customers
                  </Typography>
                  <Button size="small" color="primary" sx={{ fontSize: '0.8125rem', textTransform: 'none', fontWeight: 600 }}>
                    View All
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                  {upcomingCustomers.map((cust, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.2, borderRadius: '12px', backgroundColor: '#FAFAFC' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar name={cust.name} src={cust.avatar} sx={{ width: 34, height: 34 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem' }}>
                            {cust.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                            <Clock size={12} /> {cust.time} • {cust.service}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: '8px',
                            borderColor: '#7C3AED',
                            color: '#7C3AED',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            py: 0.4,
                            px: 1.2,
                            textTransform: 'none',
                          }}
                        >
                          Check In
                        </Button>
                        <IconButton size="small" sx={{ border: '1px solid #E5E7EB' }}>
                          <PhoneCall size={14} color="#6B7280" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Row (3 Columns) */}
        <Grid container spacing={3}>
          {/* Column 1: Revenue Overview */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Revenue Overview
                </Typography>
                <Select
                  size="small"
                  value={revenueFilter}
                  onChange={(e) => setRevenueFilter(e.target.value)}
                  sx={{ borderRadius: '8px', fontSize: '0.75rem', height: 28 }}
                >
                  <MenuItem value="This Week">This Week</MenuItem>
                  <MenuItem value="This Month">This Month</MenuItem>
                </Select>
              </Box>

              <Typography variant="h4" color="#111827" sx={{ fontWeight: 800 }}>
                $18,240
              </Typography>
              <Typography variant="caption" color="success.main" sx={{ display: 'block', mb: 3, fontWeight: 600 }}>
                ↑ 14.2% from last week
              </Typography>

              {/* Smooth Chart Representation */}
              <Box sx={{ width: '100%', height: 160, position: 'relative', pt: 2 }}>
                <svg width="100%" height="120" viewBox="0 0 300 120" style={{ overflow: 'visible' }}>
                  <path
                    d="M 0,80 Q 50,110 100,50 T 200,70 T 300,20"
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth="3"
                  />
                  <circle cx="200" cy="70" r="5" fill="#7C3AED" />
                  <circle cx="300" cy="20" r="5" fill="#7C3AED" />
                </svg>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '0.75rem', mt: 1 }}>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Column 2: Popular Services */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Popular Services
                </Typography>
                <Select
                  size="small"
                  value={servicesFilter}
                  onChange={(e) => setServicesFilter(e.target.value)}
                  sx={{ borderRadius: '8px', fontSize: '0.75rem', height: 28 }}
                >
                  <MenuItem value="This Week">This Week</MenuItem>
                  <MenuItem value="This Month">This Month</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                {popularServices.map((srv, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ fontSize: '1.1rem', minWidth: 24 }}>
                      {srv.icon}
                    </Typography>
                    <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600 }}>
                      {srv.name}
                    </Typography>
                    <Box sx={{ flexGrow: 1, height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${srv.percent}%`, backgroundColor: '#7C3AED', borderRadius: 4 }} />
                    </Box>
                    <Typography variant="caption" color="#374151" sx={{ minWidth: 30, textAlign: 'right', fontWeight: 700 }}>
                      {srv.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          {/* Column 3: Recent Activity */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Recent Activity
                </Typography>
                <Button size="small" color="primary" sx={{ fontSize: '0.8125rem', textTransform: 'none', fontWeight: 600 }}>
                  View All
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                {recentActivities.map((act, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        backgroundColor: act.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        flexShrink: 0,
                      }}
                    >
                      {act.icon}
                    </Box>
                    <Box sx={{ overflow: 'hidden' }}>
                      <Typography variant="body2" color="#111827" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                        {act.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block' }}>
                        {act.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </DashboardLayout>
    </AuthGuard>
  );
}
