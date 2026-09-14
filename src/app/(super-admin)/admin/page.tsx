'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import {
  Building2,
  TrendingUp,
  Users,
  ShieldCheck,
  IndianRupee,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  FileText,
  BarChart3,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApiService } from '@/services/api/admin.service';
import { QUERY_KEYS } from '@/config/query-keys';
import { ImpersonateModal } from '@/shared/components/modals/ImpersonateModal';

export default function SuperAdminDashboard() {
  const [impersonateTarget, setImpersonateTarget] = useState<{ id: string; name: string } | null>(null);

  // Fetch Platform Metrics
  const { data: metrics, isLoading: isMetricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: QUERY_KEYS.admin.metrics,
    queryFn: () => adminApiService.getMetrics(),
  });

  // Fetch Tenants Directory
  const { data: tenants = [], isLoading: isTenantsLoading, refetch: refetchTenants } = useQuery({
    queryKey: QUERY_KEYS.admin.tenants(),
    queryFn: () => adminApiService.getTenants(),
  });

  // Fetch Audit Logs
  const { data: auditLogs = [] } = useQuery({
    queryKey: QUERY_KEYS.admin.auditLogs,
    queryFn: () => adminApiService.getAuditLogs(),
  });

  const handleRefresh = () => {
    refetchMetrics();
    refetchTenants();
  };

  const activeTenants = tenants.filter((t) => t.status === 'ACTIVE');
  const suspendedTenants = tenants.filter((t) => t.status === 'SUSPENDED');
  const recentTenants = tenants.slice(0, 5);
  const recentLogs = auditLogs.slice(0, 5);

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Top Welcome Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
              Platform Overview Dashboard
            </Typography>
            <Chip
              icon={<Sparkles size={14} style={{ color: '#7C3AED' }} />}
              label="SAMS CONTROL"
              size="small"
              sx={{ backgroundColor: 'rgba(124, 58, 237, 0.15)', color: '#A78BFA', fontWeight: 800, fontSize: '0.68rem' }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Global multi-tenant analytics, SaaS revenue, active salon directory, and audit activity
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={handleRefresh}
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            component={Link}
            href="/admin/tenants"
            startIcon={<Building2 size={16} />}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 800,
              backgroundColor: '#7C3AED',
              '&:hover': { backgroundColor: '#6D28D9' },
            }}
          >
            Manage Tenants
          </Button>
        </Box>
      </Box>

      {/* Primary KPI Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Card 1: Monthly Recurring Revenue */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: '24px',
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
              boxShadow: (t) => (t.palette.mode === 'dark' ? '0px 10px 30px rgba(0, 0, 0, 0.3)' : '0px 10px 30px rgba(124, 58, 237, 0.05)'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Estimated SaaS MRR
              </Typography>
              <Box sx={{ p: 1.2, borderRadius: '14px', backgroundColor: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
                <TrendingUp size={22} />
              </Box>
            </Box>
            {isMetricsLoading ? (
              <Skeleton animation="wave" width="60%" height={44} sx={{ borderRadius: '8px', mb: 1 }} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mb: 1 }}>
                ₹{(metrics?.samsMRR || 0).toLocaleString()}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Chip
                label="+14.2%"
                size="small"
                icon={<ArrowUpRight size={12} style={{ color: '#10B981' }} />}
                sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                vs last month
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Card 2: Active Salons */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: '24px',
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
              boxShadow: (t) => (t.palette.mode === 'dark' ? '0px 10px 30px rgba(0, 0, 0, 0.3)' : '0px 10px 30px rgba(16, 185, 129, 0.05)'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Salons
              </Typography>
              <Box sx={{ p: 1.2, borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                <Building2 size={22} />
              </Box>
            </Box>
            {isMetricsLoading || isTenantsLoading ? (
              <Skeleton animation="wave" width="40%" height={44} sx={{ borderRadius: '8px', mb: 1 }} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#10B981', mb: 1 }}>
                {metrics?.activeTenants ?? tenants.length}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {suspendedTenants.length} suspended salon(s)
            </Typography>
          </Card>
        </Grid>

        {/* Card 3: Total Salon GMV */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: '24px',
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
              boxShadow: (t) => (t.palette.mode === 'dark' ? '0px 10px 30px rgba(0, 0, 0, 0.3)' : '0px 10px 30px rgba(245, 158, 11, 0.05)'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Salon Sales (GMV)
              </Typography>
              <Box sx={{ p: 1.2, borderRadius: '14px', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}>
                <IndianRupee size={22} />
              </Box>
            </Box>
            {isMetricsLoading ? (
              <Skeleton animation="wave" width="70%" height={44} sx={{ borderRadius: '8px', mb: 1 }} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#F59E0B', mb: 1 }}>
                ₹{(metrics?.totalGMV || 0).toLocaleString()}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Processed across all tenant outlets
            </Typography>
          </Card>
        </Grid>

        {/* Card 4: Total Users */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: '24px',
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
              boxShadow: (t) => (t.palette.mode === 'dark' ? '0px 10px 30px rgba(0, 0, 0, 0.3)' : '0px 10px 30px rgba(59, 130, 246, 0.05)'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                System Users
              </Typography>
              <Box sx={{ p: 1.2, borderRadius: '14px', backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' }}>
                <Users size={22} />
              </Box>
            </Box>
            {isMetricsLoading ? (
              <Skeleton animation="wave" width="40%" height={44} sx={{ borderRadius: '8px', mb: 1 }} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mb: 1 }}>
                {metrics?.totalUsers ?? 12}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Owners, managers & stylists
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Analytics & Breakdown Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left: Plan Distribution & Revenue Streams */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: '24px',
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
              Subscription Tier Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Breakdown of registered salons by active subscription plan
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Pro Plan */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Pro Plan (₹1,499/mo)
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#7C3AED' }}>
                    70%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={70}
                  sx={{ height: 8, borderRadius: '6px', backgroundColor: 'rgba(124, 58, 237, 0.15)', '& .MuiLinearProgress-bar': { backgroundColor: '#7C3AED' } }}
                />
              </Box>

              {/* Starter Plan */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Starter Plan (₹999/mo)
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#3B82F6' }}>
                    20%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={20}
                  sx={{ height: 8, borderRadius: '6px', backgroundColor: 'rgba(59, 130, 246, 0.15)', '& .MuiLinearProgress-bar': { backgroundColor: '#3B82F6' } }}
                />
              </Box>

              {/* Enterprise / Trial */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Free Trial (14 Days)
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#F59E0B' }}>
                    10%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={10}
                  sx={{ height: 8, borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.15)', '& .MuiLinearProgress-bar': { backgroundColor: '#F59E0B' } }}
                />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right: Recent Security & Support Audits */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: '24px',
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Recent Platform Audit Logs
              </Typography>
              <Button component={Link} href="/admin/audit-logs" size="small" sx={{ fontWeight: 700, textTransform: 'none', color: '#7C3AED' }}>
                View All Logs
              </Button>
            </Box>

            {recentLogs.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No recent security logs recorded yet.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {recentLogs.map((log) => (
                  <Box
                    key={log.id}
                    sx={{
                      p: 1.8,
                      borderRadius: '14px',
                      backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC'),
                      border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #F1F5F9'),
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: '10px',
                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                          color: '#EF4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ShieldCheck size={18} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.84rem', color: 'text.primary' }}>
                          {log.action}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                          {log.reason || 'Support operations'}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                      {new Date(log.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Recent Onboarded Tenants Table */}
      <Card
        sx={{
          borderRadius: '24px',
          border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
          backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Registered Salons Directory
          </Typography>
          <Button component={Link} href="/admin/tenants" size="small" sx={{ fontWeight: 700, textTransform: 'none', color: '#7C3AED' }}>
            View Full Directory ({tenants.length})
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9') } }}>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Salon Name</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Owner Email</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Plan</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Support Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isTenantsLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Skeleton animation="wave" variant="circular" width={36} height={36} />
                        <Skeleton animation="wave" width={140} height={24} />
                      </Box>
                    </TableCell>
                    <TableCell><Skeleton animation="wave" width={180} height={24} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={80} height={24} sx={{ borderRadius: '12px' }} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={100} height={24} /></TableCell>
                    <TableCell align="right"><Skeleton animation="wave" width={110} height={32} sx={{ borderRadius: '10px', ml: 'auto' }} /></TableCell>
                  </TableRow>
                ))
              ) : recentTenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">No salons registered yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recentTenants.map((t) => (
                  <TableRow key={t.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            backgroundColor: 'rgba(124, 58, 237, 0.1)',
                            color: '#7C3AED',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.875rem',
                          }}
                        >
                          {t.name.charAt(0).toUpperCase()}
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                          {t.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ fontSize: '0.8125rem', color: 'text.primary', fontWeight: 600 }}>
                      {t.ownerEmail}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={t.status}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.65rem',
                          borderRadius: '6px',
                          backgroundColor: t.status === 'SUSPENDED' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                          color: t.status === 'SUSPENDED' ? '#EF4444' : '#10B981',
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip label={t.subscription?.planName || 'Trial'} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<ExternalLink size={14} />}
                        onClick={() => setImpersonateTarget({ id: t.id, name: t.name })}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          backgroundColor: '#7C3AED',
                          '&:hover': { backgroundColor: '#6D28D9' },
                        }}
                      >
                        Access Tenant
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Impersonation Reason Prompt Modal */}
      {impersonateTarget && (
        <ImpersonateModal
          open={!!impersonateTarget}
          onClose={() => setImpersonateTarget(null)}
          tenantId={impersonateTarget.id}
          tenantName={impersonateTarget.name}
        />
      )}
    </Box>
  );
}
