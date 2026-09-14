'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import { X, ShieldCheck, Zap, CheckCircle2, Sparkles } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiService } from '@/services/api/admin.service';
import { QUERY_KEYS } from '@/config/query-keys';
import { showToast } from '@/shared/components/Toast';

interface SubscriptionPlanModalProps {
  open: boolean;
  onClose: () => void;
  tenantId: string;
  tenantName: string;
  currentPlanName?: string;
}

export function SubscriptionPlanModal({
  open,
  onClose,
  tenantId,
  tenantName,
  currentPlanName = 'Trial',
}: SubscriptionPlanModalProps) {
  const queryClient = useQueryClient();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  // Fetch available Subscription Plans
  const { data: plans = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.admin.plans,
    queryFn: () => adminApiService.getPlans(),
    enabled: open,
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: () => adminApiService.updateTenantSubscription(tenantId, { planId: selectedPlanId!, reason }),
    onSuccess: (data: any) => {
      showToast.success('Subscription Updated', `${tenantName} subscription changed successfully`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.tenants() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.metrics });
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update subscription';
      showToast.error('Update Failed', msg);
    },
  });

  const handleConfirm = () => {
    if (!selectedPlanId) {
      showToast.error('Plan Required', 'Please select a subscription plan');
      return;
    }
    updateSubscriptionMutation.mutate();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            p: 1.5,
            backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            border: (t) => `1px solid ${t.palette.divider}`,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.3)',
            }}
          >
            <Zap size={22} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary' }}>
              Manage Subscription Plan
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Update plan tier & module permissions for <strong>{tenantName}</strong> (Current: {currentPlanName})
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        {isLoading ? (
          <Grid container spacing={2.5}>
            {[1, 2, 3].map((k) => (
              <Grid size={{ xs: 12, md: 4 }} key={k}>
                <Card sx={{ p: 2.5, borderRadius: '18px', height: 220 }}>
                  <Skeleton animation="wave" width="60%" height={28} sx={{ mb: 1 }} />
                  <Skeleton animation="wave" width="40%" height={36} sx={{ mb: 2 }} />
                  <Skeleton animation="wave" width="100%" height={16} sx={{ mb: 1 }} />
                  <Skeleton animation="wave" width="80%" height={16} />
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2.5}>
            {plans.map((plan: any) => {
              const isSelected = selectedPlanId === plan.id;
              const isCurrent = currentPlanName?.toLowerCase() === plan.name?.toLowerCase();

              return (
                <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
                  <Card
                    onClick={() => setSelectedPlanId(plan.id)}
                    sx={{
                      p: 2.5,
                      borderRadius: '18px',
                      cursor: 'pointer',
                      position: 'relative',
                      border: isSelected
                        ? '2px solid #7C3AED'
                        : (t) => `1px solid ${t.palette.divider}`,
                      backgroundColor: isSelected
                        ? (t) => (t.palette.mode === 'dark' ? 'rgba(124, 58, 237, 0.12)' : 'rgba(124, 58, 237, 0.04)')
                        : (t) => (t.palette.mode === 'dark' ? '#0B0F17' : '#FAFAFC'),
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: '#7C3AED',
                      },
                    }}
                  >
                    {isCurrent && (
                      <Chip
                        label="CURRENT PLAN"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          height: 20,
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          color: '#10B981',
                        }}
                      />
                    )}

                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', mb: 0.5 }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', minHeight: 36, mb: 1.5 }}>
                      {plan.description || 'Module package for growing salons'}
                    </Typography>

                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#7C3AED', mb: 1.5 }}>
                      ₹{plan.monthlyPrice.toLocaleString('en-IN')}
                      <Typography component="span" variant="caption" color="text.secondary">
                        /month
                      </Typography>
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 1, borderTop: (t) => `1px solid ${t.palette.divider}` }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        LIMITS & MODULES:
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle2 size={14} color="#10B981" />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Up to {plan.maxStaff} Staff Members
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle2 size={14} color="#10B981" />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Up to {plan.maxOutlets} Salon Outlets
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle2 size={14} color={plan.enableInventory ? '#10B981' : '#9CA3AF'} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: plan.enableInventory ? 'text.primary' : 'text.disabled',
                            textDecoration: plan.enableInventory ? 'none' : 'line-through',
                          }}
                        >
                          Inventory & Stock Control
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle2 size={14} color={plan.enableReports ? '#10B981' : '#9CA3AF'} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: plan.enableReports ? 'text.primary' : 'text.disabled',
                            textDecoration: plan.enableReports ? 'none' : 'line-through',
                          }}
                        >
                          Revenue & Staff Analytics
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle2 size={14} color={plan.enableMarketing ? '#10B981' : '#9CA3AF'} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: plan.enableMarketing ? 'text.primary' : 'text.disabled',
                            textDecoration: plan.enableMarketing ? 'none' : 'line-through',
                          }}
                        >
                          WhatsApp & SMS Marketing
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            size="small"
            label="Audit Reason for Plan Change"
            placeholder="e.g. Upgraded per customer request after plan subscription payment"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedPlanId || updateSubscriptionMutation.isPending}
          sx={{
            borderRadius: '10px',
            fontWeight: 800,
            textTransform: 'none',
            px: 3,
            backgroundColor: '#7C3AED',
            '&:hover': { backgroundColor: '#6D28D9' },
          }}
        >
          {updateSubscriptionMutation.isPending ? 'Updating...' : 'Assign Subscription Plan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
