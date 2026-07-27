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
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Drawer from '@mui/material/Drawer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';
import Menu from '@mui/material/Menu';
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  X,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  Calendar as CalendarIcon,
  Clock,
  User,
  Coffee,
  CalendarOff,
  Upload,
  Check,
  Scissors,
  ShieldCheck,
} from 'lucide-react';
import { AddStaffModal } from './components/AddStaffModal';
import { TableRowSkeleton } from '@/shared/components/loaders';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import { Avatar } from '@/shared/ui/Avatar';

export interface StaffItem {
  id: string;
  empId: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  nextShift: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  avatar: string;
  dob: string;
  gender: string;
  joiningDate: string;
  workingHours: string;
  address: string;
  emergencyContact: string;
  notes: string;
  summary: {
    totalAppointments: number;
    completedToday: number;
    weeklyOff: string;
  };
}

const STAFF_DATA: StaffItem[] = [
  {
    id: '1',
    empId: 'EMP-1001',
    name: 'Rahul Mehta',
    role: 'Senior Stylist',
    department: 'Hair Services',
    phone: '+91 98765 43210',
    email: 'rahul.mehta@email.com',
    nextShift: 'Today, 10:00 AM',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    dob: '10 Feb 1990',
    gender: 'Male',
    joiningDate: '15 Jan 2023',
    workingHours: '9:00 AM - 6:00 PM',
    address: '123, Green Avenue, Downtown, Mumbai - 400001',
    emergencyContact: 'Priya Mehta (Wife) +91 91234 56789',
    notes: 'Excellent in hair coloring and client management.',
    summary: {
      totalAppointments: 128,
      completedToday: 5,
      weeklyOff: 'Monday',
    },
  },
  {
    id: '2',
    empId: 'EMP-1002',
    name: 'Neha Kapoor',
    role: 'Stylist',
    department: 'Hair Services',
    phone: '+91 87654 32109',
    email: 'neha.kapoor@email.com',
    nextShift: 'Today, 11:00 AM',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    dob: '22 Aug 1994',
    gender: 'Female',
    joiningDate: '01 Mar 2023',
    workingHours: '10:00 AM - 7:00 PM',
    address: '456, Palm Street, Bandra, Mumbai - 400050',
    emergencyContact: 'Vikram Kapoor (Brother) +91 98111 22334',
    notes: 'Specialist in hair treatment and keratin.',
    summary: {
      totalAppointments: 94,
      completedToday: 4,
      weeklyOff: 'Tuesday',
    },
  },
  {
    id: '3',
    empId: 'EMP-1003',
    name: 'Amit Kumar',
    role: 'Barber',
    department: 'Grooming',
    phone: '+91 91234 56789',
    email: 'amit.kumar@email.com',
    nextShift: 'Today, 09:30 AM',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    dob: '05 May 1991',
    gender: 'Male',
    joiningDate: '10 Jun 2023',
    workingHours: '9:00 AM - 6:00 PM',
    address: '789, Central Park, Andheri, Mumbai - 400053',
    emergencyContact: 'Sunita Kumar (Mother) +91 97777 88899',
    notes: 'Expert in beard trim and fade haircuts.',
    summary: {
      totalAppointments: 110,
      completedToday: 6,
      weeklyOff: 'Wednesday',
    },
  },
  {
    id: '4',
    empId: 'EMP-1004',
    name: 'Sneha Patel',
    role: 'Therapist',
    department: 'Skin & Spa',
    phone: '+91 99887 66543',
    email: 'sneha.patel@email.com',
    nextShift: 'Tomorrow, 10:00 AM',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    dob: '18 Dec 1993',
    gender: 'Female',
    joiningDate: '15 Aug 2023',
    workingHours: '10:00 AM - 7:00 PM',
    address: '12, Sea Face Road, Worli, Mumbai - 400018',
    emergencyContact: 'Rajesh Patel (Father) +91 96666 55555',
    notes: 'Experienced skin therapist and aesthetician.',
    summary: {
      totalAppointments: 76,
      completedToday: 3,
      weeklyOff: 'Thursday',
    },
  },
  {
    id: '5',
    empId: 'EMP-1005',
    name: 'Pooja Sharma',
    role: 'Receptionist',
    department: 'Front Desk',
    phone: '+91 95555 66778',
    email: 'pooja.sharma@email.com',
    nextShift: 'Tomorrow, 08:30 AM',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    dob: '12 Apr 1996',
    gender: 'Female',
    joiningDate: '01 Oct 2023',
    workingHours: '8:30 AM - 5:30 PM',
    address: '88, Hill Road, Juhu, Mumbai - 400049',
    emergencyContact: 'Anil Sharma (Father) +91 95555 44444',
    notes: 'Manages client bookings and point of sale.',
    summary: {
      totalAppointments: 0,
      completedToday: 0,
      weeklyOff: 'Sunday',
    },
  },
  {
    id: '6',
    empId: 'EMP-1006',
    name: 'Vikram Joshi',
    role: 'Colorist',
    department: 'Hair Services',
    phone: '+91 93333 44556',
    email: 'vikram.joshi@email.com',
    nextShift: 'Today, 12:00 PM',
    status: 'On Leave',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    dob: '30 Jul 1989',
    gender: 'Male',
    joiningDate: '20 Nov 2023',
    workingHours: '12:00 PM - 9:00 PM',
    address: '34, Garden View, Powai, Mumbai - 400076',
    emergencyContact: 'Meena Joshi (Wife) +91 93333 22222',
    notes: 'On casual leave today.',
    summary: {
      totalAppointments: 65,
      completedToday: 0,
      weeklyOff: 'Monday',
    },
  },
  {
    id: '7',
    empId: 'EMP-1007',
    name: 'Karan Malhotra',
    role: 'Junior Stylist',
    department: 'Hair Services',
    phone: '+91 90000 11122',
    email: 'karan.malhotra@email.com',
    nextShift: 'Today, 02:00 PM',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    dob: '15 Sep 1998',
    gender: 'Male',
    joiningDate: '01 Feb 2024',
    workingHours: '2:00 PM - 10:00 PM',
    address: '56, Lake Road, Thane, Mumbai - 400601',
    emergencyContact: 'Sanjay Malhotra (Father) +91 90000 99999',
    notes: 'Assists senior stylists and handles wash.',
    summary: {
      totalAppointments: 42,
      completedToday: 2,
      weeklyOff: 'Wednesday',
    },
  },
  {
    id: '8',
    empId: 'EMP-1008',
    name: 'Ananya Verma',
    role: 'Therapist',
    department: 'Skin & Spa',
    phone: '+91 87654 32198',
    email: 'ananya.verma@email.com',
    nextShift: 'Tomorrow, 11:30 AM',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    dob: '20 Oct 1992',
    gender: 'Female',
    joiningDate: '15 Mar 2024',
    workingHours: '11:30 AM - 8:30 PM',
    address: '101, Sky Tower, Malad, Mumbai - 400064',
    emergencyContact: 'Rohan Verma (Husband) +91 87654 11111',
    notes: 'Currently inactive staff member.',
    summary: {
      totalAppointments: 18,
      completedToday: 0,
      weeklyOff: 'Sunday',
    },
  },
];

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(false);
  const filteredStaff = STAFF_DATA;

  // Selected Staff Item
  const [selectedStaff, setSelectedStaff] = useState<StaffItem>(STAFF_DATA[0]);

  // Modals & Drawer Open State
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAssignServicesOpen, setIsAssignServicesOpen] = useState<boolean>(false);
  const [isAddBreakOpen, setIsAddBreakOpen] = useState<boolean>(false);
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState<boolean>(false);

  // Status Chip Helper
  const getStatusChipProps = (status: StaffItem['status']) => {
    switch (status) {
      case 'Active':
        return { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981' };
      case 'On Leave':
        return { bg: '#FFF7ED', color: '#F97316' };
      case 'Inactive':
        return { bg: '#F3F4F6', color: '#6B7280' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  const handleOpenProfile = (staff: StaffItem) => {
    setSelectedStaff(staff);
    setIsProfileDrawerOpen(true);
  };

  const handleOpenEdit = (staff: StaffItem) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
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
            <PageHeader
              title="Staff"
              subtitle="Manage your team members and their schedules"
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href={ROUTES.dashboard.staff.leaves}
                variant="outlined"
                startIcon={<Calendar size={16} />}
                sx={{ borderRadius: '12px', borderColor: '#E5E7EB', color: '#7C3AED', fontWeight: 700, fontSize: '0.84rem', py: 0.9, px: 2, textTransform: 'none' }}
              >
                Leave Management
              </Button>

              <Button
                component={Link}
                href={ROUTES.dashboard.staff.breaks}
                variant="outlined"
                startIcon={<Coffee size={16} />}
                sx={{ borderRadius: '12px', borderColor: '#E5E7EB', color: '#7C3AED', fontWeight: 700, fontSize: '0.84rem', py: 0.9, px: 2, textTransform: 'none' }}
              >
                Break Schedule
              </Button>

              <Button
                component={Link}
                href={ROUTES.dashboard.staff.services}
                variant="outlined"
                startIcon={<Scissors size={16} />}
                sx={{ borderRadius: '12px', borderColor: '#E5E7EB', color: '#7C3AED', fontWeight: 700, fontSize: '0.84rem', py: 0.9, px: 2, textTransform: 'none' }}
              >
                Service Assignment
              </Button>

              <Button
                component={Link}
                href={ROUTES.dashboard.settings.roles}
                variant="outlined"
                startIcon={<ShieldCheck size={16} />}
                sx={{ borderRadius: '12px', borderColor: '#E5E7EB', color: '#7C3AED', fontWeight: 700, fontSize: '0.84rem', py: 0.9, px: 2, textTransform: 'none' }}
              >
                Roles & Permissions
              </Button>

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
                + Add Staff
              </Button>
            </Box>
          </Box>

          {/* Main Content Card Container */}
          <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
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
                  placeholder="Search staff by name, phone, email..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: { xs: '100%', sm: 300 },
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
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 38, minWidth: 130 }}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="senior_stylist">Senior Stylist</MenuItem>
                  <MenuItem value="stylist">Stylist</MenuItem>
                  <MenuItem value="barber">Barber</MenuItem>
                  <MenuItem value="therapist">Therapist</MenuItem>
                  <MenuItem value="receptionist">Receptionist</MenuItem>
                  <MenuItem value="colorist">Colorist</MenuItem>
                </Select>

                <Select
                  size="small"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 38, minWidth: 130 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="on_leave">On Leave</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
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

            {/* Staff Data Table */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '1px solid #F3F4F6', py: 1.2 } }}>
                    <TableCell padding="checkbox">
                      <Checkbox size="small" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Staff</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Next Shift</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingStaff ? (
                    <TableRowSkeleton columns={8} rows={6} hasAvatar={true} />
                  ) : filteredStaff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">No staff found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredStaff.map((staff) => {
                    const isSelected = selectedStaff.id === staff.id;
                    const statusStyle = getStatusChipProps(staff.status);
                    return (
                      <TableRow
                        key={staff.id}
                        hover
                        selected={isSelected}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(124, 58, 237, 0.03)' : 'transparent',
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox size="small" checked={isSelected} />
                        </TableCell>

                        {/* Staff Info */}
                        <TableCell onClick={() => handleOpenProfile(staff)}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Avatar name={staff.name} src={staff.avatar} sx={{ width: 34, height: 34 }} />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827' }}>
                                {staff.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                                {staff.empId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 600 }}>
                          {staff.role}
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>
                          {staff.phone}
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                          {staff.email}
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 600 }}>
                          {staff.nextShift}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={staff.status}
                            size="small"
                            sx={{
                              backgroundColor: statusStyle.bg,
                              color: statusStyle.color,
                              fontWeight: 700,
                              fontSize: '0.6875rem',
                              height: 22,
                              borderRadius: '6px',
                            }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            <IconButton size="small" onClick={() => handleOpenProfile(staff)}>
                              <Eye size={16} color="#6B7280" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleOpenEdit(staff)}>
                              <Edit2 size={16} color="#6B7280" />
                            </IconButton>
                            <IconButton size="small">
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
                Showing 1 to 8 of 32 staff members
              </Typography>

              <Pagination count={4} page={1} size="small" color="primary" />
            </Box>
          </Card>

          {/* ========================================================================= */}
          {/* 1. STAFF PROFILE SIDE DRAWER */}
          {/* ========================================================================= */}
          <Drawer
            anchor="right"
            open={isProfileDrawerOpen}
            onClose={() => setIsProfileDrawerOpen(false)}
            slotProps={{
              paper: {
                sx: { width: { xs: '100%', md: 680, lg: 760 }, p: 3.5, borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' },
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>
                Staff Profile
              </Typography>
              <IconButton onClick={() => setIsProfileDrawerOpen(false)} size="small">
                <X size={18} />
              </IconButton>
            </Box>

            {/* Header Avatar & Summary Card */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar name={selectedStaff.name} src={selectedStaff.avatar} sx={{ width: 60, height: 60 }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>
                      {selectedStaff.name}
                    </Typography>
                    <Chip label={selectedStaff.role} size="small" sx={{ backgroundColor: '#F3E8FF', color: '#7C3AED', fontWeight: 800, height: 18, fontSize: '0.65rem' }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.78125rem', mt: 0.3 }}>
                    {selectedStaff.phone}
                  </Typography>
                  <Typography variant="caption" color="primary.main" sx={{ display: 'block', fontSize: '0.78125rem', fontWeight: 600 }}>
                    {selectedStaff.email} • <span style={{ color: '#10B981', fontWeight: 700 }}>{selectedStaff.status}</span>
                  </Typography>
                </Box>
              </Box>

              {/* Communication Icons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" sx={{ backgroundColor: '#EFF6FF', color: '#3B82F6', borderRadius: '10px' }}><Phone size={16} /></IconButton>
                <IconButton size="small" sx={{ backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '10px' }}><MessageCircle size={16} /></IconButton>
                <IconButton size="small" sx={{ backgroundColor: '#F3E8FF', color: '#7C3AED', borderRadius: '10px' }}><Mail size={16} /></IconButton>
              </Box>
            </Box>

            {/* Profile Sub Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={0}
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  minHeight: 36,
                  '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', minWidth: 'auto', px: 2 },
                }}
              >
                <Tab label="Overview" />
                <Tab label="Schedule" />
                <Tab label="Leaves" />
                <Tab label="Breaks" />
                <Tab label="Services" />
                <Tab label="Performance" />
                <Tab label="Documents" />
              </Tabs>
            </Box>

            {/* 3 Column Grid Section */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              {/* Column 1: Personal Information */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ borderRadius: '16px', border: '1px solid #F3F4F6', p: 2, backgroundColor: '#FFFFFF', height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.875rem' }}>
                      Personal Information
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<Edit2 size={12} />}
                      onClick={() => {
                        setIsProfileDrawerOpen(false);
                        setIsEditModalOpen(true);
                      }}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', color: '#7C3AED' }}
                    >
                      Edit
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Employee ID</Typography><Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>{selectedStaff.empId}</Typography></Box>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Date of Birth</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>{selectedStaff.dob}</Typography></Box>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Gender</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>{selectedStaff.gender}</Typography></Box>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Address</Typography><Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.78125rem', lineHeight: 1.4 }}>{selectedStaff.address}</Typography></Box>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Emergency Contact</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.78125rem' }}>{selectedStaff.emergencyContact}</Typography></Box>
                  </Box>
                </Card>
              </Grid>

              {/* Column 2: Work Information */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ borderRadius: '16px', border: '1px solid #F3F4F6', p: 2, backgroundColor: '#FFFFFF', height: '100%' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.875rem', mb: 1.5 }}>
                    Work Information
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Role</Typography><Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>{selectedStaff.role}</Typography></Box>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Department</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>{selectedStaff.department}</Typography></Box>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Date of Joining</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>{selectedStaff.joiningDate}</Typography></Box>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Status</Typography><Typography variant="body2" color="success.main" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>{selectedStaff.status}</Typography></Box>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Working Hours</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>{selectedStaff.workingHours}</Typography></Box>
                  </Box>
                </Card>
              </Grid>

              {/* Column 3: Summary */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ borderRadius: '16px', border: '1px solid #F3F4F6', p: 2, backgroundColor: '#FFFFFF', height: '100%' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.875rem', mb: 1.5 }}>
                    Summary
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Total Appointments</Typography><Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.9rem' }}>{selectedStaff.summary.totalAppointments}</Typography></Box>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Completed Today</Typography><Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.9rem' }}>{selectedStaff.summary.completedToday}</Typography></Box>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Next Shift</Typography><Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#7C3AED' }}>{selectedStaff.nextShift}</Typography></Box>
                    <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>Weekly Off</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>{selectedStaff.summary.weeklyOff}</Typography></Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Quick Actions Toolbar */}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.875rem', mb: 1.5, color: '#111827' }}>
              Quick Actions
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Button fullWidth variant="outlined" onClick={() => setIsAssignServicesOpen(true)} sx={{ borderRadius: '10px', color: '#7C3AED', borderColor: '#E5E7EB', fontWeight: 700, textTransform: 'none', fontSize: '0.78125rem' }}>
                  Assign Services
                </Button>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Button fullWidth variant="outlined" onClick={() => setIsAddLeaveOpen(true)} sx={{ borderRadius: '10px', color: '#7C3AED', borderColor: '#E5E7EB', fontWeight: 700, textTransform: 'none', fontSize: '0.78125rem' }}>
                  Add Leave
                </Button>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Button fullWidth variant="outlined" onClick={() => setIsAddBreakOpen(true)} sx={{ borderRadius: '10px', color: '#7C3AED', borderColor: '#E5E7EB', fontWeight: 700, textTransform: 'none', fontSize: '0.78125rem' }}>
                  Add Break
                </Button>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Button fullWidth variant="outlined" sx={{ borderRadius: '10px', color: '#EF4444', borderColor: '#FEE2E2', fontWeight: 700, textTransform: 'none', fontSize: '0.78125rem' }}>
                  Deactivate Staff
                </Button>
              </Grid>
            </Grid>
          </Drawer>

          {/* ========================================================================= */}
          {/* 2. ADD NEW STAFF MODAL */}
          {/* ========================================================================= */}
          <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              Add New Staff
              <IconButton onClick={() => setIsAddModalOpen(false)} size="small"><X size={18} /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ border: 'none' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#111827' }}>Personal Information</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Full Name *</Typography><TextField fullWidth size="small" placeholder="Enter full name" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Phone Number *</Typography><TextField fullWidth size="small" defaultValue="+91 " sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Email *</Typography><TextField fullWidth size="small" placeholder="Enter email address" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Date of Birth *</Typography><TextField fullWidth size="small" placeholder="Select date" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
                <Grid size={{ xs: 12, sm: 12 }}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Gender *</Typography><Select fullWidth size="small" defaultValue="" displayEmpty sx={{ borderRadius: '10px' }}><MenuItem value="" disabled>Select gender</MenuItem><MenuItem value="male">Male</MenuItem><MenuItem value="female">Female</MenuItem></Select></Grid>
              </Grid>

              <Divider sx={{ my: 1.5 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#111827' }}>Work Information</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Role *</Typography><Select fullWidth size="small" defaultValue="" displayEmpty sx={{ borderRadius: '10px' }}><MenuItem value="" disabled>Select role</MenuItem><MenuItem value="senior_stylist">Senior Stylist</MenuItem><MenuItem value="stylist">Stylist</MenuItem></Select></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Department *</Typography><Select fullWidth size="small" defaultValue="" displayEmpty sx={{ borderRadius: '10px' }}><MenuItem value="" disabled>Select department</MenuItem><MenuItem value="hair">Hair Services</MenuItem><MenuItem value="skin">Skin & Spa</MenuItem></Select></Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setIsAddModalOpen(false)} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
              <Button variant="contained" onClick={() => setIsAddModalOpen(false)} sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}>Save Staff</Button>
            </DialogActions>
          </Dialog>

          {/* ========================================================================= */}
          {/* 3. EDIT STAFF MODAL */}
          {/* ========================================================================= */}
          <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              Edit Staff
              <IconButton onClick={() => setIsEditModalOpen(false)} size="small"><X size={18} /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ border: 'none' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Full Name *</Typography><TextField fullWidth size="small" defaultValue={selectedStaff.name} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Phone Number *</Typography><TextField fullWidth size="small" defaultValue={selectedStaff.phone} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Role *</Typography><Select fullWidth size="small" defaultValue="senior_stylist" sx={{ borderRadius: '10px' }}><MenuItem value="senior_stylist">{selectedStaff.role}</MenuItem></Select></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Department *</Typography><Select fullWidth size="small" defaultValue="hair" sx={{ borderRadius: '10px' }}><MenuItem value="hair">{selectedStaff.department}</MenuItem></Select></Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setIsEditModalOpen(false)} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
              <Button variant="contained" onClick={() => setIsEditModalOpen(false)} sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}>Save Changes</Button>
            </DialogActions>
          </Dialog>

          {/* ========================================================================= */}
          {/* 4. ASSIGN SERVICES MODAL */}
          {/* ========================================================================= */}
          <Dialog open={isAssignServicesOpen} onClose={() => setIsAssignServicesOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.05rem' }}>
              Assign Services
              <IconButton onClick={() => setIsAssignServicesOpen(false)} size="small"><X size={18} /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ border: 'none', p: 2 }}>
              <TextField placeholder="Search services..." size="small" fullWidth sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={16} color="#9CA3AF" /></InputAdornment> } }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 280, overflowY: 'auto' }}>
                {[
                  { name: 'Haircut (Male)', duration: '30 min', price: '₹300', checked: true },
                  { name: 'Haircut (Female)', duration: '45 min', price: '₹500', checked: true },
                  { name: 'Hair Styling', duration: '30 min', price: '₹400', checked: true },
                  { name: 'Hair Coloring', duration: '90 min', price: '₹1,500', checked: true },
                  { name: 'Highlights', duration: '120 min', price: '₹2,000', checked: false },
                  { name: 'Keratin Treatment', duration: '120 min', price: '₹2,500', checked: false },
                ].map((srv, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: '8px', backgroundColor: '#FAFAFC' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox size="small" defaultChecked={srv.checked} />
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>{srv.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="caption" color="text.secondary">{srv.duration}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{srv.price}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setIsAssignServicesOpen(false)} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
              <Button variant="contained" onClick={() => setIsAssignServicesOpen(false)} sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}>Assign (4)</Button>
            </DialogActions>
          </Dialog>

          {/* ========================================================================= */}
          {/* 5. ADD BREAK TIME MODAL */}
          {/* ========================================================================= */}
          <Dialog open={isAddBreakOpen} onClose={() => setIsAddBreakOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.05rem' }}>
              Add Break Time
              <IconButton onClick={() => setIsAddBreakOpen(false)} size="small"><X size={18} /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ border: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8 }}>Break Name *</Typography><TextField fullWidth size="small" defaultValue="Lunch Break" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Box>
              <Grid container spacing={2}>
                <Grid size={6}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8 }}>Start Time *</Typography><TextField fullWidth size="small" defaultValue="01:00 PM" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
                <Grid size={6}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8 }}>End Time *</Typography><TextField fullWidth size="small" defaultValue="01:30 PM" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
              </Grid>
              <Box><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8 }}>Repeat</Typography><Select fullWidth size="small" defaultValue="everyday" sx={{ borderRadius: '10px' }}><MenuItem value="everyday">Every day</MenuItem></Select></Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setIsAddBreakOpen(false)} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
              <Button variant="contained" onClick={() => setIsAddBreakOpen(false)} sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}>Save Break</Button>
            </DialogActions>
          </Dialog>

          {/* ========================================================================= */}
          {/* 6. ADD LEAVE MODAL */}
          {/* ========================================================================= */}
          <Dialog open={isAddLeaveOpen} onClose={() => setIsAddLeaveOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.05rem' }}>
              Add Leave
              <IconButton onClick={() => setIsAddLeaveOpen(false)} size="small"><X size={18} /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ border: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8 }}>Leave Type *</Typography><Select fullWidth size="small" defaultValue="casual" sx={{ borderRadius: '10px' }}><MenuItem value="casual">Casual Leave</MenuItem><MenuItem value="sick">Sick Leave</MenuItem></Select></Box>
              <Grid container spacing={2}>
                <Grid size={6}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8 }}>Start Date *</Typography><TextField fullWidth size="small" defaultValue="25 Jul 2025" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
                <Grid size={6}><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8 }}>End Date *</Typography><TextField fullWidth size="small" defaultValue="26 Jul 2025" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
              </Grid>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Duration: <strong>2 Days</strong></Typography>
              <Box><Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8 }}>Reason *</Typography><TextField fullWidth size="small" defaultValue="Personal work" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setIsAddLeaveOpen(false)} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
              <Button variant="contained" onClick={() => setIsAddLeaveOpen(false)} sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}>Submit Leave</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
