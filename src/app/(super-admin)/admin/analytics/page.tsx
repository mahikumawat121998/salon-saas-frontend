'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Tabs from '@mui/material/Tabs';

import Tab from '@mui/material/Tab';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Building2,
  Zap,
  Award,
  RefreshCw,
  ArrowUpRight,
  UserCheck,
  Scissors,
  CheckCircle2,
  XCircle,
  Clock,
  PieChart,
  BarChart2,
} from 'lucide-react';
import { adminApiService } from '@/services/api/admin.service';
import { showToast } from '@/shared/components/Toast';

interface AnalyticsData {
  range: string;
  metrics: {
    totalTenants: number;
    activeTenants: number;
    suspendedTenants: number;
    totalUsers: number;
    totalAppointments: number;
    totalCustomers: number;
    totalStaff: number;
    totalOutlets: number;
    totalServices: number;
    totalGMV: number;
    saasMRR: number;
    saasARR: number;
    arpu: number;
    totalInvoicesCount: number;
    avgInvoiceValue: number;
  };
  planDistribution: Array<{
    id: string;
    name: string;
    code: string;
    monthlyPrice: number;
    count: number;
    sharePercentage: number;
    mrr: number;
  }>;
  appointmentsBreakdown: Array<{
    status: string;
    count: number;
  }>;
  monthlyRevenueTrend: Array<{
    month: string;
    gmv: number;
    saasMRR: number;
    newTenants: number;
  }>;
  leaderboards: {
    topSalonsByRevenue: Array<{
      id: string;
      name: string;
      status: string;
      planName: string;
      gmv: number;
      appointmentsCount: number;
      customersCount: number;
      staffCount: number;
      invoicesCount: number;
    }>;
    topSalonsByAppointments: Array<{
      id: string;
      name: string;
      status: string;
      planName: string;
      gmv: number;
      appointmentsCount: number;
      customersCount: number;
      staffCount: number;
    }>;
    topSalonsByCustomers: Array<{
      id: string;
      name: string;
      status: string;
      planName: string;
      gmv: number;
      appointmentsCount: number;
      customersCount: number;
      staffCount: number;
    }>;
  };
}

export default function SuperAdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30d');
  const [activeTab, setActiveTab] = useState(0);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const result = await adminApiService.getAnalytics(range);
      setData(result);
    } catch (err: any) {
      showToast.error('Failed to load analytics', err.message || 'Error fetching analytics data');
    } finally {
      setLoading(false);
    }
  }, [range]);


  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const metrics = data?.metrics || {
    totalTenants: 0,
    activeTenants: 0,
    suspendedTenants: 0,
    totalUsers: 0,
    totalAppointments: 0,
    totalCustomers: 0,
    totalStaff: 0,
    totalOutlets: 0,
    totalServices: 0,
    totalGMV: 0,
    saasMRR: 0,
    saasARR: 0,
    arpu: 0,
    totalInvoicesCount: 0,
    avgInvoiceValue: 0,
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header Bar */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 4, gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
              }}
            >
              <TrendingUp size={22} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
              Platform Analytics & Intelligence
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            System-wide real-time metrics, revenue performance, tenant leaderboards, and usage distribution
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              sx={{
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.875rem',
                backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
              }}
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="1y">Last 1 Year</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={fetchAnalytics}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshCw size={16} />}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              px: 2,
              py: 1,
              borderColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#E2E8F0'),
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Top SaaS Financial KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: '16px',
              background: (t) =>
                t.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(21, 30, 46, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, #FFFFFF 100%)',
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid rgba(124, 58, 237, 0.15)'),
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#7C3AED', letterSpacing: 0.5 }}>
                  SaaS MRR
                </Typography>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', backgroundColor: 'rgba(124, 58, 237, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}>
                  <Zap size={18} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width="70%" height={44} animation="wave" />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', mb: 0.5 }}>
                  {formatCurrency(metrics.saasMRR)}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowUpRight size={14} color="#10B981" />
                <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>
                  Active Monthly Subscriptions
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: '16px',
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: 0.5 }}>
                  Annual Run Rate (ARR)
                </Typography>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                  <DollarSign size={18} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width="70%" height={44} animation="wave" />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', mb: 0.5 }}>
                  {formatCurrency(metrics.saasARR)}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Projected Annual SaaS Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: '16px',
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: 0.5 }}>
                  Total Salon GMV
                </Typography>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                  <BarChart2 size={18} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width="70%" height={44} animation="wave" />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', mb: 0.5 }}>
                  {formatCurrency(metrics.totalGMV)}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Processed Salon Billings Across Tenants
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: '16px',
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
              border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: 0.5 }}>
                  Average ARPU
                </Typography>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                  <Award size={18} />
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="text" width="70%" height={44} animation="wave" />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', mb: 0.5 }}>
                  {formatCurrency(metrics.arpu)}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Average SaaS Rev / Active Salon
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      {/* Operational System Volumes */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box sx={{ p: 2, borderRadius: '14px', backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'), border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'), display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}>
              <Calendar size={22} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Total Appointments</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>{metrics.totalAppointments.toLocaleString()}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box sx={{ p: 2, borderRadius: '14px', backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'), border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'), display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <Users size={22} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Total Clients Served</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>{metrics.totalCustomers.toLocaleString()}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box sx={{ p: 2, borderRadius: '14px', backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'), border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'), display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
              <Scissors size={22} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Active Stylists & Staff</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>{metrics.totalStaff.toLocaleString()}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box sx={{ p: 2, borderRadius: '14px', backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'), border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0'), display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' }}>
              <Building2 size={22} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Total Salon Tenants</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>{metrics.totalTenants} ({metrics.activeTenants} Active)</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.9375rem' } }}>
          <Tab icon={<TrendingUp size={18} />} iconPosition="start" label="Revenue & Growth Trends" />
          <Tab icon={<PieChart size={18} />} iconPosition="start" label="Plans & Subscriptions Share" />
          <Tab icon={<Award size={18} />} iconPosition="start" label="Top Salons Leaderboard" />
        </Tabs>
      </Box>

      {/* Tab 0: Revenue & Growth Trends */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ borderRadius: '16px', backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'), border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'), p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                Monthly Revenue & SaaS MRR Progression
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Historical performance tracking across platform subscription charges and cumulative salon billing GMV
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {(data?.monthlyRevenueTrend || []).map((item) => (
                  <Box key={item.month}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{item.month}</Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography variant="caption" sx={{ color: '#7C3AED', fontWeight: 700 }}>
                          SaaS MRR: {formatCurrency(item.saasMRR)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#3B82F6', fontWeight: 700 }}>
                          GMV: {formatCurrency(item.gmv)}
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (item.gmv / (metrics.totalGMV || 1)) * 100 * 3)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9'),
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #7C3AED 0%, #3B82F6 100%)',
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ borderRadius: '16px', backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'), border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'), p: 3, h: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                Invoice & Billing Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Key transaction metrics system-wide
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ p: 2, borderRadius: '12px', backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC') }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Invoices Count</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', mt: 0.5 }}>
                    {metrics.totalInvoicesCount} Invoices
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: '12px', backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC') }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Average Invoice Value</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#10B981', mt: 0.5 }}>
                    {formatCurrency(metrics.avgInvoiceValue)}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: '12px', backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC') }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Active vs Suspended Salons</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip icon={<UserCheck size={14} />} label={`${metrics.activeTenants} Active`} color="success" size="small" />
                    <Chip icon={<XCircle size={14} />} label={`${metrics.suspendedTenants} Suspended`} color="error" size="small" />
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Plans & Subscriptions Share */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {(data?.planDistribution || []).map((plan) => (
            <Grid key={plan.id} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: '16px',
                  backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
                  border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
                  p: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>{plan.name}</Typography>
                    <Chip label={plan.code} size="small" sx={{ fontSize: '0.65rem', fontWeight: 800, mt: 0.5 }} color="secondary" />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#7C3AED' }}>
                    ₹{plan.monthlyPrice}<Typography component="span" variant="caption" color="text.secondary">/mo</Typography>
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Subscribers Share</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>{plan.count} Salons ({plan.sharePercentage}%)</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={plan.sharePercentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(124, 58, 237, 0.1)',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#7C3AED' },
                    }}
                  />
                </Box>

                <Box sx={{ pt: 2, borderTop: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9'), display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total MRR Contribution:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: '#10B981' }}>
                    {formatCurrency(plan.mrr)}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Tab 2: Top Salons Leaderboards */}
      {activeTab === 2 && (
        <Card sx={{ borderRadius: '16px', backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'), border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'), overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0') }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Top Performing Salon Tenants</Typography>
            <Typography variant="body2" color="text.secondary">Ranked by total revenue volume (GMV) generated on the SAMs platform</Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC') }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Salon Tenant Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Plan Tier</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Total GMV</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Appointments</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Clients Base</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Staff Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.leaderboards?.topSalonsByRevenue || []).map((tenant, index) => (
                  <TableRow key={tenant.id} hover>
                    <TableCell>
                      <Box sx={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: index === 0 ? '#F59E0B' : index === 1 ? '#94A3B8' : index === 2 ? '#B45309' : 'transparent', color: index < 3 ? '#FFFFFF' : 'text.primary', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8125rem' }}>
                        #{index + 1}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>{tenant.name}</Typography>
                      <Chip label={tenant.status} size="small" color={tenant.status === 'ACTIVE' ? 'success' : 'error'} sx={{ height: 16, fontSize: '0.6rem', fontWeight: 800, mt: 0.2 }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={tenant.planName} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#10B981' }}>
                      {formatCurrency(tenant.gmv)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {tenant.appointmentsCount}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {tenant.customersCount}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {tenant.staffCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
}
