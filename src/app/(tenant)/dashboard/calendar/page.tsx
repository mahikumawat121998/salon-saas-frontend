'use client';

import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  MoreVertical,
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  PlayCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AddAppointmentModal } from '@/shared/components/modals/AddAppointmentModal';
import { appointmentApiService, AppointmentItem } from '@/services/api/appointment.service';
import { staffApiService, StaffItem } from '@/services/api/staff.service';
import { QUERY_KEYS } from '@/config/query-keys';
import { showToast } from '@/shared/components/Toast';
import { Avatar } from '@/shared/ui/Avatar';
import { env } from '@/config/env';

// Status badge styling helper
const getStatusConfig = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED':
      return { label: 'Confirmed', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: '#A7F3D0', textDark: '#047857' };
    case 'IN_PROGRESS':
      return { label: 'In Progress', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.12)', border: '#C4B5FD', textDark: '#6D28D9' };
    case 'COMPLETED':
      return { label: 'Completed', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)', border: '#6EE7B7', textDark: '#047857' };
    case 'PENDING':
      return { label: 'Pending', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', border: '#FDE047', textDark: '#B45309' };
    case 'CANCELLED':
    case 'NO_SHOW':
      return { label: 'Cancelled', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', border: '#FCA5A5', textDark: '#B91C1C' };
    default:
      return { label: status || 'Scheduled', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)', border: '#93C5FD', textDark: '#1D4ED8' };
  }
};

export default function CalendarPage() {
  const queryClient = useQueryClient();

  // Helper to get local Date from appointment item
  const getApptDate = (appt: AppointmentItem): Date | null => {
    if (appt.startAt) return new Date(appt.startAt);
    if (appt.appointmentDate) {
      const parts = appt.appointmentDate.split('T')[0].split('-');
      if (parts.length === 3) {
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      }
      return new Date(appt.appointmentDate);
    }
    return null;
  };

  // Navigation & View State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Active appointment for Side Drawer
  const [selectedAppt, setSelectedAppt] = useState<AppointmentItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch Live Staff
  const { data: staffList = [] } = useQuery({
    queryKey: QUERY_KEYS.staff.all,
    queryFn: () => staffApiService.getStaff(),
  });

  // Fetch Live Appointments
  const { data: apiAppointments = [], isLoading: isApptsLoading } = useQuery({
    queryKey: QUERY_KEYS.appointments.all,
    queryFn: () => appointmentApiService.getAppointments(),
  });

  // Status Mutation for updating appointment status live
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) =>
      appointmentApiService.updateAppointmentStatus(id, { status }),
    onSuccess: (updated) => {
      showToast.success('Status Updated', `Appointment marked as ${updated.status}`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments.all });
      if (selectedAppt && selectedAppt.id === updated.id) {
        setSelectedAppt(updated);
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update status';
      showToast.error('Update Failed', msg);
    },
  });

  // Stylists columns
  const stylists = useMemo(() => {
    if (staffList.length > 0) {
      return staffList.slice(0, 4).map((s) => ({ id: s.id, name: s.name, avatarUrl: s.profilePicture }));
    }
    return [
      { id: 'stf_1', name: 'Alex Johnson', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
      { id: 'stf_2', name: 'Sophia Martinez', avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80' },
      { id: 'stf_3', name: 'Ryan Cooper', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
      { id: 'stf_4', name: 'Olivia Rhye', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    ];
  }, [staffList]);

  // Strict API Appointments from DB (No fallback mock data)
  const allAppointments: AppointmentItem[] = useMemo(() => {
    return apiAppointments || [];
  }, [apiAppointments]);

  // Filtered list for grid and table based on status filter AND view date/range
  const filteredAppointments = useMemo(() => {
    return allAppointments.filter((a) => {
      if (selectedStatusFilter !== 'all' && a.status !== selectedStatusFilter) return false;

      const apptDate = getApptDate(a);
      if (!apptDate || isNaN(apptDate.getTime())) return true;

      if (viewMode === 'Day') {
        return (
          apptDate.getFullYear() === currentDate.getFullYear() &&
          apptDate.getMonth() === currentDate.getMonth() &&
          apptDate.getDate() === currentDate.getDate()
        );
      } else if (viewMode === 'Week') {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return apptDate >= startOfWeek && apptDate <= endOfWeek;
      } else if (viewMode === 'Month') {
        return (
          apptDate.getFullYear() === currentDate.getFullYear() &&
          apptDate.getMonth() === currentDate.getMonth()
        );
      }

      return true;
    });
  }, [allAppointments, selectedStatusFilter, currentDate, viewMode]);

  // Date Navigation Handlers
  const handlePrevDate = () => {
    const next = new Date(currentDate);
    if (viewMode === 'Day') next.setDate(next.getDate() - 1);
    else if (viewMode === 'Week') next.setDate(next.getDate() - 7);
    else next.setMonth(next.getMonth() - 1);
    setCurrentDate(next);
  };

  const handleNextDate = () => {
    const next = new Date(currentDate);
    if (viewMode === 'Day') next.setDate(next.getDate() + 1);
    else if (viewMode === 'Week') next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  // Dynamic Grid Columns based on viewMode
  const weekDays = useMemo(() => {
    const days: { date: Date; label: string }[] = [];
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek); // Sun
    startOfWeek.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      days.push({ date: d, label });
    }
    return days;
  }, [currentDate]);

  const gridColumns = useMemo(() => {
    if (viewMode === 'Week') {
      return weekDays.map((wd, i) => ({ id: `day_${i}`, name: wd.label }));
    }
    // Day view (or fallback): Stylists columns
    return stylists.length > 0
      ? stylists
      : [
          { id: 'stf_1', name: 'Alex Johnson' },
          { id: 'stf_2', name: 'Sophia Martinez' },
          { id: 'stf_3', name: 'Ryan Cooper' },
          { id: 'stf_4', name: 'Olivia Rhye' },
        ];
  }, [viewMode, weekDays, stylists]);

  const getGridBlockPositionWithoutOverlap = (appt: AppointmentItem) => {
    let colIdx = 0;
    const apptDate = getApptDate(appt);

    if (viewMode === 'Week' && apptDate && weekDays.length === 7) {
      const startOfWeek = weekDays[0].date;
      const apptDayStart = new Date(apptDate);
      apptDayStart.setHours(0, 0, 0, 0);
      const diffDays = Math.round((apptDayStart.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
      colIdx = Math.max(0, Math.min(6, diffDays));
    } else {
      let idx = stylists.findIndex((s) => s.id === appt.staffId || s.name === appt.staff?.name);
      if (idx === -1) idx = 0;
      colIdx = idx;
    }

    let hour = 9;
    let minutes = 0;

    if (appt.startAt) {
      const dt = new Date(appt.startAt);
      hour = dt.getHours();
      minutes = dt.getMinutes();
    }

    const totalMinFrom9 = Math.max(0, (hour - 9) * 60 + minutes);
    const topPx = Math.round((totalMinFrom9 / 60) * 65);
    const duration = appt.durationMinutes || 45;
    const heightPx = Math.max(45, Math.round((duration / 60) * 65));

    return { colIdx, topPx, heightPx };
  };

  // Helper to map appointment to grid position and calculate overlap
  const getGridBlockPosition = (appt: AppointmentItem, allFiltered: AppointmentItem[]) => {
    let colIdx = 0;
    const apptDate = getApptDate(appt);

    if (viewMode === 'Week' && apptDate && weekDays.length === 7) {
      const startOfWeek = weekDays[0].date;
      const apptDayStart = new Date(apptDate);
      apptDayStart.setHours(0, 0, 0, 0);
      const diffDays = Math.round((apptDayStart.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
      colIdx = Math.max(0, Math.min(6, diffDays));
    } else {
      let idx = stylists.findIndex((s) => s.id === appt.staffId || s.name === appt.staff?.name);
      if (idx === -1) idx = 0;
      colIdx = idx;
    }

    let hour = 9;
    let minutes = 0;

    if (appt.startAt) {
      const dt = new Date(appt.startAt);
      hour = dt.getHours();
      minutes = dt.getMinutes();
    }

    const totalMinFrom9 = Math.max(0, (hour - 9) * 60 + minutes);
    const topPx = Math.round((totalMinFrom9 / 60) * 65);
    const duration = appt.durationMinutes || 45;
    const heightPx = Math.max(45, Math.round((duration / 60) * 65));

    // Overlap sub-column calculation within the same column
    const sameColAppts = allFiltered.filter((other) => {
      const otherPos = getGridBlockPositionWithoutOverlap(other);
      if (otherPos.colIdx !== colIdx) return false;
      const otherTop = otherPos.topPx;
      const otherBottom = otherTop + otherPos.heightPx;
      const currentBottom = topPx + heightPx;
      return topPx < otherBottom && currentBottom > otherTop;
    });

    const subTotal = sameColAppts.length || 1;
    const subIdx = sameColAppts.findIndex((other) => other.id === appt.id);

    return { colIdx, topPx, heightPx, subIdx: Math.max(0, subIdx), subTotal };
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const formattedDateTitle = useMemo(() => {
    if (viewMode === 'Day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
    if (viewMode === 'Week') {
      const start = new Date(currentDate);
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      
      const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${startStr} - ${endStr}`;
    }
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentDate, viewMode]);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const handleOpenApptDetails = (appt: AppointmentItem) => {
    setSelectedAppt(appt);
    setIsDrawerOpen(true);
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        {/* Top Calendar Controls & Date Title */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {/* Date Title */}
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', minWidth: 260 }}>
              {formattedDateTitle}
            </Typography>

            {/* Date Navigation Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton size="small" onClick={handlePrevDate} sx={{ border: (t) => `1px solid ${t.palette.divider}`, borderRadius: '8px' }}>
                <ChevronLeft size={18} />
              </IconButton>
              <Button
                size="small"
                onClick={handleToday}
                sx={{ borderRadius: '8px', fontSize: '0.78125rem', fontWeight: 700, px: 1.5, py: 0.5, border: (t) => `1px solid ${t.palette.divider}`, color: 'text.primary', textTransform: 'none' }}
              >
                Today
              </Button>
              <IconButton size="small" onClick={handleNextDate} sx={{ border: (t) => `1px solid ${t.palette.divider}`, borderRadius: '8px' }}>
                <ChevronRight size={18} />
              </IconButton>
            </Box>

            {/* Day / Week / Month Switcher */}
            <Box
              sx={{
                display: 'flex',
                backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#F3F4F6'),
                p: 0.5,
                borderRadius: '10px',
                border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'),
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
                    backgroundColor: (t) =>
                      viewMode === mode
                        ? t.palette.mode === 'dark'
                          ? '#7C3AED'
                          : '#FFFFFF'
                        : 'transparent',
                    color: (t) =>
                      viewMode === mode
                        ? t.palette.mode === 'dark'
                          ? '#FFFFFF'
                          : '#7C3AED'
                        : 'text.secondary',
                    boxShadow: viewMode === mode ? '0px 2px 6px rgba(0, 0, 0, 0.12)' : 'none',
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
                backgroundColor: '#7C3AED',
                fontWeight: 700,
                px: 2.5,
                py: 1,
                textTransform: 'none',
                boxShadow: '0px 6px 16px rgba(124, 58, 237, 0.3)',
                '&:hover': { backgroundColor: '#6D28D9' },
              }}
              onClick={() => setIsAddModalOpen(true)}
            >
              + New Appointment
            </Button>

            <Select
              size="small"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 38, minWidth: 130 }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Main Section: Interactive Resource Grid (Left 67%) & Appointments Table (Right 33%) */}
        <Grid container spacing={3}>
          {/* Left Column: Resource Grid */}
          <Grid size={{ xs: 12, lg: 8, xl: 8 }}>
            <Card
              sx={{
                borderRadius: '20px',
                border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #F3F4F6'),
                p: 2.5,
                overflowX: 'auto',
                backgroundColor: (t) => (t.palette.mode === 'dark' ? t.palette.background.paper : '#FFFFFF'),
              }}
            >
              <Box sx={{ minWidth: 600, position: 'relative' }}>
                {/* Header Columns */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: `70px repeat(${gridColumns.length}, 1fr)`,
                    borderBottom: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB'),
                    pb: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Typography variant="caption" align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    Time
                  </Typography>
                  {gridColumns.map((col: any) => (
                    <Box key={col.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                      {viewMode !== 'Week' && (
                        <Avatar 
                          name={col.name} 
                          src={col.avatarUrl ? (col.avatarUrl.startsWith('http') ? col.avatarUrl : `${env.apiUrl}${col.avatarUrl}`) : undefined} 
                          sx={{ width: 32, height: 32, mb: 0.5 }} 
                        />
                      )}
                      <Typography variant="subtitle2" align="center" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {col.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Resource Grid Body */}
                <Box sx={{ position: 'relative', minHeight: 780 }}>
                  {/* Time Slot Horizontal Lines */}
                  {timeSlots.map((time, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: `70px repeat(${gridColumns.length}, 1fr)`,
                        height: 65,
                        borderBottom: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #F3F4F6'),
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600, pt: 0.5, color: 'text.secondary', fontSize: '0.72rem' }}>
                        {time}
                      </Typography>
                      {gridColumns.map((col) => (
                        <Box key={col.id} sx={{ borderLeft: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #F3F4F6'), height: '100%' }} />
                      ))}
                    </Box>
                  ))}

                  {/* Live Rendered Appointment Blocks */}
                  {filteredAppointments.map((appt) => {
                    const { colIdx, topPx, heightPx, subIdx, subTotal } = getGridBlockPosition(appt, filteredAppointments);
                    const numCols = gridColumns.length || 1;
                    
                    const colWidthCalc = `((100% - 70px) / ${numCols})`;
                    const leftCalc = `calc(70px + ${colWidthCalc} * ${colIdx} + ${colWidthCalc} * ${subIdx} / ${subTotal} + 2px)`;
                    const widthCalc = `calc(${colWidthCalc} / ${subTotal} - 4px)`;
                    const cfg = getStatusConfig(appt.status);

                    const customerName = appt.customer?.name || 'Customer';
                    const serviceName = appt.serviceName || appt.service?.name || 'Service';
                    const startStr = new Date(appt.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                    const endStr = new Date(appt.endAt || appt.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

                    return (
                      <Box
                        key={appt.id}
                        onClick={() => handleOpenApptDetails(appt)}
                        sx={{
                          position: 'absolute',
                          top: `${topPx}px`,
                          left: leftCalc,
                          width: widthCalc,
                          height: `${heightPx}px`,
                          backgroundColor: (t) => (t.palette.mode === 'dark' ? `${cfg.color}33` : cfg.bg),
                          border: (t) => (t.palette.mode === 'dark' ? `1px solid ${cfg.color}AA` : `1px solid ${cfg.border}`),
                          borderLeft: `4px solid ${cfg.color}`,
                          borderRadius: '8px',
                          p: 0.8,
                          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
                          cursor: 'pointer',
                          zIndex: 10 + subIdx,
                          overflow: 'hidden',
                          transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            zIndex: 99,
                            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.4)',
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          noWrap
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.8125rem',
                            color: (t) => (t.palette.mode === 'dark' ? '#F8FAFC' : cfg.textDark),
                          }}
                        >
                          {customerName}
                        </Typography>
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{
                            fontSize: '0.72rem',
                            display: 'block',
                            color: (t) => (t.palette.mode === 'dark' ? '#CBD5E1' : cfg.textDark),
                            opacity: 0.9,
                          }}
                        >
                          {serviceName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.2,
                            fontSize: '0.6875rem',
                            display: 'block',
                            color: (t) => (t.palette.mode === 'dark' ? '#94A3B8' : cfg.textDark),
                            opacity: 0.8,
                          }}
                        >
                          {startStr} - {endStr}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Right Column: Live Appointments Data Table */}
          <Grid size={{ xs: 12, lg: 4, xl: 4 }}>
            <Card
              sx={{
                borderRadius: '20px',
                border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #F3F4F6'),
                p: 2.5,
                backgroundColor: (t) => (t.palette.mode === 'dark' ? t.palette.background.paper : '#FFFFFF'),
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  Today's Appointments
                </Typography>
                <Chip label={`${filteredAppointments.length} Bookings`} size="small" sx={{ backgroundColor: 'rgba(124, 58, 237, 0.15)', color: '#A78BFA', fontWeight: 800 }} />
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #F3F4F6') } }}>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Service</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">No appointments found.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.map((appt) => {
                        const cfg = getStatusConfig(appt.status);
                        const timeStr = new Date(appt.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                        return (
                          <TableRow
                            key={appt.id}
                            hover
                            onClick={() => handleOpenApptDetails(appt)}
                            sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
                          >
                            <TableCell sx={{ fontSize: '0.78125rem', fontWeight: 600, color: 'text.secondary' }}>
                              {timeStr}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'text.primary' }}>
                              {appt.customer?.name || 'Customer'}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.78125rem', color: 'text.secondary' }}>
                              {appt.serviceName || appt.service?.name || 'Service'}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={cfg.label}
                                size="small"
                                sx={{
                                  backgroundColor: cfg.bg,
                                  color: cfg.color,
                                  fontWeight: 700,
                                  height: 20,
                                  fontSize: '0.65rem',
                                  borderRadius: '6px',
                                }}
                              />
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.8125rem', fontWeight: 800, color: 'text.primary' }}>
                              ₹{appt.price || 450}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
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
                  borderTop: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Showing 1 to {filteredAppointments.length} of {allAppointments.length} appointments
                </Typography>

                <Pagination count={1} page={1} size="small" color="primary" />
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Modal to Add New Appointment */}
        <AddAppointmentModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

        {/* Interactive Appointment Details Side Drawer */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          slotProps={{
            paper: {
              sx: {
                width: { xs: '100%', sm: 400 },
                p: 3,
                borderTopLeftRadius: '20px',
                borderBottomLeftRadius: '20px',
                backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
                color: 'text.primary',
                borderLeft: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
              },
            },
          }}
        >
          {selectedAppt && (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: 'text.primary' }}>
                  Appointment Details
                </Typography>
                <IconButton onClick={() => setIsDrawerOpen(false)} size="small" sx={{ color: 'text.secondary' }}>
                  <X size={18} />
                </IconButton>
              </Box>

              {/* Customer Avatar & Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, pb: 2, borderBottom: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6') }}>
                <Avatar name={selectedAppt.customer?.name || 'Customer'} sx={{ width: 52, height: 52 }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      {selectedAppt.customer?.name || 'Customer'}
                    </Typography>
                    <Chip
                      label={getStatusConfig(selectedAppt.status).label}
                      size="small"
                      sx={{
                        backgroundColor: getStatusConfig(selectedAppt.status).bg,
                        color: getStatusConfig(selectedAppt.status).color,
                        fontWeight: 800,
                        height: 18,
                        fontSize: '0.65rem',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
                    {selectedAppt.customer?.phone || '+91 98765 43210'}
                  </Typography>
                </Box>
              </Box>

              {/* Appointment Key Fields */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Service</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>{selectedAppt.serviceName || selectedAppt.service?.name || 'Service'}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Assigned Staff</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>{selectedAppt.staff?.name || 'Stylist'}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Scheduled Date</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {new Date(selectedAppt.startAt || selectedAppt.appointmentDate || currentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Time Slot</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {new Date(selectedAppt.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedAppt.endAt || selectedAppt.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Price</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.primary' }}>₹{selectedAppt.price || 450}</Typography>
                </Box>

                {selectedAppt.customerNotes && (
                  <Box sx={{ backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#F9FAFB'), p: 1.5, borderRadius: '10px' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.3 }}>
                      Customer Notes
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.primary' }}>
                      {selectedAppt.customerNotes}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Status Action Buttons */}
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                Update Appointment Status
              </Typography>

              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid size={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    disabled={updateStatusMutation.isPending || selectedAppt.status === 'CONFIRMED'}
                    onClick={() => updateStatusMutation.mutate({ id: selectedAppt.id, status: 'CONFIRMED' })}
                    startIcon={<CheckCircle2 size={15} />}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.78125rem', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                  >
                    Confirm
                  </Button>
                </Grid>
                <Grid size={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    disabled={updateStatusMutation.isPending || selectedAppt.status === 'IN_PROGRESS'}
                    onClick={() => updateStatusMutation.mutate({ id: selectedAppt.id, status: 'IN_PROGRESS' })}
                    startIcon={<PlayCircle size={15} />}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.78125rem', color: '#7C3AED', borderColor: 'rgba(124, 58, 237, 0.3)' }}
                  >
                    Start Service
                  </Button>
                </Grid>
                <Grid size={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    disabled={updateStatusMutation.isPending || selectedAppt.status === 'COMPLETED'}
                    onClick={() => updateStatusMutation.mutate({ id: selectedAppt.id, status: 'COMPLETED' })}
                    startIcon={<CheckCircle2 size={15} />}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.78125rem', color: '#059669', borderColor: 'rgba(5, 150, 105, 0.3)' }}
                  >
                    Complete
                  </Button>
                </Grid>
                <Grid size={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    disabled={updateStatusMutation.isPending || selectedAppt.status === 'CANCELLED'}
                    onClick={() => updateStatusMutation.mutate({ id: selectedAppt.id, status: 'CANCELLED' })}
                    startIcon={<XCircle size={15} />}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.78125rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Drawer>
      </DashboardLayout>
    </AuthGuard>
  );
}
