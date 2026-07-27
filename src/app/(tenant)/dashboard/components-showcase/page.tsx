'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import AvatarGroup from '@mui/material/AvatarGroup';
import {
  Users,
  Calendar,
  Package,
  BarChart3,
  WifiOff,
  Lock,
  ServerOff,
  Clock,
  CheckCircle2,
  UserPlus,
  Gift,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Search,
  Filter,
  Bell,
  X,
  Sparkles,
  Scissors,
  RotateCw,
} from 'lucide-react';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import { Avatar } from '@/shared/ui/Avatar';
import { AddCustomerModal } from '@/shared/components/modals/AddCustomerModal';
import { AddServiceModal } from '@/shared/components/modals/AddServiceModal';
import { CustomerDetailsDrawer } from '@/shared/components/drawers/CustomerDetailsDrawer';
import { ConfirmationDialog } from '@/shared/components/dialogs/ConfirmationDialog';

export default function ComponentsShowcasePage() {
  // Modal & Drawer State
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [confirmDialogState, setConfirmDialogState] = useState<{
    open: boolean;
    type: 'delete_customer' | 'cancel_appointment' | 'deactivate_staff';
  }>({ open: false, type: 'delete_customer' });

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', maxWidth: '100%', pb: 6 }}>
          {/* Header Title */}
          <PageHeader
            title="Supportive Screens & UI Components"
            subtitle="Modals, Drawers, States, Notifications & Components"
          />

          {/* ========================================================================= */}
          {/* 1. MODALS & DRAWERS TRIGGER SECTION */}
          {/* ========================================================================= */}
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#6B7280', letterSpacing: 0.5, mb: 2, textTransform: 'uppercase' }}>
            Interactive Modals & Drawers
          </Typography>

          <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, mb: 5, backgroundColor: '#FFFFFF' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setIsAddCustomerOpen(true)}
                  startIcon={<UserPlus size={18} />}
                  sx={{ backgroundColor: '#7C3AED', borderRadius: '12px', py: 1.2, fontWeight: 700, textTransform: 'none' }}
                >
                  Open Add Customer
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setIsAddServiceOpen(true)}
                  startIcon={<Scissors size={18} />}
                  sx={{ backgroundColor: '#7C3AED', borderRadius: '12px', py: 1.2, fontWeight: 700, textTransform: 'none' }}
                >
                  Open Add Service
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setIsCustomerDrawerOpen(true)}
                  startIcon={<Users size={18} />}
                  sx={{ borderRadius: '12px', py: 1.2, fontWeight: 700, textTransform: 'none', color: '#7C3AED', borderColor: '#7C3AED' }}
                >
                  Open Customer Drawer
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setConfirmDialogState({ open: true, type: 'delete_customer' })}
                  startIcon={<Trash2 size={18} color="#EF4444" />}
                  sx={{ borderRadius: '12px', py: 1.2, fontWeight: 700, textTransform: 'none', color: '#EF4444', borderColor: '#FEE2E2' }}
                >
                  Open Delete Confirmation
                </Button>
              </Grid>
            </Grid>
          </Card>

          {/* ========================================================================= */}
          {/* 2. CONFIRMATION DIALOGS PREVIEW SECTION */}
          {/* ========================================================================= */}
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#6B7280', letterSpacing: 0.5, mb: 2, textTransform: 'uppercase' }}>
            Confirmation Dialogs
          </Typography>

          <Grid container spacing={3} sx={{ mb: 5 }}>
            {/* Delete Customer */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <Trash2 size={24} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
                  Delete Customer?
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
                  Are you sure you want to delete this customer? This action cannot be undone.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button fullWidth variant="outlined" size="small" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
                  <Button fullWidth variant="contained" size="small" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 800, backgroundColor: '#EF4444' }}>Delete</Button>
                </Box>
              </Card>
            </Grid>

            {/* Cancel Appointment */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: '#FEF3C7', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <Calendar size={24} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
                  Cancel Appointment?
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
                  Are you sure you want to cancel this appointment?
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button fullWidth variant="outlined" size="small" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>No, Keep It</Button>
                  <Button fullWidth variant="contained" size="small" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 800, backgroundColor: '#F59E0B' }}>Yes, Cancel</Button>
                </Box>
              </Card>
            </Grid>

            {/* Deactivate Staff */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <Users size={24} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
                  Deactivate Staff?
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
                  Are you sure you want to deactivate this staff member?
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button fullWidth variant="outlined" size="small" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
                  <Button fullWidth variant="contained" size="small" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 800, backgroundColor: '#3B82F6' }}>Deactivate</Button>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* ========================================================================= */}
          {/* 3. NOTIFICATIONS (TOASTS) SECTION */}
          {/* ========================================================================= */}
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#6B7280', letterSpacing: 0.5, mb: 2, textTransform: 'uppercase' }}>
            Notifications (Toasts)
          </Typography>

          <Grid container spacing={2} sx={{ mb: 5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Alert severity="success" sx={{ borderRadius: '14px', border: '1px solid #D1FAE5', fontWeight: 600 }}>
                <AlertTitle sx={{ fontWeight: 800 }}>Success</AlertTitle>
                Appointment created successfully.
              </Alert>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Alert severity="info" sx={{ borderRadius: '14px', border: '1px solid #DBEAFE', fontWeight: 600 }}>
                <AlertTitle sx={{ fontWeight: 800 }}>Info</AlertTitle>
                Your changes have been saved.
              </Alert>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Alert severity="warning" sx={{ borderRadius: '14px', border: '1px solid #FEF3C7', fontWeight: 600 }}>
                <AlertTitle sx={{ fontWeight: 800 }}>Warning</AlertTitle>
                Inventory is running low.
              </Alert>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Alert severity="error" sx={{ borderRadius: '14px', border: '1px solid #FEE2E2', fontWeight: 600 }}>
                <AlertTitle sx={{ fontWeight: 800 }}>Error</AlertTitle>
                Something went wrong. Please try again.
              </Alert>
            </Grid>
          </Grid>

          {/* ========================================================================= */}
          {/* 4. EMPTY STATES SECTION */}
          {/* ========================================================================= */}
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#6B7280', letterSpacing: 0.5, mb: 2, textTransform: 'uppercase' }}>
            Empty States
          </Typography>

          <Grid container spacing={3} sx={{ mb: 5 }}>
            {/* No Customers */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '16px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <Users size={26} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>No Customers Found</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>You haven&apos;t added any customers yet.</Typography>
                <Button size="small" variant="contained" sx={{ backgroundColor: '#7C3AED', borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>Add Customer</Button>
              </Card>
            </Grid>

            {/* No Appointments */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '16px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <Calendar size={26} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>No Appointments</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>No appointments scheduled for now.</Typography>
                <Button size="small" variant="contained" sx={{ backgroundColor: '#7C3AED', borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>New Appointment</Button>
              </Card>
            </Grid>

            {/* No Inventory */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '16px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <Package size={26} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>No Inventory Items</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>You don&apos;t have any inventory items.</Typography>
                <Button size="small" variant="contained" sx={{ backgroundColor: '#7C3AED', borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>Add Product</Button>
              </Card>
            </Grid>

            {/* No Reports */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '16px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <BarChart3 size={26} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>No Reports Available</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>No data available for the selected period.</Typography>
                <Button size="small" variant="contained" sx={{ backgroundColor: '#7C3AED', borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>View Reports</Button>
              </Card>
            </Grid>
          </Grid>

          {/* ========================================================================= */}
          {/* 5. ERROR STATES SECTION */}
          {/* ========================================================================= */}
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#6B7280', letterSpacing: 0.5, mb: 2, textTransform: 'uppercase' }}>
            Error States
          </Typography>

          <Grid container spacing={3} sx={{ mb: 5 }}>
            {/* No Internet */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '16px', backgroundColor: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <WifiOff size={26} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>No Internet Connection</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Please check your internet and try again.</Typography>
                <Button size="small" variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>Try Again</Button>
              </Card>
            </Grid>

            {/* Access Denied */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '16px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <Lock size={26} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>Access Denied</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>You don&apos;t have permission to access this page.</Typography>
                <Button size="small" variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>Go Back</Button>
              </Card>
            </Grid>

            {/* Server Error */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '16px', backgroundColor: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <ServerOff size={26} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>Server Error</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Something went wrong on our end.</Typography>
                <Button size="small" variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>Try Again</Button>
              </Card>
            </Grid>

            {/* Session Expired */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '16px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <Clock size={26} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>Session Expired</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Your session has expired. Please login again.</Typography>
                <Button size="small" variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>Login Again</Button>
              </Card>
            </Grid>
          </Grid>

          {/* ========================================================================= */}
          {/* 6. SUCCESS SCREENS SECTION */}
          {/* ========================================================================= */}
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#6B7280', letterSpacing: 0.5, mb: 2, textTransform: 'uppercase' }}>
            Success Screens
          </Typography>

          <Grid container spacing={3} sx={{ mb: 5 }}>
            {/* Appointment Created */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <CheckCircle2 size={32} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>Appointment Created!</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>The appointment has been created successfully.</Typography>
                <Button size="small" variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, color: '#10B981', borderColor: '#D1FAE5' }}>View Appointment</Button>
              </Card>
            </Grid>

            {/* Customer Added */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <UserPlus size={32} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>Customer Added!</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>The customer has been added successfully.</Typography>
                <Button size="small" variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, color: '#10B981', borderColor: '#D1FAE5' }}>View Customer</Button>
              </Card>
            </Grid>

            {/* Payment Successful */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <Gift size={32} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>Payment Successful!</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Payment has been processed successfully.</Typography>
                <Button size="small" variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, color: '#10B981', borderColor: '#D1FAE5' }}>View Invoice</Button>
              </Card>
            </Grid>

            {/* Inventory Updated */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <Package size={32} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>Inventory Updated!</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Inventory has been updated successfully.</Typography>
                <Button size="small" variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, color: '#10B981', borderColor: '#D1FAE5' }}>View Inventory</Button>
              </Card>
            </Grid>
          </Grid>

          {/* ========================================================================= */}
          {/* 7. UI COMPONENTS SYSTEM */}
          {/* ========================================================================= */}
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#6B7280', letterSpacing: 0.5, mb: 2, textTransform: 'uppercase' }}>
            UI Components System
          </Typography>

          <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3.5, backgroundColor: '#FFFFFF' }}>
            <Grid container spacing={3}>
              {/* Buttons */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#6B7280', display: 'block', mb: 1 }}>BUTTONS</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Button variant="contained" sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}>Primary Button</Button>
                  <Button variant="outlined" sx={{ color: '#7C3AED', borderColor: '#7C3AED', textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}>Outline Button</Button>
                  <Button sx={{ color: '#7C3AED', textTransform: 'none', fontWeight: 700 }}>Text Button</Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <IconButton size="small" sx={{ border: '1px solid #E5E7EB', borderRadius: '8px' }}><Plus size={16} /></IconButton>
                  <IconButton size="small" sx={{ border: '1px solid #E5E7EB', borderRadius: '8px' }}><Edit2 size={16} /></IconButton>
                  <IconButton size="small" sx={{ border: '1px solid #FEE2E2', color: '#EF4444', borderRadius: '8px' }}><Trash2 size={16} /></IconButton>
                  <IconButton size="small" sx={{ border: '1px solid #E5E7EB', borderRadius: '8px' }}><Eye size={16} /></IconButton>
                  <IconButton size="small" sx={{ border: '1px solid #E5E7EB', borderRadius: '8px' }}><Download size={16} /></IconButton>
                </Box>
              </Grid>

              {/* Status Chips */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#6B7280', display: 'block', mb: 1 }}>STATUS CHIPS</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Confirmed" size="small" sx={{ backgroundColor: '#ECFDF5', color: '#10B981', fontWeight: 700 }} />
                  <Chip label="Pending" size="small" sx={{ backgroundColor: '#FFF7ED', color: '#F97316', fontWeight: 700 }} />
                  <Chip label="Cancelled" size="small" sx={{ backgroundColor: '#FEE2E2', color: '#EF4444', fontWeight: 700 }} />
                  <Chip label="Completed" size="small" sx={{ backgroundColor: '#ECFDF5', color: '#10B981', fontWeight: 700 }} />
                  <Chip label="No Show" size="small" sx={{ backgroundColor: '#F3F4F6', color: '#6B7280', fontWeight: 700 }} />
                  <Chip label="In Progress" size="small" sx={{ backgroundColor: '#EFF6FF', color: '#3B82F6', fontWeight: 700 }} />
                </Box>
              </Grid>

              {/* Tags */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#6B7280', display: 'block', mb: 1 }}>SERVICE TAGS</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['Haircut', 'Hair Color', 'Facial', 'Beard Trim', 'Makeup', 'Massage'].map((tag) => (
                    <Chip key={tag} label={tag} size="small" sx={{ backgroundColor: '#F3E8FF', color: '#7C3AED', fontWeight: 600, fontSize: '0.72rem' }} />
                  ))}
                </Box>
              </Grid>

              {/* Avatars */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#6B7280', display: 'block', mb: 1 }}>AVATARS & GROUP</Typography>
                <AvatarGroup max={4}>
                  <Avatar name="Priya Sharma" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" />
                  <Avatar name="Alex Johnson" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" />
                  <Avatar name="Sophia Martinez" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80" />
                  <Avatar name="Rohan Singh" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" />
                </AvatarGroup>
              </Grid>
            </Grid>
          </Card>

          {/* Render Modals / Drawers */}
          <AddCustomerModal open={isAddCustomerOpen} onClose={() => setIsAddCustomerOpen(false)} />
          <AddServiceModal open={isAddServiceOpen} onClose={() => setIsAddServiceOpen(false)} />
          <CustomerDetailsDrawer open={isCustomerDrawerOpen} onClose={() => setIsCustomerDrawerOpen(false)} />
          <ConfirmationDialog
            open={confirmDialogState.open}
            type={confirmDialogState.type}
            onClose={() => setConfirmDialogState((prev) => ({ ...prev, open: false }))}
            onConfirm={() => {}}
          />
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
