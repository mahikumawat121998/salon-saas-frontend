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
import Menu from '@mui/material/Menu';
import Alert from '@mui/material/Alert';
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
  Calendar as CalendarIcon,
  User,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import { Avatar } from '@/shared/ui/Avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApiService, CustomerItem, CreateCustomerDto, UpdateCustomerDto } from '@/services/api/customer.service';
import { TableRowSkeleton } from '@/shared/components/loaders';
import { QUERY_KEYS } from '@/config/query-keys';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // React Query for customers
  const { data: customers = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.customers.all,
    queryFn: customerApiService.getCustomers,
  });

  const createCustomerMutation = useMutation({
    mutationFn: customerApiService.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers.all });
      setIsAddModalOpen(false);
      resetForm();
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerDto }) => customerApiService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers.all });
      setIsEditModalOpen(false);
      resetForm();
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: customerApiService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers.all });
      setIsDeleteModalOpen(false);
    },
  });

  // Currently Selected Customer
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  // Drawer & Modals Open State
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Menu Anchor State
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTargetCustomer, setMenuTargetCustomer] = useState<CustomerItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CreateCustomerDto>>({
    name: '',
    phone: '',
    email: '',
    notes: '',
    gender: undefined,
    dob: undefined,
    status: 'ACTIVE',
    isVip: false,
    source: 'WALK_IN',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      notes: '',
      gender: undefined,
      dob: undefined,
      status: 'ACTIVE',
      isVip: false,
      source: 'WALK_IN',
    });
  };

  // Open Handlers
  const handleOpenDetails = (customer: CustomerItem) => {
    setSelectedCustomer(customer);
    setIsDetailsDrawerOpen(true);
  };

  const handleOpenEdit = (customer: CustomerItem) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      notes: customer.notes || '',
      gender: customer.gender || undefined,
      dob: customer.dob || undefined,
      status: customer.status,
      isVip: customer.isVip,
      source: customer.source,
    });
    setIsEditModalOpen(true);
    setMenuAnchorEl(null);
  };

  const handleOpenDelete = (customer: CustomerItem) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
    setMenuAnchorEl(null);
  };

  const handleSaveCustomer = () => {
    if (!formData.name) return;
    createCustomerMutation.mutate(formData as CreateCustomerDto);
  };

  const handleUpdateCustomer = () => {
    if (!formData.name || !selectedCustomer) return;
    updateCustomerMutation.mutate({ id: selectedCustomer.id, data: formData as UpdateCustomerDto });
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    deleteCustomerMutation.mutate(selectedCustomer.id);
  };

  // Filter Data
  const filteredCustomers = customers.filter(c => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.phone?.includes(searchQuery)) return false;
    if (selectedStatus !== 'all' && c.status?.toLowerCase() !== selectedStatus.toLowerCase()) return false;
    if (selectedGender !== 'all' && c.gender?.toLowerCase() !== selectedGender.toLowerCase()) return false;
    if (selectedSource !== 'all' && c.source?.toLowerCase() !== selectedSource.toLowerCase()) return false;
    return true;
  });

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
              title="Customers"
              subtitle="Manage and view all your customers"
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
                + Add Customer
              </Button>
            </Box>
          </Box>

          {/* Main Content Card Container */}
          <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
            {/* Filter Bar */}
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
                  placeholder="Search customers by name, phone or email..."
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
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 38, minWidth: 120 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>

                <Select
                  size="small"
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 38, minWidth: 120 }}
                >
                  <MenuItem value="all">All Gender</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>

                <Select
                  size="small"
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 38, minWidth: 130 }}
                >
                  <MenuItem value="all">All Sources</MenuItem>
                  <MenuItem value="walkin">Walk-In</MenuItem>
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="instagram">Instagram</MenuItem>
                  <MenuItem value="referral">Referral</MenuItem>
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

            {/* Customers Data Table */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '1px solid #F3F4F6', py: 1.2 } }}>
                    <TableCell padding="checkbox">
                      <Checkbox size="small" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Last Visit</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Total Visits</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Total Spent</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRowSkeleton columns={9} rows={6} hasAvatar={true} />
                  ) : filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">No customers found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredCustomers.map((customer) => {
                    const isSelected = selectedCustomer?.id === customer.id;
                    const isActive = customer.status === 'ACTIVE';
                    return (
                      <TableRow
                        key={customer.id}
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

                        {/* Customer Info */}
                        <TableCell onClick={() => handleOpenDetails(customer)}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Avatar name={customer.name} sx={{ width: 34, height: 34 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827' }}>
                                {customer.name}
                              </Typography>
                              {customer.isVip && (
                                <Chip label="VIP" size="small" sx={{ backgroundColor: '#F3E8FF', color: '#7C3AED', fontWeight: 800, height: 16, fontSize: '0.6rem' }} />
                              )}
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>
                          {customer.phone}
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                          {customer.email}
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 600 }}>
                          {customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : 'Never'}
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem', color: '#111827', fontWeight: 700 }}>
                          {customer.totalVisits || 0}
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.84rem', color: '#111827', fontWeight: 800 }}>
                          ₹{customer.totalSpent || 0}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={customer.status}
                            size="small"
                            sx={{
                              backgroundColor: isActive ? 'rgba(16, 185, 129, 0.12)' : '#F3F4F6',
                              color: isActive ? '#10B981' : '#6B7280',
                              fontWeight: 700,
                              fontSize: '0.6875rem',
                              height: 22,
                              borderRadius: '6px',
                            }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            <IconButton size="small" onClick={() => handleOpenDetails(customer)}>
                              <Eye size={16} color="#6B7280" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleOpenEdit(customer)}>
                              <Edit2 size={16} color="#6B7280" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                setMenuAnchorEl(e.currentTarget);
                                setMenuTargetCustomer(customer);
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
                Showing 1 to 8 of 128 customers
              </Typography>

              <Pagination count={16} page={1} size="small" color="primary" />
            </Box>
          </Card>

          {/* Row Actions Dropdown Menu */}
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={() => setMenuAnchorEl(null)}
            slotProps={{ paper: { sx: { borderRadius: '12px', minWidth: 160 } } }}
          >
            <MenuItem
              onClick={() => {
                if (menuTargetCustomer) handleOpenEdit(menuTargetCustomer);
              }}
            >
              <Edit2 size={16} style={{ marginRight: 8, color: '#7C3AED' }} />
              Edit Details
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (menuTargetCustomer) handleOpenDelete(menuTargetCustomer);
              }}
              sx={{ color: 'error.main' }}
            >
              <Trash2 size={16} style={{ marginRight: 8, color: '#EF4444' }} />
              Delete Customer
            </MenuItem>
          </Menu>

          {/* ========================================================================= */}
          {/* 1. CUSTOMER DETAILS SIDE DRAWER */}
          {/* ========================================================================= */}
          <Drawer
            anchor="right"
            open={isDetailsDrawerOpen}
            onClose={() => setIsDetailsDrawerOpen(false)}
            slotProps={{
              paper: {
                sx: { width: { xs: '100%', sm: 440 }, p: 3, borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' },
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>
                Customer Details
              </Typography>
              <IconButton onClick={() => setIsDetailsDrawerOpen(false)} size="small">
                <X size={18} />
              </IconButton>
            </Box>

            {/* Header Summary */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar name={selectedCustomer?.name || ''} sx={{ width: 52, height: 52 }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
                      {selectedCustomer?.name}
                    </Typography>
                    {selectedCustomer?.isVip && (
                      <Chip label="VIP" size="small" sx={{ backgroundColor: '#F3E8FF', color: '#7C3AED', fontWeight: 800, height: 18, fontSize: '0.65rem' }} />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.78125rem' }}>
                    {selectedCustomer?.phone}
                  </Typography>
                </Box>
              </Box>

              {/* Quick Communication Icons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" sx={{ backgroundColor: '#EFF6FF', color: '#3B82F6', borderRadius: '10px' }}>
                  <Phone size={16} />
                </IconButton>
                <IconButton size="small" sx={{ backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '10px' }}>
                  <MessageCircle size={16} />
                </IconButton>
                <IconButton size="small" sx={{ backgroundColor: '#F3E8FF', color: '#7C3AED', borderRadius: '10px' }}>
                  <Mail size={16} />
                </IconButton>
              </Box>
            </Box>

            {/* Sub Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
              <Tabs
                value={0}
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  minHeight: 36,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.78125rem',
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.5,
                  },
                }}
              >
                <Tab label="Overview" />
                <Tab label="Appointments" />
                <Tab label="Payments" />
                <Tab label="Notes" />
                <Tab label="History" />
              </Tabs>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Left Column: Information Card */}
              <Grid size={12}>
                <Card sx={{ borderRadius: '16px', border: '1px solid #F3F4F6', p: 2, backgroundColor: '#FFFFFF', mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.875rem' }}>
                      Information
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<Edit2 size={14} />}
                      onClick={() => {
                        setIsDetailsDrawerOpen(false);
                        setIsEditModalOpen(true);
                      }}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: '#7C3AED' }}
                    >
                      Edit
                    </Button>
                  </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Full Name</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedCustomer?.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '0.78125rem' }}>{selectedCustomer?.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Phone</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedCustomer?.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedCustomer?.dob ? new Date(selectedCustomer.dob).toLocaleDateString() : 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Gender</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedCustomer?.gender || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Source</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedCustomer?.source}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Status</Typography>
                        <Chip label={selectedCustomer?.status} size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontWeight: 700, height: 18 }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Total Visits</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedCustomer?.totalVisits || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Total Spent</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{selectedCustomer?.totalSpent || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Customer Since</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedCustomer?.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : 'N/A'}</Typography>
                      </Box>
                    </Box>
                </Card>

                {/* Last Appointment Card */}
                <Card sx={{ borderRadius: '16px', border: '1px solid #F3F4F6', p: 2, backgroundColor: '#FFFFFF', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.875rem', mb: 1 }}>
                    Last Appointment
                  </Typography>
                  <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 800, fontSize: '0.875rem' }}>
                    {selectedCustomer?.lastAppointment?.date ? new Date(selectedCustomer.lastAppointment.date).toLocaleDateString() : 'No appointments yet'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827', mt: 0.5 }}>
                    {selectedCustomer?.lastAppointment?.service || ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    {selectedCustomer?.lastAppointment?.staff ? `with ${selectedCustomer.lastAppointment.staff}` : ''}
                  </Typography>
                  <Button fullWidth variant="outlined" size="small" sx={{ borderRadius: '8px', color: '#7C3AED', borderColor: '#E5E7EB', textTransform: 'none', fontWeight: 700 }}>
                    View Appointment
                  </Button>
                </Card>

                {/* Notes Card */}
                <Card sx={{ borderRadius: '16px', border: '1px solid #F3F4F6', p: 2, backgroundColor: '#FFFFFF', mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.875rem' }}>
                      Notes
                    </Typography>
                    <Button size="small" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: '#7C3AED' }}>
                      + Add Note
                    </Button>
                  </Box>
                  <Typography variant="body2" color="#374151" sx={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>
                    {selectedCustomer?.notes || 'No notes added.'}
                  </Typography>
                </Card>

                {/* Quick Actions Toolbar */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button fullWidth variant="outlined" sx={{ borderRadius: '10px', color: '#7C3AED', borderColor: '#E5E7EB', fontWeight: 700, textTransform: 'none' }}>
                    New Appointment
                  </Button>
                  <Button fullWidth variant="outlined" sx={{ borderRadius: '10px', color: '#374151', borderColor: '#E5E7EB', fontWeight: 700, textTransform: 'none' }}>
                    Add Note
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      setIsDetailsDrawerOpen(false);
                      setIsDeleteModalOpen(true);
                    }}
                    sx={{ borderRadius: '10px', color: '#EF4444', borderColor: '#FEE2E2', fontWeight: 700, textTransform: 'none' }}
                  >
                    Delete Customer
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Drawer>

          {/* ========================================================================= */}
          {/* 2. ADD NEW CUSTOMER MODAL */}
          {/* ========================================================================= */}
          <Dialog
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            maxWidth="sm"
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              Add New Customer
              <IconButton onClick={() => setIsAddModalOpen(false)} size="small">
                <X size={18} />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ border: 'none' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#111827' }}>
                Personal Information
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Full Name *
                  </Typography>
                  <TextField fullWidth size="small" placeholder="Enter full name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Phone Number *
                  </Typography>
                  <TextField fullWidth size="small" placeholder="Enter phone number" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 12 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Email
                  </Typography>
                  <TextField fullWidth size="small" placeholder="Enter email address" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Date of Birth
                  </Typography>
                  <TextField fullWidth size="small" type="date" value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Gender
                  </Typography>
                  <Select fullWidth size="small" value={formData.gender || ''} onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })} displayEmpty sx={{ borderRadius: '10px' }}>
                    <MenuItem value="" disabled>Select gender</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#111827' }}>
                Additional Information
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Source
                  </Typography>
                  <Select fullWidth size="small" value={formData.source || 'WALK_IN'} onChange={(e) => setFormData({ ...formData, source: e.target.value as any })} sx={{ borderRadius: '10px' }}>
                    <MenuItem value="WALK_IN">Walk-In</MenuItem>
                    <MenuItem value="ONLINE">Online</MenuItem>
                    <MenuItem value="REFERRAL">Referral</MenuItem>
                  </Select>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Notes
                  </Typography>
                  <TextField fullWidth multiline rows={2} placeholder="Add any notes (optional)..." value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>{formData.notes?.length || 0}/200</Typography>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setIsAddModalOpen(false)} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
              <Button variant="contained" onClick={handleSaveCustomer} disabled={createCustomerMutation.isPending} sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}>
                {createCustomerMutation.isPending ? 'Saving...' : 'Save Customer'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* ========================================================================= */}
          {/* 3. EDIT CUSTOMER MODAL */}
          {/* ========================================================================= */}
          <Dialog
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            maxWidth="sm"
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              Edit Customer
              <IconButton onClick={() => setIsEditModalOpen(false)} size="small">
                <X size={18} />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ border: 'none' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#111827' }}>
                Personal Information
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Full Name *
                  </Typography>
                  <TextField fullWidth size="small" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Phone Number *
                  </Typography>
                  <TextField fullWidth size="small" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 12 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Email
                  </Typography>
                  <TextField fullWidth size="small" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Date of Birth
                  </Typography>
                  <TextField fullWidth size="small" type="date" value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Gender
                  </Typography>
                  <Select fullWidth size="small" value={formData.gender || 'OTHER'} onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })} sx={{ borderRadius: '10px' }}>
                    <MenuItem value="FEMALE">Female</MenuItem>
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#111827' }}>
                Additional Information
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Source
                  </Typography>
                  <Select fullWidth size="small" value={formData.source || 'WALK_IN'} onChange={(e) => setFormData({ ...formData, source: e.target.value as any })} sx={{ borderRadius: '10px' }}>
                    <MenuItem value="WALK_IN">Walk-In</MenuItem>
                    <MenuItem value="ONLINE">Online</MenuItem>
                    <MenuItem value="REFERRAL">Referral</MenuItem>
                  </Select>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                    Notes
                  </Typography>
                  <TextField fullWidth multiline rows={2} value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>{formData.notes?.length || 0}/200</Typography>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setIsEditModalOpen(false)} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
              <Button variant="contained" onClick={handleUpdateCustomer} disabled={updateCustomerMutation.isPending} sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}>
                {updateCustomerMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* ========================================================================= */}
          {/* 4. DELETE CUSTOMER CONFIRMATION MODAL */}
          {/* ========================================================================= */}
          <Dialog
            open={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            maxWidth="xs"
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: '20px', p: 2, textAlign: 'center' } } }}
          >
            <DialogContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: '#FEE2E2',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <Trash2 size={28} />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827', mb: 1 }}>
                Delete Customer
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', lineHeight: 1.5, mb: 2.5 }}>
                Are you sure you want to delete this customer? This action cannot be undone. All customer data including appointments, payments and notes will be permanently removed.
              </Typography>

              {/* Customer Info Card */}
              <Box
                sx={{
                  width: '100%',
                  p: 1.8,
                  borderRadius: '12px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  textAlign: 'left',
                  mb: 3,
                }}
              >
                <Typography variant="caption" color="#991B1B" sx={{ fontWeight: 800, display: 'block', mb: 0.5 }}>
                  Customer Details
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                  {selectedCustomer?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedCustomer?.phone} • {selectedCustomer?.email}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                <Button fullWidth onClick={() => setIsDeleteModalOpen(false)} sx={{ borderRadius: '10px', border: '1px solid #E5E7EB', color: '#374151', fontWeight: 700, py: 1, textTransform: 'none' }}>
                  Cancel
                </Button>
                <Button fullWidth variant="contained" color="error" onClick={handleDeleteCustomer} disabled={deleteCustomerMutation.isPending} sx={{ borderRadius: '10px', fontWeight: 800, py: 1, textTransform: 'none', boxShadow: 'none' }}>
                  {deleteCustomerMutation.isPending ? 'Deleting...' : 'Delete Customer'}
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
