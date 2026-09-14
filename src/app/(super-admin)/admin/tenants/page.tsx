'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import {
  Building2,
  Search,
  CheckCircle2,
  AlertOctagon,
  Users,
  Calendar,
  IndianRupee,
  ExternalLink,
  Ban,
  PlayCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiService, TenantDirectoryItem } from '@/services/api/admin.service';
import { QUERY_KEYS } from '@/config/query-keys';
import { showToast } from '@/shared/components/Toast';
import { ImpersonateModal } from '@/shared/components/modals/ImpersonateModal';
import { SubscriptionPlanModal } from '@/shared/components/modals/SubscriptionPlanModal';
import { CreateTenantModal } from '@/shared/components/modals/CreateTenantModal';
import { TenantModuleToggleModal } from '@/shared/components/modals/TenantModuleToggleModal';
import { Zap, Plus, Sliders } from 'lucide-react';

export default function TenantsDirectoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [impersonateTarget, setImpersonateTarget] = useState<{ id: string; name: string } | null>(null);
  const [planModalTarget, setPlanModalTarget] = useState<{ id: string; name: string; planName: string } | null>(null);
  const [moduleModalTarget, setModuleModalTarget] = useState<{
    id: string;
    name: string;
    planName: string;
    initialModules: string[];
  } | null>(null);

  // Fetch Platform Overview Metrics
  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: QUERY_KEYS.admin.metrics,
    queryFn: () => adminApiService.getMetrics(),
  });

  // Fetch Tenants Directory
  const { data: tenants = [], isLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.admin.tenants({ search, status: statusFilter }),
    queryFn: () => adminApiService.getTenants(search, statusFilter),
  });

  // Toggle Tenant Status Mutation (Activate / Suspend)
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'SUSPENDED' }) =>
      adminApiService.updateTenantStatus(id, { status }),
    onSuccess: (updated) => {
      showToast.success('Tenant Status Updated', `${updated.name} is now ${updated.status}`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.tenants() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.metrics });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update tenant status';
      showToast.error('Update Failed', msg);
    },
  });

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Tenants Control Directory
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage SaaS salon subscriptions, tenant lifecycles, and support access
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
            onClick={() => setIsCreateModalOpen(true)}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 800,
              px: 2.5,
              backgroundColor: '#7C3AED',
              '&:hover': { backgroundColor: '#6D28D9' },
            }}
          >
            Onboard New Salon
          </Button>
        </Box>
      </Box>

      {/* Platform KPI Metrics Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: '20px',
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Salons
                </Typography>
                {isMetricsLoading ? (
                  <Skeleton animation="wave" width={60} height={36} sx={{ mt: 0.5, borderRadius: '6px' }} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5, color: 'text.primary' }}>
                    {metrics?.totalTenants ?? 0}
                  </Typography>
                )}
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '14px', backgroundColor: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                <Building2 size={24} />
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: '20px',
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Active Subscribers
                </Typography>
                {isMetricsLoading ? (
                  <Skeleton animation="wave" width={60} height={36} sx={{ mt: 0.5, borderRadius: '6px' }} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5, color: '#10B981' }}>
                    {metrics?.activeTenants ?? 0}
                  </Typography>
                )}
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                <CheckCircle2 size={24} />
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: '20px',
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Suspended Salons
                </Typography>
                {isMetricsLoading ? (
                  <Skeleton animation="wave" width={60} height={36} sx={{ mt: 0.5, borderRadius: '6px' }} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5, color: '#EF4444' }}>
                    {metrics?.suspendedTenants ?? 0}
                  </Typography>
                )}
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '14px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#EF4444' }}>
                <AlertOctagon size={24} />
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: '20px',
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Salon GMV
                </Typography>
                {isMetricsLoading ? (
                  <Skeleton animation="wave" width={90} height={36} sx={{ mt: 0.5, borderRadius: '6px' }} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5, color: '#F59E0B' }}>
                    ₹{(metrics?.totalGMV || 0).toLocaleString()}
                  </Typography>
                )}
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '14px', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}>
                <IndianRupee size={24} />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Main Tenants Table Section */}
      <Card
        sx={{
          borderRadius: '24px',
          border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
          backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
          p: 3,
        }}
      >
        {/* Table Filters & Search */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <TextField
            size="small"
            placeholder="Search tenant by salon name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: '100%', sm: 340 }, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />

          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ borderRadius: '12px', minWidth: 160 }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="ACTIVE">Active Only</MenuItem>
            <MenuItem value="SUSPENDED">Suspended Only</MenuItem>
          </Select>
        </Box>

        {/* Directory Table */}
        <TableContainer>
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9') } }}>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Salon Name</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Owner Email</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Usage (Staff / Customers)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Skeleton animation="wave" variant="circular" width={40} height={40} />
                        <Box>
                          <Skeleton animation="wave" width={140} height={20} />
                          <Skeleton animation="wave" width={80} height={14} sx={{ mt: 0.5 }} />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell><Skeleton animation="wave" width={160} height={20} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={80} height={24} sx={{ borderRadius: '12px' }} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={100} height={24} sx={{ borderRadius: '12px' }} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={140} height={20} /></TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Skeleton animation="wave" width={32} height={32} sx={{ borderRadius: '8px' }} />
                        <Skeleton animation="wave" width={32} height={32} sx={{ borderRadius: '8px' }} />
                        <Skeleton animation="wave" width={32} height={32} sx={{ borderRadius: '8px' }} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : tenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No tenants found matching filters.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map((t) => {
                  const isSuspended = t.status === 'SUSPENDED';
                  return (
                    <TableRow key={t.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: '10px',
                              backgroundColor: 'rgba(124, 58, 237, 0.1)',
                              color: '#7C3AED',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.9rem',
                            }}
                          >
                            {t.name.charAt(0).toUpperCase()}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                              {t.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              ID: {t.id.slice(0, 8)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
                        {t.ownerEmail}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            borderRadius: '6px',
                            backgroundColor: isSuspended ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                            color: isSuspended ? '#EF4444' : '#10B981',
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Click to Change Subscription Plan">
                          <Chip
                            icon={<Zap size={12} color="#7C3AED" />}
                            label={t.subscription?.planName || 'Trial'}
                            size="small"
                            onClick={() =>
                              setPlanModalTarget({
                                id: t.id,
                                name: t.name,
                                planName: t.subscription?.planName || 'Trial',
                              })
                            }
                            sx={{
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              backgroundColor: 'rgba(124, 58, 237, 0.12)',
                              color: '#A78BFA',
                              border: '1px solid rgba(124, 58, 237, 0.3)',
                              '&:hover': {
                                backgroundColor: 'rgba(124, 58, 237, 0.25)',
                              },
                            }}
                          />
                        </Tooltip>
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.78125rem', fontWeight: 600, color: 'text.secondary' }}>
                        {t.counts.staff} Staff • {t.counts.customers} Clients • {t.counts.appointments} Appts
                      </TableCell>

                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          {/* Access Tenant Support Button */}
                          <Tooltip title="Impersonate Tenant for Support">
                            <Button
                              size="small"
                              variant="contained"
                              color="secondary"
                              startIcon={<ExternalLink size={14} />}
                              onClick={() => setImpersonateTarget({ id: t.id, name: t.name })}
                              sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 800,
                                fontSize: '0.72rem',
                                py: 0.5,
                                backgroundColor: '#7C3AED',
                                '&:hover': { backgroundColor: '#6D28D9' },
                              }}
                            >
                              Access Tenant
                            </Button>
                          </Tooltip>

                          {/* Change Subscription Plan Button */}
                          <Tooltip title="Change Subscription Plan">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() =>
                                setPlanModalTarget({
                                  id: t.id,
                                  name: t.name,
                                  planName: t.subscription?.planName || 'Trial',
                                })
                              }
                              sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                py: 0.5,
                              }}
                            >
                              Manage Plan
                            </Button>
                          </Tooltip>

                          {/* Selective Module Feature Toggles Button */}
                          <Tooltip title="Custom Module Feature Permissions">
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              startIcon={<Sliders size={14} />}
                              onClick={() =>
                                setModuleModalTarget({
                                  id: t.id,
                                  name: t.name,
                                  planName: t.subscription?.planName || 'Trial',
                                  initialModules: (t.subscription as any)?.effectiveModules || [],
                                })
                              }
                              sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 800,
                                fontSize: '0.72rem',
                                py: 0.5,
                                borderColor: 'rgba(16, 185, 129, 0.4)',
                                color: '#10B981',
                                '&:hover': {
                                  borderColor: '#10B981',
                                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                                },
                              }}
                            >
                              Permissions
                            </Button>
                          </Tooltip>

                          {/* Suspend / Reactivate Action */}
                          {isSuspended ? (
                            <Tooltip title="Reactivate Tenant">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => statusMutation.mutate({ id: t.id, status: 'ACTIVE' })}
                              >
                                <PlayCircle size={18} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Suspend Tenant Access">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => statusMutation.mutate({ id: t.id, status: 'SUSPENDED' })}
                              >
                                <Ban size={18} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Audited Impersonation Reason Prompt Modal */}
      {impersonateTarget && (
        <ImpersonateModal
          open={!!impersonateTarget}
          onClose={() => setImpersonateTarget(null)}
          tenantId={impersonateTarget.id}
          tenantName={impersonateTarget.name}
        />
      )}

      {/* Subscription Plan Assignment Modal */}
      {planModalTarget && (
        <SubscriptionPlanModal
          open={!!planModalTarget}
          onClose={() => setPlanModalTarget(null)}
          tenantId={planModalTarget.id}
          tenantName={planModalTarget.name}
          currentPlanName={planModalTarget.planName}
        />
      )}

      {/* Selective Feature Permission Toggles Modal */}
      {moduleModalTarget && (
        <TenantModuleToggleModal
          open={!!moduleModalTarget}
          onClose={() => setModuleModalTarget(null)}
          tenantId={moduleModalTarget.id}
          tenantName={moduleModalTarget.name}
          planName={moduleModalTarget.planName}
          initialModules={moduleModalTarget.initialModules}
        />
      )}

      {/* Onboard New Salon Tenant Modal */}
      <CreateTenantModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Box>
  );
}
