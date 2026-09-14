'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import {
  Search,
  Receipt,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  DollarSign,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import { billingApiService, InvoiceItem } from '@/services/api/billing.service';
import { QUERY_KEYS } from '@/config/query-keys';
import { TableRowSkeleton } from '@/shared/components/loaders';
import { InvoiceModal } from '@/shared/components/modals/InvoiceModal';
import { PaymentModal } from '@/shared/components/modals/PaymentModal';
import { ReceiptModal } from '@/shared/components/modals/ReceiptModal';

export default function InvoicesPage() {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  // Fetch Invoices
  const { data: invoicesList = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.billing.invoices(),
    queryFn: () => billingApiService.getInvoices(),
  });

  // Filter invoices
  const invoicesArray = Array.isArray(invoicesList) ? invoicesList : [];
  const filteredInvoices = invoicesArray.filter((inv) => {
    // Tab filter
    if (selectedTab === 1 && inv.status !== 'PENDING') return false;
    if (selectedTab === 2 && inv.status !== 'PAID') return false;
    if (selectedTab === 3 && inv.status !== 'CANCELLED') return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const custName = inv.customer?.name?.toLowerCase() || '';
      const invId = inv.id.toLowerCase();
      return custName.includes(q) || invId.includes(q);
    }

    return true;
  });

  // KPI Calculations
  const totalInvoiced = invoicesList.reduce((sum, i) => sum + Number(i.totalAmount || 0), 0);
  const totalCollected = invoicesList.reduce((sum, i) => {
    const paid = (i.payments || [])
      .filter((p) => p.status === 'COMPLETED')
      .reduce((s, p) => s + Number(p.amount), 0);
    return sum + paid;
  }, 0);
  const totalPending = Math.max(0, totalInvoiced - totalCollected);

  // Handlers
  const handleOpenInvoiceModal = (inv: InvoiceItem) => {
    setSelectedInvoice(inv);
    setIsInvoiceModalOpen(true);
  };

  const handleOpenPaymentModal = (inv: InvoiceItem) => {
    setSelectedInvoice(inv);
    setIsInvoiceModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (updatedInv: InvoiceItem) => {
    setSelectedInvoice(updatedInv);
    setIsPaymentModalOpen(false);
    setIsReceiptModalOpen(true);
  };

  const handleOpenReceiptModal = (inv: InvoiceItem) => {
    setSelectedInvoice(inv);
    setIsReceiptModalOpen(true);
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', pb: 4 }}>
          {/* Header */}
          <PageHeader
            title="Invoices & Billing"
            subtitle="View customer invoices, track owed balances, and collect payments."
          />

          {/* Top 3 KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 3.5 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{
                borderRadius: '20px',
                p: 2.5,
                border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
              }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(124, 58, 237, 0.15)' : '#F3E8FF'),
                        color: (theme) => (theme.palette.mode === 'dark' ? '#C4B5FD' : '#7C3AED'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Receipt size={24} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Total Invoiced
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        ₹{totalInvoiced.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {invoicesList.length} Invoices Generated
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{
                borderRadius: '20px',
                p: 2.5,
                border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
              }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5'),
                        color: (theme) => (theme.palette.mode === 'dark' ? '#34D399' : '#10B981'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircle2 size={24} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Collected Revenue
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: (theme) => (theme.palette.mode === 'dark' ? '#34D399' : '#10B981') }}>
                        ₹{totalCollected.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Successfully Received
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{
                borderRadius: '20px',
                p: 2.5,
                border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
              }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7'),
                        color: (theme) => (theme.palette.mode === 'dark' ? '#FBBF24' : '#D97706'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AlertCircle size={24} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Balance Owed (Pending)
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: (theme) => (theme.palette.mode === 'dark' ? '#FBBF24' : '#D97706') }}>
                        ₹{totalPending.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Awaiting Customer Payment
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Card */}
          <Card sx={{
            borderRadius: '20px',
            border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
            p: 3,
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
          }}>
            {/* Filter Tabs & Search Bar */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', md: 'center' },
                gap: 2,
                mb: 3,
              }}
            >
              <Tabs
                value={selectedTab}
                onChange={(_, val) => setSelectedTab(val)}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    minWidth: 'auto',
                    px: 2,
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <Tab label={`All (${invoicesList.length})`} />
                <Tab label={`Pending / Unpaid (${invoicesList.filter((i) => i.status === 'PENDING').length})`} />
                <Tab label={`Paid (${invoicesList.filter((i) => i.status === 'PAID').length})`} />
                <Tab label={`Cancelled (${invoicesList.filter((i) => i.status === 'CANCELLED').length})`} />
              </Tabs>

              <TextField
                size="small"
                placeholder="Search invoice or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  width: { xs: '100%', md: 280 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF'),
                  },
                }}
              />
            </Box>

            {/* Invoices Table */}
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F9FAFB') }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Invoice #</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Date</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>Items</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Total Amount</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Paid</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isLoading ? (
                    <TableRowSkeleton rows={5} columns={8} />
                  ) : filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No invoices found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const totalAmt = Number(inv.totalAmount || 0);
                      const paidAmt = (inv.payments || [])
                        .filter((p) => p.status === 'COMPLETED')
                        .reduce((s, p) => s + Number(p.amount), 0);
                      const isPaid = inv.status === 'PAID' || paidAmt >= totalAmt;
                      const shortId = inv.id.substring(0, 8).toUpperCase();
                      const dateFormatted = new Date(inv.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      });

                      return (
                        <TableRow key={inv.id} hover sx={{ '& td': { py: 1.8 } }}>
                          <TableCell sx={{ fontWeight: 800, color: (theme) => (theme.palette.mode === 'dark' ? '#C4B5FD' : '#7C3AED') }}>
                            INV-{shortId}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                              {inv.customer?.name || 'Walk-in Customer'}
                            </Typography>
                            {inv.customer?.phone && (
                              <Typography variant="caption" color="text.secondary">
                                {inv.customer.phone}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                            {dateFormatted}
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
                            {inv.items?.length || 0}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 800, color: 'text.primary' }}>
                            ₹{totalAmt.toFixed(2)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 800, color: (theme) => (theme.palette.mode === 'dark' ? '#34D399' : '#10B981') }}>
                            ₹{paidAmt.toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={isPaid ? 'PAID' : inv.status === 'CANCELLED' ? 'CANCELLED' : 'UNPAID'}
                              size="small"
                              sx={{
                                fontWeight: 800,
                                fontSize: '0.72rem',
                                backgroundColor: (theme) =>
                                  isPaid
                                    ? theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5'
                                    : inv.status === 'CANCELLED'
                                    ? theme.palette.mode === 'dark' ? 'rgba(156, 163, 175, 0.15)' : '#F3F4F6'
                                    : theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
                                color: (theme) =>
                                  isPaid
                                    ? theme.palette.mode === 'dark' ? '#34D399' : '#10B981'
                                    : inv.status === 'CANCELLED'
                                    ? theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280'
                                    : theme.palette.mode === 'dark' ? '#FBBF24' : '#D97706',
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <Tooltip title="View Formal Invoice">
                                <IconButton size="small" onClick={() => handleOpenInvoiceModal(inv)} sx={{ color: '#7C3AED' }}>
                                  <Eye size={18} />
                                </IconButton>
                              </Tooltip>

                              {!isPaid && inv.status !== 'CANCELLED' && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => handleOpenPaymentModal(inv)}
                                  startIcon={<CreditCard size={14} />}
                                  sx={{
                                    backgroundColor: '#10B981',
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    fontSize: '0.75rem',
                                    borderRadius: '8px',
                                    '&:hover': { backgroundColor: '#059669' },
                                  }}
                                >
                                  Collect Payment
                                </Button>
                              )}

                              {isPaid && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleOpenReceiptModal(inv)}
                                  startIcon={<FileText size={14} />}
                                  sx={{
                                    borderColor: '#10B981',
                                    color: '#10B981',
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    fontSize: '0.75rem',
                                    borderRadius: '8px',
                                  }}
                                >
                                  Receipt
                                </Button>
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
        </Box>

        {/* Invoice Modal */}
        <InvoiceModal
          open={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          invoice={selectedInvoice}
          onProceedToPayment={handleOpenPaymentModal}
        />

        {/* Payment Modal */}
        <PaymentModal
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          invoice={selectedInvoice}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Receipt Modal */}
        <ReceiptModal
          open={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          invoice={selectedInvoice}
        />
      </DashboardLayout>
    </AuthGuard>
  );
}
