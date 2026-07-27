'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Menu from '@mui/material/Menu';
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit2,
  MoreVertical,
  X,
  Phone,
  MessageSquare,
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  Building2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import { Avatar } from '@/shared/ui/Avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentApiService, AppointmentItem } from '@/services/api/appointment.service';
import { customerApiService } from '@/services/api/customer.service';
import { staffApiService } from '@/services/api/staff.service';
import { catalogApiService } from '@/services/api/catalog.service';
import { TableRowSkeleton } from '@/shared/components/loaders';
import { AddAppointmentModal } from '@/shared/components/modals/AddAppointmentModal';
// --- Start of Component ---

export default function AppointmentsPage() {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals Open State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState<boolean>(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  // Queries
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', selectedTab, selectedStatus, selectedStaff],
    queryFn: () => appointmentApiService.getAppointments(),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerApiService.getCustomers(),
  });

  const { data: staff = [] } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffApiService.getStaff(),
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => catalogApiService.getServices(),
  });

  // Mutations
  const createAppointmentMutation = useMutation({
    mutationFn: appointmentApiService.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsAddModalOpen(false);
      setFormData({ customerId: '', staffId: '', serviceId: '', startAt: '', source: 'ADMIN' });
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => appointmentApiService.rescheduleAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsRescheduleModalOpen(false);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => appointmentApiService.cancelAppointment(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      // Close any open modals
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: any }) => appointmentApiService.updateAppointmentStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  // Currently Selected Appointment for Edit / Reschedule / Details
  const [currentAppointment, setCurrentAppointment] = useState<AppointmentItem | null>(null);

  // Form Data for Create
  const [formData, setFormData] = useState({
    customerId: '',
    staffId: '',
    serviceId: '',
    startAt: '',
    source: 'ADMIN',
    customerNotes: '',
  });

  // Action Menu Anchor State
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTargetApt, setMenuTargetApt] = useState<AppointmentItem | null>(null);

  // Status Chip Style Helper
  const getStatusChipProps = (status: AppointmentItem['status']) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#FEF3C7', color: '#D97706' };
      case 'CONFIRMED':
        return { bg: '#F3E8FF', color: '#7C3AED' };
      case 'IN_PROGRESS':
        return { bg: '#EFF6FF', color: '#3B82F6' };
      case 'COMPLETED':
        return { bg: '#ECFDF5', color: '#10B981' };
      case 'CANCELLED':
      case 'NO_SHOW':
        return { bg: '#FEE2E2', color: '#EF4444' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  // Open Handlers
  const handleOpenDetails = (apt: AppointmentItem) => {
    setCurrentAppointment(apt);
    setIsDetailsDrawerOpen(true);
  };

  const handleOpenEdit = (apt: AppointmentItem) => {
    setCurrentAppointment(apt);
    setIsEditModalOpen(true);
    setMenuAnchorEl(null);
  };

  const handleOpenReschedule = (apt: AppointmentItem) => {
    setCurrentAppointment(apt);
    setIsRescheduleModalOpen(true);
    setMenuAnchorEl(null);
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', maxWidth: '100%', pb: 4 }}>
          {/* Page Header Title & Controls */}
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
            <PageHeader
              title="Appointments"
              subtitle="Manage and view all your appointments"
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Download size={16} />}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#E5E7EB',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  py: 0.9,
                  px: 2,
                  textTransform: 'none',
                }}
              >
                Export
              </Button>

              <Button
                variant="contained"
                onClick={() => setIsAddModalOpen(true)}
                startIcon={<Plus size={18} />}
                sx={{
                  borderRadius: '12px',
                  backgroundColor: '#7C3AED',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  py: 1,
                  px: 2.5,
                  textTransform: 'none',
                  boxShadow: '0px 4px 14px rgba(124, 58, 237, 0.25)',
                  '&:hover': { backgroundColor: '#6D28D9' },
                }}
              >
                + New Appointment
              </Button>
            </Box>
          </Box>

          {/* Main Card Container */}
          <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
            {/* Status Filter Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
              <Tabs
                value={selectedTab}
                onChange={(_, val) => setSelectedTab(val)}
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    minWidth: 'auto',
                    px: 2.5,
                  },
                }}
              >
                <Tab label="All" />
                <Tab label="Upcoming" />
                <Tab label="In Progress" />
                <Tab label="Completed" />
                <Tab label="Cancelled" />
              </Tabs>
            </Box>

            {/* Filter Bar Controls */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'stretch', md: 'center' },
                justifyContent: 'space-between',
                gap: 2,
                mb: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', flexGrow: 1 }}>
                <TextField
                  placeholder="Search appointment..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: { xs: '100%', sm: 240 },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '0.84rem',
                      height: 38,
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={16} color="#9CA3AF" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Select
                  size="small"
                  defaultValue="24_jul"
                  sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 38, minWidth: 160 }}
                >
                  <MenuItem value="24_jul">24 Jul 2025 - 24 Jul 2025</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                </Select>

                <Select
                  size="small"
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 38, minWidth: 130 }}
                >
                  <MenuItem value="all">All Staff</MenuItem>
                  <MenuItem value="rahul">Rahul Mehta</MenuItem>
                  <MenuItem value="neha">Neha Kapoor</MenuItem>
                  <MenuItem value="amit">Amit Kumar</MenuItem>
                </Select>

                <Select
                  size="small"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 38, minWidth: 130 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </Box>

              <Button
                variant="outlined"
                startIcon={<Filter size={16} />}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#E5E7EB',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  py: 0.8,
                  px: 2,
                  textTransform: 'none',
                }}
              >
                Filters
              </Button>
            </Box>

            {/* Main Appointments Table */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '1px solid #F3F4F6', py: 1.2 } }}>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Client</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Staff</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Amount</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRowSkeleton columns={7} rows={6} hasAvatar={true} />
                  ) : appointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">No appointments found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : appointments.map((apt) => {
                    const statusProps = getStatusChipProps(apt.status);
                    const startTime = new Date(apt.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                      <TableRow
                        key={apt.id}
                        hover
                        sx={{
                          cursor: 'pointer',
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                          {startTime}
                        </TableCell>

                        <TableCell onClick={() => handleOpenDetails(apt)}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Avatar name={apt.customer?.name || 'Unknown'} sx={{ width: 32, height: 32 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827' }}>
                              {apt.customer?.name || 'Unknown'}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>
                          {apt.service?.name || apt.serviceName}
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar name={apt.staff?.name || 'Unknown'} sx={{ width: 26, height: 26 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>
                              {apt.staff?.name || 'Unknown'}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={apt.status.replace('_', ' ')}
                            size="small"
                            sx={{
                              backgroundColor: statusProps.bg,
                              color: statusProps.color,
                              fontWeight: 700,
                              fontSize: '0.6875rem',
                              height: 22,
                              borderRadius: '6px',
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ fontWeight: 800, fontSize: '0.84rem', color: '#111827' }}>
                          ₹{apt.price}
                        </TableCell>

                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            <IconButton size="small" onClick={() => handleOpenDetails(apt)}>
                              <Eye size={16} color="#6B7280" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleOpenEdit(apt)}>
                              <Edit2 size={16} color="#6B7280" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                setMenuAnchorEl(e.currentTarget);
                                setMenuTargetApt(apt);
                              }}
                            >
                              <MoreVertical size={16} color="#6B7280" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Footer */}
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
                Showing 1 to 8 of 32 appointments
              </Typography>

              <Pagination count={4} page={1} size="small" color="primary" />
            </Box>
          </Card>

          {/* Row Actions Menu (Reschedule / Cancel) */}
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={() => setMenuAnchorEl(null)}
            slotProps={{ paper: { sx: { borderRadius: '12px', minWidth: 160 } } }}
          >
            <MenuItem
              onClick={() => {
                if (menuTargetApt) handleOpenReschedule(menuTargetApt);
              }}
            >
              <CalendarIcon size={16} style={{ marginRight: 8, color: '#3B82F6' }} />
              Reschedule
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMenuAnchorEl(null);
              }}
              sx={{ color: 'error.main' }}
            >
              <XCircle size={16} style={{ marginRight: 8, color: '#EF4444' }} />
              Cancel Appointment
            </MenuItem>
          </Menu>

          {/* ========================================================================= */}
          {/* 1. ADD NEW APPOINTMENT MODAL */}
          {/* ========================================================================= */}
          <AddAppointmentModal 
            open={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
          />

          {/* ========================================================================= */}
          {/* 2. EDIT APPOINTMENT MODAL */}
          {/* ========================================================================= */}
          <Dialog
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            maxWidth="lg"
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              Edit Appointment
              <IconButton onClick={() => setIsEditModalOpen(false)} size="small">
                <X size={18} />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ border: 'none' }}>
              <Grid container spacing={3}>
                {/* Left Form (8 Cols) */}
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Grid container spacing={3}>
                    {/* Client Details */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#111827' }}>
                        Client Details
                      </Typography>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '12px',
                          backgroundColor: '#FAFAFC',
                          border: '1px solid #E5E7EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <Avatar name={currentAppointment?.customer?.name || 'Unknown'} sx={{ width: 34, height: 34 }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem' }}>
                              {currentAppointment?.customer?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {currentAppointment?.customer?.phone || 'No phone'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                        Contact Number
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={currentAppointment?.customer?.phone || ''}
                        disabled
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                      />

                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                        Notes
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={currentAppointment?.customerNotes || ''}
                        disabled
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                      />
                    </Grid>

                    {/* Appointment Details */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#111827' }}>
                        Appointment Details
                      </Typography>

                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                        Service *
                      </Typography>
                      <Select fullWidth size="small" value={currentAppointment?.serviceId || ''} disabled sx={{ mb: 2, borderRadius: '10px' }}>
                        <MenuItem value={currentAppointment?.serviceId || ''}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span>{currentAppointment?.service?.name || currentAppointment?.serviceName}</span>
                            <strong style={{ color: '#7C3AED' }}>₹{currentAppointment?.price}</strong>
                          </Box>
                        </MenuItem>
                      </Select>

                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                        Staff *
                      </Typography>
                      <Select fullWidth size="small" value={currentAppointment?.staffId || ''} disabled sx={{ mb: 2, borderRadius: '10px' }}>
                        <MenuItem value={currentAppointment?.staffId || ''}>{currentAppointment?.staff?.name}</MenuItem>
                      </Select>

                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                            Date *
                          </Typography>
                          <TextField fullWidth size="small" value={currentAppointment?.startAt ? new Date(currentAppointment.startAt).toLocaleDateString() : ''} disabled sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                            Time *
                          </Typography>
                          <TextField fullWidth size="small" value={currentAppointment?.startAt ? new Date(currentAppointment.startAt).toLocaleTimeString() : ''} disabled sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Right Info Sidebar (4 Cols) */}
                <Grid size={{ xs: 12, lg: 4 }}>
                  <Card sx={{ borderRadius: '16px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FAFAFC' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#111827' }}>
                      Appointment Info
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Status</Typography>
                        <Select 
                          size="small" 
                          value={currentAppointment?.status || 'PENDING'}
                          onChange={(e) => updateStatusMutation.mutate({ id: currentAppointment?.id!, status: e.target.value as any })}
                          disabled={updateStatusMutation.isPending}
                          sx={{ height: 30, borderRadius: '8px' }}
                        >
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                          <MenuItem value="COMPLETED">Completed</MenuItem>
                          <MenuItem value="NO_SHOW">No Show</MenuItem>
                        </Select>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Booking ID</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{currentAppointment?.id?.slice(0, 8)}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Created At</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{currentAppointment?.createdAt ? new Date(currentAppointment.createdAt).toLocaleDateString() : ''}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Source</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{currentAppointment?.source}</Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setIsEditModalOpen(false)} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => setIsEditModalOpen(false)}
                sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          {/* ========================================================================= */}
          {/* 3. RESCHEDULE APPOINTMENT MODAL */}
          {/* ========================================================================= */}
          <Dialog
            open={isRescheduleModalOpen}
            onClose={() => setIsRescheduleModalOpen(false)}
            maxWidth="md"
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              Reschedule Appointment
              <IconButton onClick={() => setIsRescheduleModalOpen(false)} size="small">
                <X size={18} />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ border: 'none' }}>
              <Alert severity="info" sx={{ borderRadius: '12px', mb: 2.5, fontWeight: 600, fontSize: '0.84rem' }}>
                Rescheduling Appointment — You are about to reschedule this appointment. The client will be notified.
              </Alert>

              {/* Client & Service Summary Header */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  backgroundColor: '#FAFAFC',
                  border: '1px solid #F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar name={currentAppointment?.customer?.name || 'Unknown'} sx={{ width: 40, height: 40 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.9rem' }}>
                      {currentAppointment?.customer?.name || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {currentAppointment?.customer?.phone || 'No phone'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    {currentAppointment?.service?.name || currentAppointment?.serviceName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    with {currentAppointment?.staff?.name} • <strong style={{ color: '#7C3AED' }}>₹{currentAppointment?.price}</strong>
                  </Typography>
                </Box>
              </Box>

              {/* Side-by-Side Date & Time Comparison Box */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                {/* Current Appointment (Yellow Box) */}
                <Grid size={{ xs: 12, sm: 5.5 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '14px',
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FEF3C7',
                    }}
                  >
                    <Typography variant="caption" color="#92400E" sx={{ fontWeight: 800, display: 'block', mb: 1 }}>
                      Current Appointment
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827' }}>
                      📅 {currentAppointment?.startAt ? new Date(currentAppointment.startAt).toLocaleDateString() : ''}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827', mt: 0.5 }}>
                      🕒 {currentAppointment?.startAt ? new Date(currentAppointment.startAt).toLocaleTimeString() : ''}
                    </Typography>
                  </Box>
                </Grid>

                {/* Center Arrow */}
                <Grid size={{ xs: 12, sm: 1 }} sx={{ textAlign: 'center' }}>
                  <ArrowRight size={24} color="#9CA3AF" />
                </Grid>

                {/* New Appointment (Green Box) */}
                <Grid size={{ xs: 12, sm: 5.5 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '14px',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #D1FAE5',
                    }}
                  >
                    <Typography variant="caption" color="#065F46" sx={{ fontWeight: 800, display: 'block', mb: 1 }}>
                      New Appointment
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      defaultValue="26 Jul 2025"
                      sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#FFFFFF' } }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      defaultValue="02:00 PM"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#FFFFFF' } }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Reason For Reschedule */}
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                Reason for Reschedule (Optional)
              </Typography>
              <Select fullWidth size="small" defaultValue="client_request" sx={{ mb: 2, borderRadius: '10px' }}>
                <MenuItem value="client_request">Client Request</MenuItem>
                <MenuItem value="staff_unavailable">Staff Unavailable</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
              </Select>

              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                Notes (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Add any notes..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setIsRescheduleModalOpen(false)} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => setIsRescheduleModalOpen(false)}
                sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}
              >
                Confirm Reschedule
              </Button>
            </DialogActions>
          </Dialog>

          {/* ========================================================================= */}
          {/* 4. APPOINTMENT DETAILS SIDE DRAWER / MODAL */}
          {/* ========================================================================= */}
          <Dialog
            open={isDetailsDrawerOpen}
            onClose={() => setIsDetailsDrawerOpen(false)}
            maxWidth="sm"
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <span>Appointment Details</span>
                <Chip label={currentAppointment?.status} size="small" sx={{ backgroundColor: '#F3E8FF', color: '#7C3AED', fontWeight: 700 }} />
              </Box>
              <IconButton onClick={() => setIsDetailsDrawerOpen(false)} size="small">
                <X size={18} />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ border: 'none' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mb: 2 }}>
                Appointment ID: <strong>{currentAppointment?.id?.slice(0, 8)}</strong>
              </Typography>

              {/* Client Info Card */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  backgroundColor: '#FAFAFC',
                  border: '1px solid #F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar name={currentAppointment?.customer?.name || 'Unknown'} sx={{ width: 44, height: 44 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>
                      {currentAppointment?.customer?.name || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {currentAppointment?.customer?.phone || 'No phone'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" sx={{ backgroundColor: '#EFF6FF', color: '#3B82F6', borderRadius: '10px' }}>
                    <Phone size={16} />
                  </IconButton>
                  <IconButton size="small" sx={{ backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '10px' }}>
                    <MessageSquare size={16} />
                  </IconButton>
                </Box>
              </Box>

              {/* Key Appointment Details List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Service</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                    {currentAppointment?.service?.name || currentAppointment?.serviceName} • <strong style={{ color: '#7C3AED' }}>₹{currentAppointment?.price}</strong>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Staff</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                    {currentAppointment?.staff?.name || 'Unknown'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Date & Time</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                    {currentAppointment?.startAt ? new Date(currentAppointment.startAt).toLocaleString() : ''}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Source</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                    {currentAppointment?.source}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Notes</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                    {currentAppointment?.customerNotes || 'No notes'}
                  </Typography>
                </Box>
              </Box>

              {/* Payment Information Box */}
              <Box sx={{ p: 2, borderRadius: '14px', backgroundColor: '#FAFAFC', border: '1px solid #F3F4F6' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#111827' }}>
                  Payment Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Amount</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{currentAppointment?.price}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Paid</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>₹0</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Payment Status</Typography>
                    <Chip label="Pending" size="small" sx={{ backgroundColor: '#FEF3C7', color: '#D97706', fontWeight: 700 }} />
                  </Box>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsDetailsDrawerOpen(false);
                  setIsEditModalOpen(true);
                }}
                sx={{ flex: 1, textTransform: 'none', fontWeight: 700, borderRadius: '10px', color: '#7C3AED', borderColor: '#E5E7EB' }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsDetailsDrawerOpen(false);
                  setIsRescheduleModalOpen(true);
                }}
                sx={{ flex: 1, textTransform: 'none', fontWeight: 700, borderRadius: '10px', color: '#3B82F6', borderColor: '#E5E7EB' }}
              >
                Reschedule
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsDetailsDrawerOpen(false)}
                sx={{ flex: 1, textTransform: 'none', fontWeight: 700, borderRadius: '10px', color: '#EF4444', borderColor: '#FEE2E2' }}
              >
                Cancel Appointment
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
