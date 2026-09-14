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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {
  CreditCard,
  Search,
  RefreshCw,
  IndianRupee,
  TrendingUp,
  FileText,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApiService } from '@/services/api/admin.service';
import { QUERY_KEYS } from '@/config/query-keys';

export default function SuperAdminBillingPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Fetch Platform Revenue Data
  const { data, isLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.admin.revenue({ search, status: statusFilter }),
    queryFn: () => adminApiService.getPlatformRevenue(search, statusFilter),
  });

  const invoices = data?.invoices || [];
  const planBreakdown = data?.planRevenueBreakdown || [];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Platform Billing & Payments Control
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Monitor SaaS subscription revenue, salon invoice volume, and multi-tenant payment transactions
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
              TOTAL SALON GMV PROCESSED
            </Typography>
            {isLoading ? (
              <Skeleton animation="wave" width={120} height={44} sx={{ mt: 0.5, borderRadius: '8px' }} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#10B981', mt: 0.5 }}>
                ₹{(data?.totalGMV || 0).toLocaleString('en-IN')}
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
                ₹{(data?.saasMRR || 0).toLocaleString('en-IN')}
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
              TOTAL INVOICES GENERATED
            </Typography>
            {isLoading ? (
              <Skeleton animation="wave" width={60} height={44} sx={{ mt: 0.5, borderRadius: '8px' }} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mt: 0.5 }}>
                {data?.totalInvoicesCount || 0}
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
              ACTIVE SALONS RATIO
            </Typography>
            {isLoading ? (
              <Skeleton animation="wave" width={80} height={44} sx={{ mt: 0.5, borderRadius: '8px' }} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#3B82F6', mt: 0.5 }}>
                {data?.activeTenants || 0} / {data?.totalTenants || 0}
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Plan Revenue Breakdown Cards */}
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
        SaaS Subscription Tier MRR Distribution
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {isLoading ? (
          [1, 2, 3].map((key) => (
            <Grid size={{ xs: 12, md: 4 }} key={key}>
              <Card
                sx={{
                  p: 2.5,
                  borderRadius: '18px',
                  border: (t) => `1px solid ${t.palette.divider}`,
                  backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
                }}
              >
                <Skeleton animation="wave" width="70%" height={24} sx={{ mb: 1 }} />
                <Skeleton animation="wave" width="50%" height={36} sx={{ mb: 1 }} />
                <Skeleton animation="wave" width="40%" height={16} />
              </Card>
            </Grid>
          ))
        ) : (
          planBreakdown.map((p: any) => (
            <Grid size={{ xs: 12, md: 4 }} key={p.id}>
              <Card
                sx={{
                  p: 2.5,
                  borderRadius: '18px',
                  border: (t) => `1px solid ${t.palette.divider}`,
                  backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {p.name} ({p.code})
                  </Typography>
                  <Chip
                    label={`${p.subscribersCount} Subscribed`}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.62rem',
                      backgroundColor: 'rgba(124, 58, 237, 0.15)',
                      color: '#A78BFA',
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#7C3AED' }}>
                  ₹{p.totalMRR.toLocaleString('en-IN')}
                  <Typography component="span" variant="caption" color="text.secondary">
                    /month
                  </Typography>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Price: ₹{p.monthlyPrice}/mo per salon
                </Typography>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Transactions & Invoices Table */}
      <Card
        sx={{
          borderRadius: '24px',
          border: (t) => `1px solid ${t.palette.divider}`,
          backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
          boxShadow: '0px 20px 40px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Filters */}
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search by Invoice # or Salon Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 320 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#9CA3AF" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 160, borderRadius: '10px' }}
          >
            <MenuItem value="all">All Payment Statuses</MenuItem>
            <MenuItem value="PAID">PAID</MenuItem>
            <MenuItem value="PENDING">PENDING</MenuItem>
          </Select>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: (t) => (t.palette.mode === 'dark' ? '#0B0F17' : '#FAFAFC') }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }}>INVOICE #</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }}>SALON TENANT</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }}>CLIENT / BUYER</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }}>AMOUNT</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }}>METHOD</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }}>DATE</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton animation="wave" width={90} height={20} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={140} height={20} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={160} height={20} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={80} height={20} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={70} height={24} sx={{ borderRadius: '6px' }} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={60} height={24} sx={{ borderRadius: '12px' }} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={90} height={20} /></TableCell>
                    <TableCell align="right"><Skeleton animation="wave" width={32} height={32} sx={{ borderRadius: '8px', ml: 'auto' }} /></TableCell>
                  </TableRow>
                ))
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No payment invoices found matching search filters.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((inv: any) => {
                  const isPaid = inv.status === 'PAID';

                  return (
                    <TableRow key={inv.id} hover>
                      <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 800, color: 'text.primary' }}>
                        {inv.invoiceNumber}
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.85rem', fontWeight: 800 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Building2 size={16} color="#7C3AED" />
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>
                            {inv.tenantName}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.8125rem' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {inv.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {inv.customerEmail}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.9rem', fontWeight: 900, color: '#10B981' }}>
                        ₹{inv.totalAmount.toLocaleString('en-IN')}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={inv.paymentMethod}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 700, fontSize: '0.65rem', borderRadius: '6px' }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={inv.status}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            borderRadius: '6px',
                            backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                            color: isPaid ? '#10B981' : '#F59E0B',
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.78125rem', color: 'text.secondary' }}>
                        {new Date(inv.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="View Receipt Breakdown">
                          <IconButton size="small" onClick={() => setSelectedInvoice(inv)}>
                            <Eye size={18} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <Dialog
          open={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          maxWidth="xs"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: '20px',
                p: 1.5,
                backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
              },
            },
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Payment Receipt
            </Typography>
            <IconButton onClick={() => setSelectedInvoice(null)} size="small">
              <X size={18} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, py: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Invoice No:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {selectedInvoice.invoiceNumber}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Salon Tenant:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {selectedInvoice.tenantName}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Customer:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {selectedInvoice.customerName}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {selectedInvoice.paymentMethod}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: (t) => `1px solid ${t.palette.divider}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  Total Amount Paid:
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#10B981' }}>
                  ₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setSelectedInvoice(null)} fullWidth variant="contained" sx={{ borderRadius: '10px' }}>
              Close Receipt
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
