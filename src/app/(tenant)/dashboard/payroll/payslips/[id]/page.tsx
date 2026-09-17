'use client';

export const runtime = 'edge';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollApiService } from '@/services/api/payroll.service';
import { ArrowLeft, CheckCircle2, DollarSign, Printer } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import DashboardLayout from '@/layouts/DashboardLayout';

export default function PayslipDetailPage() {
  const params = useParams();
  const payslipId = params.id as string;
  const queryClient = useQueryClient();

  const [openDisburseModal, setOpenDisburseModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState<any>('BANK_TRANSFER');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Fetch Payslip Detail via Period
  const { data: period, isLoading } = useQuery({
    queryKey: ['payslip-detail', payslipId],
    queryFn: async () => {
      const periods = await payrollApiService.getPeriods();
      for (const p of periods) {
        const fullPeriod = await payrollApiService.getPeriodById(p.id);
        const match = fullPeriod.payslips?.find((ps) => ps.id === payslipId);
        if (match) {
          return { period: fullPeriod, payslip: match };
        }
      }
      return null;
    },
  });

  const disburseMutation = useMutation({
    mutationFn: (data: { paymentMode: string; paymentReference?: string; paymentNotes?: string }) =>
      payrollApiService.disbursePayslip(payslipId, data),
    onSuccess: () => {
      toast.success('Payslip marked as paid!');
      setOpenDisburseModal(false);
      queryClient.invalidateQueries({ queryKey: ['payslip-detail', payslipId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to disburse payslip');
    },
  });

  const handleDisburse = () => {
    disburseMutation.mutate({
      paymentMode,
      paymentReference,
      paymentNotes,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const payslip = period?.payslip;
  const earnings = payslip?.items?.filter((i) => i.type === 'EARNING') || [];
  const deductions = payslip?.items?.filter((i) => i.type === 'DEDUCTION') || [];

  return (
    <DashboardLayout>
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Controls Header */}
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }} className="no-print">
        <Button component={Link} href="/dashboard/payroll" startIcon={<ArrowLeft size={16} />}>
          Back to Payroll
        </Button>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<Printer size={16} />} onClick={handlePrint}>
            Print / Export PDF
          </Button>
          {payslip?.status !== 'PAID' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<DollarSign size={16} />}
              onClick={() => setOpenDisburseModal(true)}
            >
              Record Payment
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Printable Payslip Container */}
      <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }} className="printable-area">
        {/* Header Branding */}
        <Grid container spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
          <Grid size={{ xs: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }} color="primary.main">
              GLAMOUR HAVEN SALON
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Official Employee Payslip
            </Typography>
          </Grid>
          <Grid size={{ xs: 4 }} sx={{ textAlign: 'right' }}>
            <Chip
              label={payslip?.status || 'DRAFT'}
              color={payslip?.status === 'PAID' ? 'success' : 'primary'}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Employee & Period Details */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" color="text.secondary">
              EMPLOYEE DETAILS
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {payslip?.staff?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pay Type: {payslip?.payStructureType}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              PAYROLL PERIOD
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {period?.period?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Present Days: {payslip?.presentDays} / {payslip?.totalWorkingDays}
            </Typography>
          </Grid>
        </Grid>

        {/* Breakdown Table */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Earnings */}
          <Grid size={{ xs: 6 }}>
            <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 700, mb: 1 }}>
              EARNINGS
            </Typography>
            <TableContainer component={Paper} variant="outlined" elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Component</TableCell>
                    <TableCell align="right">Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {earnings.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">₹{Number(item.amount).toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Total Earnings</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>
                      ₹{Number(payslip?.grossPay || 0).toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Deductions */}
          <Grid size={{ xs: 6 }}>
            <Typography variant="subtitle2" color="error.main" sx={{ fontWeight: 700, mb: 1 }}>
              DEDUCTIONS
            </Typography>
            <TableContainer component={Paper} variant="outlined" elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Component</TableCell>
                    <TableCell align="right">Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deductions.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">₹{Number(item.amount).toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Total Deductions</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'error.main' }}>
                      ₹{Number(payslip?.totalDeductions || 0).toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* Net Pay Banner */}
        <Box sx={{ p: 3, bgcolor: 'success.light', borderRadius: 3, opacity: 0.9 }}>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle2" color="success.contrastText">
                NET PAYOUT AMOUNT
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }} color="success.contrastText">
                ₹{Number(payslip?.netPay || 0).toLocaleString('en-IN')}
              </Typography>
            </Box>
            {payslip?.paymentMode && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="success.contrastText">
                  Paid via {payslip.paymentMode}
                </Typography>
                {payslip.paymentReference && (
                  <Typography variant="body2" color="success.contrastText">
                    Ref: {payslip.paymentReference}
                  </Typography>
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Disburse Modal */}
      <Dialog open={openDisburseModal} onClose={() => setOpenDisburseModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Record Payment for {payslip?.staff?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Payment Mode</InputLabel>
              <Select
                value={paymentMode}
                label="Payment Mode"
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="CHEQUE">Cheque</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Transaction Reference #"
              placeholder="e.g. UTR / Cheque / Txn ID"
              fullWidth
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
            />
            <TextField
              label="Notes"
              placeholder="e.g. Disbursed via Salary Account"
              fullWidth
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDisburseModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleDisburse}
            disabled={disburseMutation.isPending}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </DashboardLayout>
  );
}
