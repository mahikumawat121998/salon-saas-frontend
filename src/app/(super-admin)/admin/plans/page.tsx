'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import {
  Zap,
  Plus,
  Edit2,
  Trash2,
  Building2,
  Users,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  DollarSign,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiService } from '@/services/api/admin.service';
import { QUERY_KEYS } from '@/config/query-keys';
import { showToast } from '@/shared/components/Toast';
import { CreateEditPlanModal } from '@/shared/components/modals/CreateEditPlanModal';

const ALL_MODULE_MAP: Record<string, string> = {
  APPOINTMENTS: 'Appointments Calendar',
  CUSTOMERS: 'Client CRM & Notes',
  CATALOG: 'Service Catalog & Pricing',
  STAFF: 'Staff Roster & Leave Management',
  BILLING: 'Invoicing & POS Checkout',
  INVENTORY: 'Inventory & Stock Control',
  REPORTS: 'Revenue & Staff Analytics',
  MARKETING: 'SMS Marketing Campaigns',
  WHATSAPP: 'WhatsApp Business Direct',
  ATTENDANCE: 'Attendance Tracking',
  LEAVE: 'Leave Management',
  PAYROLL: 'Payroll & Commissions',
};

export default function PlansManagementPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  // Fetch SaaS Subscription Plans
  const { data: plans = [], isLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.admin.plans,
    queryFn: () => adminApiService.getPlans(),
  });

  // Delete Plan Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApiService.deletePlan(id),
    onSuccess: () => {
      showToast.success('Plan Deleted', 'Subscription plan deleted successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.plans });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete plan';
      showToast.error('Delete Failed', msg);
    },
  });

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleDelete = (plan: any) => {
    if (confirm(`Are you sure you want to delete "${plan.name}"?`)) {
      deleteMutation.mutate(plan.id);
    }
  };

  const totalSubscribers = plans.reduce((acc, p) => acc + (p.subscriberCount || 0), 0);
  const estimatedMRR = plans.reduce((acc, p) => acc + (p.subscriberCount || 0) * (p.monthlyPrice || 0), 0);

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Subscription Plans & Permissions Control
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Configure SaaS plan tiers, monthly/yearly pricing & module permission matrices
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={() => refetch()}
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
          >
            Refresh Data
          </Button>

          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={handleCreate}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 800,
              px: 2.5,
              backgroundColor: '#7C3AED',
              '&:hover': { backgroundColor: '#6D28D9' },
            }}
          >
            Create New Plan
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: '20px',
              border: (t) => `1px solid ${t.palette.divider}`,
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em' }}>
              TOTAL PLAN TIERS
            </Typography>
            {isLoading ? (
              <Skeleton animation="wave" width={60} height={44} sx={{ mt: 0.5, borderRadius: '8px' }} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mt: 0.5 }}>
                {plans.length}
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: '20px',
              border: (t) => `1px solid ${t.palette.divider}`,
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em' }}>
              ACTIVE SALON SUBSCRIBERS
            </Typography>
            {isLoading ? (
              <Skeleton animation="wave" width={60} height={44} sx={{ mt: 0.5, borderRadius: '8px' }} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#10B981', mt: 0.5 }}>
                {totalSubscribers}
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: '20px',
              border: (t) => `1px solid ${t.palette.divider}`,
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em' }}>
              ESTIMATED SAAS MRR
            </Typography>
            {isLoading ? (
              <Skeleton animation="wave" width={100} height={44} sx={{ mt: 0.5, borderRadius: '8px' }} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#7C3AED', mt: 0.5 }}>
                ₹{estimatedMRR.toLocaleString('en-IN')}
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: '20px',
              border: (t) => `1px solid ${t.palette.divider}`,
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em' }}>
              AVERAGE ARPU
            </Typography>
            {isLoading ? (
              <Skeleton animation="wave" width={80} height={44} sx={{ mt: 0.5, borderRadius: '8px' }} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#3B82F6', mt: 0.5 }}>
                ₹{totalSubscribers > 0 ? Math.round(estimatedMRR / totalSubscribers).toLocaleString('en-IN') : '0'}
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Plans Cards Grid */}
      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((key) => (
            <Grid size={{ xs: 12, md: 4 }} key={key}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '24px',
                  border: (t) => `1px solid ${t.palette.divider}`,
                  backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
                  height: 380,
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                }}
              >
                <Box>
                  <Skeleton animation="wave" width="60%" height={32} sx={{ mb: 1 }} />
                  <Skeleton animation="wave" width="85%" height={20} sx={{ mb: 3 }} />
                  <Skeleton animation="wave" width="50%" height={48} sx={{ mb: 2 }} />
                  <Skeleton animation="wave" width="100%" height={24} sx={{ mb: 1 }} />
                  <Skeleton animation="wave" width="100%" height={24} sx={{ mb: 1 }} />
                  <Skeleton animation="wave" width="70%" height={24} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                  <Skeleton animation="wave" width="50%" height={36} sx={{ borderRadius: '12px' }} />
                  <Skeleton animation="wave" width="50%" height={36} sx={{ borderRadius: '12px' }} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan: any) => (
            <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  position: 'relative',
                  border: (t) => `1px solid ${t.palette.divider}`,
                  backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
                  boxShadow: '0px 10px 30px rgba(15, 23, 42, 0.04)',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'translateY(-3px)' },
                }}
              >
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                        {plan.name}
                      </Typography>
                      <Chip
                        label={plan.code}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.62rem',
                          backgroundColor: 'rgba(124, 58, 237, 0.15)',
                          color: '#A78BFA',
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {plan.description || 'Complete salon management package'}
                    </Typography>
                  </Box>

                  <Chip
                    label={`${plan.subscriberCount || 0} Salons`}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10B981',
                    }}
                  />
                </Box>

                {/* Price Display */}
                <Box sx={{ my: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#7C3AED' }}>
                    ₹{plan.monthlyPrice.toLocaleString('en-IN')}
                    <Typography component="span" variant="subtitle2" color="text.secondary">
                      /mo
                    </Typography>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Yearly Billing: ₹{plan.yearlyPrice.toLocaleString('en-IN')}/year
                  </Typography>
                </Box>

                {/* Limits */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    py: 1.5,
                    px: 2,
                    borderRadius: '14px',
                    backgroundColor: (t) => (t.palette.mode === 'dark' ? '#0B0F17' : '#F8FAFC'),
                    mb: 2.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Users size={16} color="#3B82F6" />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {plan.maxStaff} Staff
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Building2 size={16} color="#EC4899" />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {plan.maxOutlets} Outlets
                    </Typography>
                  </Box>
                </Box>

                {/* Module Checklist */}
                <Box sx={{ flexGrow: 1, mb: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>
                    INCLUDED MODULE PERMISSIONS:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {Object.entries(ALL_MODULE_MAP).map(([code, label]) => {
                      const isAllowed = plan.allowedModules?.includes(code);

                      return (
                        <Box key={code} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <CheckCircle2 size={15} color={isAllowed ? '#10B981' : '#9CA3AF'} />
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: isAllowed ? 'text.primary' : 'text.disabled',
                              textDecoration: isAllowed ? 'none' : 'line-through',
                            }}
                          >
                            {label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1.5, pt: 2, borderTop: (t) => `1px solid ${t.palette.divider}` }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Edit2 size={16} />}
                    onClick={() => handleEdit(plan)}
                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                  >
                    Edit Plan
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(plan)}
                    sx={{ borderRadius: '12px', border: (t) => `1px solid ${t.palette.divider}` }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create / Edit Plan Modal */}
      <CreateEditPlanModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planToEdit={editingPlan}
      />
    </Box>
  );
}
