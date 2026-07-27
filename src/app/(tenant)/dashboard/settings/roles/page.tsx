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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  X,
  Shield,
  UserCheck,
  Users,
  Info,
  ChevronRight,
  Lock,
  ArrowLeft,
  LayoutDashboard,
  Calendar,
  Package,
  Scissors,
  BarChart3,
  Settings,
  Megaphone,
  CreditCard,
  Check,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApiService, CreateRoleDto, UpdateRoleDto, RolePayload, PermissionItem } from '@/services/api/roles.service';
import { TableRowSkeleton } from '@/shared/components/loaders';
import { QUERY_KEYS } from '@/config/query-keys';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import { Avatar } from '@/shared/ui/Avatar';

// ----------------------------------------------------------------------
// Interfaces & Fallback Mock Data
// ----------------------------------------------------------------------
export interface RoleItem {
  id: string;
  name: string;
  type: 'System' | 'Custom';
  description: string;
  assignedStaff: number;
  status: 'Active' | 'Inactive';
  color: string;
  rawRole?: RolePayload;
}

export interface StaffPermissionItem {
  id: string;
  name: string;
  subRole: string;
  roleName: string;
  permissionsCount: number;
  badgeType: 'Custom' | 'Default';
  status: 'Active' | 'On Leave' | 'Inactive';
  avatar: string;
}

const FALLBACK_PERMISSIONS: PermissionItem[] = [
  { id: 'perm_1', name: 'APPOINTMENT_VIEW', description: 'View appointments list and calendar' },
  { id: 'perm_2', name: 'APPOINTMENT_CREATE', description: 'Create new appointment bookings' },
  { id: 'perm_3', name: 'APPOINTMENT_UPDATE', description: 'Edit or reschedule appointments' },
  { id: 'perm_4', name: 'APPOINTMENT_CANCEL', description: 'Cancel existing appointments' },
  { id: 'perm_5', name: 'CUSTOMER_VIEW', description: 'View customer directory and history' },
  { id: 'perm_6', name: 'CUSTOMER_CREATE', description: 'Add new customer profiles' },
  { id: 'perm_7', name: 'CUSTOMER_UPDATE', description: 'Edit customer profile information' },
  { id: 'perm_8', name: 'STAFF_VIEW', description: 'View staff members and schedules' },
  { id: 'perm_9', name: 'STAFF_CREATE', description: 'Add new staff members' },
  { id: 'perm_10', name: 'SERVICE_VIEW', description: 'View service catalog and prices' },
  { id: 'perm_11', name: 'SERVICE_CREATE', description: 'Create new services and categories' },
  { id: 'perm_12', name: 'INVOICE_VIEW', description: 'View billing invoices and payments' },
  { id: 'perm_13', name: 'INVOICE_CREATE', description: 'Generate invoices and record payments' },
];

const FALLBACK_ROLES_DATA: RoleItem[] = [
  { id: '1', name: 'OWNER', type: 'System', description: 'Full access to all modules and settings', assignedStaff: 1, status: 'Active', color: '#7C3AED' },
  { id: '2', name: 'MANAGER', type: 'Custom', description: 'Manage staff, appointments and reports', assignedStaff: 5, status: 'Active', color: '#3B82F6' },
  { id: '3', name: 'RECEPTIONIST', type: 'Custom', description: 'Manage appointments and customers', assignedStaff: 4, status: 'Active', color: '#10B981' },
  { id: '4', name: 'STAFF', type: 'Custom', description: 'Manage assigned appointments and clients', assignedStaff: 8, status: 'Active', color: '#F59E0B' },
];

const INITIAL_STAFF_PERMISSIONS_DATA: StaffPermissionItem[] = [
  { id: '1', name: 'Rahul Mehta', subRole: 'Senior Stylist', roleName: 'STAFF', permissionsCount: 12, badgeType: 'Custom', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Neha Kapoor', subRole: 'Stylist', roleName: 'STAFF', permissionsCount: 12, badgeType: 'Default', status: 'Active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Amit Kumar', subRole: 'Barber', roleName: 'STAFF', permissionsCount: 12, badgeType: 'Default', status: 'Active', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
  { id: '4', name: 'Sneha Patel', subRole: 'Therapist', roleName: 'RECEPTIONIST', permissionsCount: 9, badgeType: 'Default', status: 'Active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
  { id: '5', name: 'Pooja Sharma', subRole: 'Receptionist', roleName: 'RECEPTIONIST', permissionsCount: 9, badgeType: 'Default', status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
  { id: '6', name: 'Vikram Joshi', subRole: 'Colorist', roleName: 'STAFF', permissionsCount: 12, badgeType: 'Custom', status: 'On Leave', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80' },
];

const MODULES_LIST = [
  { id: 'all', name: 'All Permissions', icon: Shield },
  { id: 'appointments', name: 'Appointments', icon: Calendar },
  { id: 'customers', name: 'Customers', icon: Users },
  { id: 'staff', name: 'Staff', icon: UserCheck },
  { id: 'services', name: 'Services', icon: Scissors },
  { id: 'billing', name: 'Billing', icon: CreditCard },
];

export default function RolesManagementPage() {
  const queryClient = useQueryClient();
  const [mainTab, setMainTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [staffList, setStaffList] = useState<StaffPermissionItem[]>(INITIAL_STAFF_PERMISSIONS_DATA);

  // ----------------------------------------------------------------------
  // Live Backend Query Hooks
  // ----------------------------------------------------------------------
  const { data: apiRoles, isLoading: isRolesLoading } = useQuery<RolePayload[]>({
    queryKey: QUERY_KEYS.roles.all,
    queryFn: rolesApiService.getRoles,
    retry: 1,
  });

  const { data: apiPermissions } = useQuery<PermissionItem[]>({
    queryKey: QUERY_KEYS.roles.permissions,
    queryFn: rolesApiService.getPermissions,
    retry: 1,
  });

  const permissionsList = (apiPermissions && apiPermissions.length > 0) ? apiPermissions : FALLBACK_PERMISSIONS;

  // Map API roles to UI format
  const rolesList: RoleItem[] = (apiRoles && apiRoles.length > 0)
    ? apiRoles.map((r, idx) => ({
        id: r.id,
        name: r.name,
        type: r.name === 'SUPER_ADMIN' || r.name === 'OWNER' ? 'System' : 'Custom',
        description: r.description || `${r.name} role permissions`,
        assignedStaff: r._count?.users ?? (idx + 1),
        status: 'Active',
        color: ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#EC4899'][idx % 7],
        rawRole: r,
      }))
    : FALLBACK_ROLES_DATA;

  // Mutations
  const createRoleMutation = useMutation({
    mutationFn: rolesApiService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles.all });
      setIsWizardOpen(false);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string; permissionIds?: string[] } }) =>
      rolesApiService.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles.all });
      setIsWizardOpen(false);
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: rolesApiService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles.all });
    },
  });

  // Create / Edit Role Modal State
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<RolePayload | null>(null);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [selectedModule, setSelectedModule] = useState<string>('all');

  // Form Fields
  const [roleName, setRoleName] = useState<string>('');
  const [roleDesc, setRoleDesc] = useState<string>('');
  const [roleType, setRoleType] = useState<string>('custom');
  const [roleStatus, setRoleStatus] = useState<string>('active');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);

  // Open modal to Create Role
  const handleOpenCreateRole = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleDesc('');
    setRoleType('custom');
    setRoleStatus('active');
    setSelectedPermissionIds([]);
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  // Open modal to View or Edit Role & permissions
  const handleOpenEditRole = (roleItem: RoleItem, step: number = 1) => {
    const raw = roleItem.rawRole;
    setEditingRole(raw || { id: roleItem.id, name: roleItem.name, description: roleItem.description, tenantId: '' });
    setRoleName(roleItem.name);
    setRoleDesc(roleItem.description);
    setRoleType(roleItem.type === 'System' ? 'system' : 'custom');
    setRoleStatus('active');

    // Extract assigned permission IDs
    if (raw && raw.permissions && raw.permissions.length > 0) {
      const pIds = raw.permissions.map((p) => p.permission.id);
      setSelectedPermissionIds(pIds);
    } else {
      setSelectedPermissionIds(permissionsList.slice(0, 5).map((p) => p.id));
    }

    setWizardStep(step);
    setIsWizardOpen(true);
  };

  // Toggle individual permission checkbox
  const handleTogglePermission = (permId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  // Toggle Select All permissions
  const handleToggleSelectAll = (filteredPerms: PermissionItem[]) => {
    const filteredIds = filteredPerms.map((p) => p.id);
    const allSelected = filteredIds.every((id) => selectedPermissionIds.includes(id));

    if (allSelected) {
      setSelectedPermissionIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedPermissionIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleSaveRole = () => {
    if (!roleName) return;

    if (editingRole && editingRole.id) {
      updateRoleMutation.mutate({
        id: editingRole.id,
        data: {
          name: roleName.toUpperCase(),
          description: roleDesc,
          permissionIds: selectedPermissionIds,
        },
      });
    } else {
      createRoleMutation.mutate({
        name: roleName.toUpperCase(),
        description: roleDesc,
        permissionIds: selectedPermissionIds,
      });
    }
  };

  const handleDeleteRole = (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      deleteRoleMutation.mutate(id);
    }
  };

  // ----------------------------------------------------------------------
  // User Permission Modal State (View & Edit for individual staff)
  // ----------------------------------------------------------------------
  const [selectedStaffUser, setSelectedStaffUser] = useState<StaffPermissionItem | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState<boolean>(false);
  const [staffModalMode, setStaffModalMode] = useState<'view' | 'edit'>('view');
  const [assignedRoleName, setAssignedRoleName] = useState<string>('STAFF');
  const [staffSuccessMsg, setStaffSuccessMsg] = useState<string>('');

  const handleOpenStaffModal = (staff: StaffPermissionItem, mode: 'view' | 'edit') => {
    setSelectedStaffUser(staff);
    setStaffModalMode(mode);
    setAssignedRoleName(staff.roleName);
    setStaffSuccessMsg('');
    setIsStaffModalOpen(true);
  };

  const handleSaveStaffPermissions = () => {
    if (!selectedStaffUser) return;
    
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === selectedStaffUser.id
          ? { ...s, roleName: assignedRoleName, badgeType: 'Custom' }
          : s
      )
    );

    setStaffSuccessMsg('Staff member permissions updated successfully!');
    setTimeout(() => {
      setIsStaffModalOpen(false);
      setStaffSuccessMsg('');
    }, 1200);
  };

  // Filter permissions by active tab module
  const getFilteredPermissions = () => {
    if (selectedModule === 'all') return permissionsList;
    return permissionsList.filter((p) => p.name.toLowerCase().includes(selectedModule.toLowerCase()));
  };

  const currentFilteredPermissions = getFilteredPermissions();
  const isAllCurrentSelected = currentFilteredPermissions.length > 0 && currentFilteredPermissions.every((p) => selectedPermissionIds.includes(p.id));

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', maxWidth: '100%', pb: 4 }}>
          {/* Header Title & Create Button */}
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
              title="Role & Permission Management"
              subtitle="Manage roles and permissions for your staff members"
            />

            <Button
              variant="contained"
              onClick={handleOpenCreateRole}
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
              + Create Role
            </Button>
          </Box>

          {/* Sub Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={mainTab}
              onChange={(_, val) => setMainTab(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.875rem', px: 2.5 } }}
            >
              <Tab label="Roles" />
              <Tab label="Staff Permissions" />
            </Tabs>
          </Box>

          {/* ========================================================================= */}
          {/* TAB 1: ROLES MANAGEMENT */}
          {/* ========================================================================= */}
          {mainTab === 0 && (
            <Box>
              {/* Top 4 KPI Metric Cards */}
              <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Card sx={{ borderRadius: '18px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                      Total Roles
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827' }}>
                      {rolesList.length}
                    </Typography>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Card sx={{ borderRadius: '18px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                        System Roles
                      </Typography>
                      <Tooltip title="System roles cannot be modified or deleted">
                        <Info size={14} color="#9CA3AF" style={{ cursor: 'pointer' }} />
                      </Tooltip>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827' }}>
                      {rolesList.filter((r) => r.type === 'System').length || 1}
                    </Typography>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Card sx={{ borderRadius: '18px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                      Custom Roles
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827' }}>
                      {rolesList.filter((r) => r.type === 'Custom').length}
                    </Typography>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Card sx={{ borderRadius: '18px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                      Assigned Staff
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827' }}>
                      23
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              {/* Roles Data Table */}
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '& th': { borderBottom: '1px solid #F3F4F6', py: 1.2 } }}>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Role Name</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Assigned Staff</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isRolesLoading ? (
                        <TableRowSkeleton columns={6} rows={5} />
                      ) : rolesList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                            <Typography variant="body2" color="text.secondary">No roles found.</Typography>
                          </TableCell>
                        </TableRow>
                      ) : rolesList.map((role) => (
                        <TableRow key={role.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                <Box sx={{ width: 32, height: 32, borderRadius: '10px', backgroundColor: `${role.color}15`, color: role.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Shield size={16} />
                                </Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.84rem', color: '#111827' }}>
                                  {role.name}
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={role.type}
                                size="small"
                                sx={{
                                  backgroundColor: role.type === 'System' ? '#F3E8FF' : '#EFF6FF',
                                  color: role.type === 'System' ? '#7C3AED' : '#3B82F6',
                                  fontWeight: 800,
                                  fontSize: '0.6875rem',
                                  height: 20,
                                }}
                              />
                            </TableCell>

                            <TableCell sx={{ fontSize: '0.8125rem', color: '#4B5563' }}>
                              {role.description}
                            </TableCell>

                            <TableCell sx={{ fontSize: '0.8125rem', color: '#111827', fontWeight: 700 }}>
                              {role.assignedStaff}
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={role.status}
                                size="small"
                                sx={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontWeight: 700, fontSize: '0.6875rem', height: 20 }}
                              />
                            </TableCell>

                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                <Tooltip title="View Role Permissions">
                                  <IconButton size="small" onClick={() => handleOpenEditRole(role, 2)}>
                                    <Eye size={16} color="#6B7280" />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Edit Role & Permissions">
                                  <IconButton size="small" onClick={() => handleOpenEditRole(role, 1)}>
                                    <Edit2 size={16} color="#7C3AED" />
                                  </IconButton>
                                </Tooltip>

                                {role.type !== 'System' && (
                                  <Tooltip title="Delete Role">
                                    <IconButton size="small" onClick={() => handleDeleteRole(role.id)}>
                                      <Trash2 size={16} color="#EF4444" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2.5, mt: 1, borderTop: '1px solid #F3F4F6' }}>
                  <Typography variant="caption" color="text.secondary">Showing 1 to {rolesList.length} of {rolesList.length} roles</Typography>
                </Box>
              </Card>
            </Box>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: STAFF PERMISSIONS */}
          {/* ========================================================================= */}
          {mainTab === 1 && (
            <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <TextField
                  placeholder="Search staff by name..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: 280, '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: '0.84rem', height: 38 } }}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={16} color="#9CA3AF" /></InputAdornment> } }}
                />

                <Button variant="outlined" startIcon={<Filter size={16} />} sx={{ borderRadius: '12px', borderColor: '#E5E7EB', color: '#374151', fontWeight: 600, fontSize: '0.84rem', py: 0.8, px: 2, textTransform: 'none' }}>
                  Filters
                </Button>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid #F3F4F6', py: 1.2 } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Staff Member</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Current Role</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Permissions</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staffList
                      .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((sp) => (
                        <TableRow key={sp.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                              <Avatar name={sp.name} src={sp.avatar} sx={{ width: 34, height: 34 }} />
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827' }}>
                                  {sp.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                                  {sp.subRole}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Chip label={sp.roleName} size="small" sx={{ backgroundColor: '#EFF6FF', color: '#3B82F6', fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
                          </TableCell>

                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#111827' }}>
                                {sp.permissionsCount} Permissions
                              </Typography>
                              <Chip label={sp.badgeType} size="small" sx={{ backgroundColor: sp.badgeType === 'Custom' ? '#F3E8FF' : '#F3F4F6', color: sp.badgeType === 'Custom' ? '#7C3AED' : '#6B7280', fontWeight: 700, fontSize: '0.625rem', height: 18 }} />
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={sp.status}
                              size="small"
                              sx={{
                                backgroundColor: sp.status === 'Active' ? 'rgba(16, 185, 129, 0.12)' : '#FFF7ED',
                                color: sp.status === 'Active' ? '#10B981' : '#F97316',
                                fontWeight: 700,
                                fontSize: '0.6875rem',
                                height: 22,
                              }}
                            />
                          </TableCell>

                          <TableCell align="right">
                            <Tooltip title="View Staff Permissions">
                              <IconButton size="small" onClick={() => handleOpenStaffModal(sp, 'view')}>
                                <Eye size={16} color="#6B7280" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Edit Staff Role & Permissions">
                              <IconButton size="small" onClick={() => handleOpenStaffModal(sp, 'edit')}>
                                <Edit2 size={16} color="#7C3AED" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2.5, mt: 1, borderTop: '1px solid #F3F4F6' }}>
                <Typography variant="caption" color="text.secondary">Showing 1 to {staffList.length} of 23 staff members</Typography>
                <Pagination count={4} page={1} size="small" color="primary" />
              </Box>
            </Card>
          )}

          {/* ========================================================================= */}
          {/* USER SPECIFIC PERMISSIONS MODAL (VIEW & EDIT) */}
          {/* ========================================================================= */}
          <Dialog
            open={isStaffModalOpen}
            onClose={() => setIsStaffModalOpen(false)}
            maxWidth="sm"
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
          >
            {selectedStaffUser && (
              <>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar name={selectedStaffUser.name} src={selectedStaffUser.avatar} sx={{ width: 42, height: 42 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                        {selectedStaffUser.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedStaffUser.subRole} • {staffModalMode === 'edit' ? 'Edit Permissions' : 'View Permissions'}
                      </Typography>
                    </Box>
                  </Box>

                  <IconButton onClick={() => setIsStaffModalOpen(false)} size="small"><X size={18} /></IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ border: 'none', px: 3, py: 2 }}>
                  {staffSuccessMsg && (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>
                      {staffSuccessMsg}
                    </Alert>
                  )}

                  {/* Mode Toggle Switch */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <Chip
                      label="View Permissions"
                      onClick={() => setStaffModalMode('view')}
                      sx={{
                        backgroundColor: staffModalMode === 'view' ? '#F3E8FF' : '#F3F4F6',
                        color: staffModalMode === 'view' ? '#7C3AED' : '#4B5563',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    />
                    <Chip
                      label="Edit Role & Permissions"
                      onClick={() => setStaffModalMode('edit')}
                      sx={{
                        backgroundColor: staffModalMode === 'edit' ? '#F3E8FF' : '#F3F4F6',
                        color: staffModalMode === 'edit' ? '#7C3AED' : '#4B5563',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    />
                  </Box>

                  {/* Role Assignment Selector */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                      Assigned Role
                    </Typography>
                    <Select
                      fullWidth
                      size="small"
                      disabled={staffModalMode === 'view'}
                      value={assignedRoleName}
                      onChange={(e) => setAssignedRoleName(e.target.value)}
                      sx={{ borderRadius: '10px' }}
                    >
                      {rolesList.map((r) => (
                        <MenuItem key={r.id} value={r.name}>{r.name}</MenuItem>
                      ))}
                    </Select>
                  </Box>

                  {/* Permissions Breakdown Checklist */}
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1, color: '#6B7280' }}>
                    ASSIGNED PERMISSIONS ({permissionsList.length})
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 260, overflowY: 'auto', pr: 0.5 }}>
                    {permissionsList.map((perm) => (
                      <Box
                        key={perm.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1.2,
                          borderRadius: '10px',
                          border: '1px solid #F3F4F6',
                          backgroundColor: '#FAFAFC',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Check size={16} color="#10B981" />
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                            {perm.name}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                          {perm.description || 'Module permission'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2.5 }}>
                  <Button onClick={() => setIsStaffModalOpen(false)} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>
                    Close
                  </Button>

                  {staffModalMode === 'edit' && (
                    <Button
                      variant="contained"
                      onClick={handleSaveStaffPermissions}
                      sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}
                    >
                      Save Staff Permissions
                    </Button>
                  )}
                </DialogActions>
              </>
            )}
          </Dialog>

          {/* ========================================================================= */}
          {/* 3-STEP CREATE / EDIT ROLE MODAL WIZARD */}
          {/* ========================================================================= */}
          <Dialog
            open={isWizardOpen}
            onClose={() => setIsWizardOpen(false)}
            maxWidth={wizardStep === 2 ? 'md' : 'sm'}
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              {editingRole ? `Edit Role: ${roleName}` : 'Create New Role'}
              <IconButton onClick={() => setIsWizardOpen(false)} size="small"><X size={18} /></IconButton>
            </DialogTitle>

            {/* Stepper Header */}
            <Box sx={{ px: 3, pt: 1, pb: 2 }}>
              <Stepper activeStep={wizardStep - 1} alternativeLabel>
                <Step><StepLabel>Basic Info</StepLabel></Step>
                <Step><StepLabel>Permissions ({selectedPermissionIds.length})</StepLabel></Step>
                <Step><StepLabel>Review</StepLabel></Step>
              </Stepper>
            </Box>

            <DialogContent dividers sx={{ border: 'none', px: 3, py: 2 }}>
              {/* STEP 1: BASIC INFO */}
              {wizardStep === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    Basic Information
                  </Typography>

                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Role Name *</Typography>
                    <TextField fullWidth size="small" placeholder="e.g. Salon Manager" value={roleName} onChange={(e) => setRoleName(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Description</Typography>
                    <TextField fullWidth multiline rows={3} placeholder="Enter role description" value={roleDesc} onChange={(e) => setRoleDesc(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Role Type</Typography>
                      <Select fullWidth size="small" value={roleType} onChange={(e) => setRoleType(e.target.value)} sx={{ borderRadius: '10px' }}>
                        <MenuItem value="custom">Custom Role</MenuItem>
                        <MenuItem value="system" disabled>System Role</MenuItem>
                      </Select>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>Status</Typography>
                      <Select fullWidth size="small" value={roleStatus} onChange={(e) => setRoleStatus(e.target.value)} sx={{ borderRadius: '10px' }}>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* STEP 2: PERMISSIONS MATRIX (LIVE CHECKBOXES) */}
              {wizardStep === 2 && (
                <Grid container spacing={2} sx={{ minHeight: 380 }}>
                  {/* Left Sidebar: Modules List */}
                  <Grid size={{ xs: 12, md: 4 }} sx={{ borderRight: '1px solid #F3F4F6', pr: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#6B7280', display: 'block', mb: 1 }}>MODULE FILTERS</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {MODULES_LIST.map((mod) => {
                        const isSel = selectedModule === mod.id;
                        const IconComp = mod.icon;
                        return (
                          <Box
                            key={mod.id}
                            onClick={() => setSelectedModule(mod.id)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 1.2,
                              borderRadius: '10px',
                              backgroundColor: isSel ? '#F3E8FF' : 'transparent',
                              color: isSel ? '#7C3AED' : '#374151',
                              fontWeight: isSel ? 700 : 500,
                              cursor: 'pointer',
                              '&:hover': { backgroundColor: '#F9FAFB' },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                              <IconComp size={18} />
                              <Typography variant="body2" sx={{ fontWeight: 'inherit', fontSize: '0.84rem' }}>{mod.name}</Typography>
                            </Box>
                            <ChevronRight size={16} />
                          </Box>
                        );
                      })}
                    </Box>
                  </Grid>

                  {/* Right Side: Interactive Permission Checkboxes */}
                  <Grid size={{ xs: 12, md: 8 }} sx={{ pl: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', textTransform: 'capitalize' }}>
                        {selectedModule} Permissions ({currentFilteredPermissions.length})
                      </Typography>

                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={isAllCurrentSelected}
                            onChange={() => handleToggleSelectAll(currentFilteredPermissions)}
                            sx={{ color: '#7C3AED', '&.Mui-checked': { color: '#7C3AED' } }}
                          />
                        }
                        label={
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#7C3AED' }}>
                            Select All
                          </Typography>
                        }
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 280, overflowY: 'auto', pr: 0.5 }}>
                      {currentFilteredPermissions.map((perm) => {
                        const isChecked = selectedPermissionIds.includes(perm.id);
                        return (
                          <Box
                            key={perm.id}
                            onClick={() => handleTogglePermission(perm.id)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 1.2,
                              borderRadius: '10px',
                              border: `1.5px solid ${isChecked ? '#7C3AED' : '#F3F4F6'}`,
                              backgroundColor: isChecked ? '#F3E8FF' : '#FFFFFF',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              '&:hover': { borderColor: '#7C3AED' },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                              <Checkbox
                                size="small"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(perm.id)}
                                sx={{ color: '#D1D5DB', '&.Mui-checked': { color: '#7C3AED' } }}
                              />
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827' }}>
                                  {perm.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                                  {perm.description || 'System module permission'}
                                </Typography>
                              </Box>
                            </Box>

                            <Chip
                              label={isChecked ? 'Granted' : 'Revoked'}
                              size="small"
                              sx={{
                                backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.12)' : '#F3F4F6',
                                color: isChecked ? '#10B981' : '#9CA3AF',
                                fontWeight: 700,
                                fontSize: '0.625rem',
                                height: 18,
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>

                    {/* Bottom Access Note */}
                    <Box sx={{ mt: 2.5, p: 1.5, borderRadius: '12px', backgroundColor: '#F3E8FF', border: '1px solid #E9D5FF', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Lock size={18} color="#7C3AED" />
                      <Typography variant="caption" color="#7C3AED" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                        Selected ({selectedPermissionIds.length}) permissions will be assigned live to this role.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {/* STEP 3: REVIEW */}
              {wizardStep === 3 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {/* Role Summary Box */}
                  <Card sx={{ borderRadius: '16px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>Role Summary</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827' }}>
                        {roleName || 'Salon Manager'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label={roleType === 'system' ? 'System Role' : 'Custom Role'} size="small" sx={{ backgroundColor: '#EFF6FF', color: '#3B82F6', fontWeight: 800, height: 20 }} />
                        <Chip label="Active" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontWeight: 800, height: 20 }} />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {roleDesc || 'Manage staff, appointments and reports'}
                    </Typography>
                  </Card>

                  {/* Permissions Summary Box */}
                  <Card sx={{ borderRadius: '16px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>Assigned Permissions ({selectedPermissionIds.length})</Typography>
                      <Button size="small" onClick={() => setWizardStep(2)} sx={{ textTransform: 'none', fontWeight: 700, color: '#7C3AED' }}>Edit Permissions</Button>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'wrap', gap: 1, maxHeight: 180, overflowY: 'auto' }}>
                      {permissionsList
                        .filter((p) => selectedPermissionIds.includes(p.id))
                        .map((p) => (
                          <Chip key={p.id} label={p.name} size="small" sx={{ backgroundColor: '#F3E8FF', color: '#7C3AED', fontWeight: 700, fontSize: '0.72rem' }} />
                        ))}
                    </Box>
                  </Card>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
              {wizardStep > 1 ? (
                <Button onClick={() => setWizardStep(wizardStep - 1)} startIcon={<ArrowLeft size={16} />} sx={{ color: '#374151', textTransform: 'none', fontWeight: 700 }}>
                  Back
                </Button>
              ) : <Box />}

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button onClick={() => setIsWizardOpen(false)} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>
                  Cancel
                </Button>

                {wizardStep < 3 ? (
                  <Button
                    variant="contained"
                    onClick={() => setWizardStep(wizardStep + 1)}
                    sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}
                  >
                    Next: {wizardStep === 1 ? 'Permissions' : 'Review'} →
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSaveRole}
                    disabled={createRoleMutation.isPending || updateRoleMutation.isPending}
                    sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}
                  >
                    {createRoleMutation.isPending || updateRoleMutation.isPending
                      ? 'Saving...'
                      : editingRole ? 'Update Role →' : 'Create Role →'}
                  </Button>
                )}
              </Box>
            </DialogActions>
          </Dialog>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
