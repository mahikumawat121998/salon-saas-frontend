'use client';

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
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollApiService, Payslip } from '@/services/api/payroll.service';
import { ArrowLeft, CheckCircle2, DollarSign, Edit3, Eye, RefreshCw, Send } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import DashboardLayout from '@/layouts/DashboardLayout';

export default function PayrollPeriodWorksheetPage() {
  const params = useParams();
  const periodId = params.id as string;
  const queryClient = useQueryClient();

  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [openAdjustModal, setOpenAdjustModal] = useState(false);

  // Adjustment fields
  const [bonusAmount, setBonusAmount] = useState<number>(0);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [unpaidLeaveDays, setUnpaidLeaveDays] = useState<number>(0);
  const [manualDeduction, setManualDeduction] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');

  // Fetch Period
  const { data: period, isLoading } = useQuery({
    queryKey: ['payroll-period', periodId],
    queryFn: () => payrollApiService.getPeriodById(periodId),
  });

  // Recalculate Mutation
  const recalculateMutation = useMutation({
    mutationFn: () => payrollApiService.calculatePeriod(periodId),
    onSuccess: () => {
      toast.success('Payroll recalculated successfully!');
      queryClient.invalidateQueries({ queryKey: ['payroll-period', periodId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to recalculate');
    },
  });

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => payrollApiService.updatePeriodStatus(periodId, status),
    onSuccess: (_, status) => {
      toast.success(`Payroll period status updated to ${status}!`);
      queryClient.invalidateQueries({ queryKey: ['payroll-period', periodId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
  });

  // Adjust Payslip Mutation
  const adjustMutation = useMutation({
    mutationFn: (data: { id: string; adjustment: any }) =>
      payrollApiService.adjustPayslip(data.id, data.adjustment),
    onSuccess: () => {
      toast.success('Payslip adjusted successfully!');
      setOpenAdjustModal(false);
      queryClient.invalidateQueries({ queryKey: ['payroll-period', periodId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to adjust payslip');
    },
  });

  const handleOpenAdjust = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setBonusAmount(Number(payslip.bonusAmount || 0));
    setOvertimeHours(Number(payslip.overtimeHours || 0));
    setUnpaidLeaveDays(Number(payslip.unpaidLeaveDays || 0));
    setManualDeduction(0);
    setAdjustmentReason('');
    setOpenAdjustModal(true);
  };

  const handleSaveAdjustment = () => {
    if (!selectedPayslip) return;
    adjustMutation.mutate({
      id: selectedPayslip.id,
      adjustment: {
        bonusAmount: Number(bonusAmount),
        overtimeHours: Number(overtimeHours),
        unpaidLeaveDays: Number(unpaidLeaveDays),
        manualDeduction: Number(manualDeduction),
        adjustmentReason,
      },
    });
  };

  const columns: GridColDef<Payslip>[] = [
    {
      field: 'staff',
      headerName: 'Staff Member',
      flex: 1.2,
      valueGetter: (params: any) => params?.name || 'Unknown',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {params.row.staff?.name || 'Unknown'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'payStructureType',
      headerName: 'Pay Type',
      flex: 0.9,
      renderCell: (params) => <Chip label={params.value} size="small" variant="outlined" />,
    },
    {
      field: 'baseEarned',
      headerName: 'Base Pay',
      flex: 0.9,
      renderCell: (params) => `₹${Number(params.value).toLocaleString('en-IN')}`,
    },
    {
      field: 'serviceCommission',
      headerName: 'Commission',
      flex: 0.9,
      renderCell: (params) => `₹${(Number(params.row.serviceCommission) + Number(params.row.productCommission)).toLocaleString('en-IN')}`,
    },
    {
      field: 'allowancesTotal',
      headerName: 'Allowances / Bonus',
      flex: 1,
      renderCell: (params) => `₹${(Number(params.row.allowancesTotal) + Number(params.row.bonusAmount)).toLocaleString('en-IN')}`,
    },
    {
      field: 'leaveDeduction',
      headerName: 'Deductions',
      flex: 0.9,
      renderCell: (params) => `₹${Number(params.row.totalDeductions).toLocaleString('en-IN')}`,
    },
    {
      field: 'netPay',
      headerName: 'Net Pay',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} color="success.main">
          ₹{Number(params.value).toLocaleString('en-IN')}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      renderCell: (params) => {
        const statusMap: Record<string, { label: string; color: 'default' | 'primary' | 'success' | 'warning' }> = {
          DRAFT: { label: 'Draft', color: 'default' },
          APPROVED: { label: 'Approved', color: 'primary' },
          PAID: { label: 'Paid', color: 'success' },
        };
        const conf = statusMap[params.value] || { label: params.value, color: 'default' };
        return <Chip label={conf.label} color={conf.color} size="small" />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {period?.status !== 'PAID' && period?.status !== 'APPROVED' && (
            <IconButton size="small" onClick={() => handleOpenAdjust(params.row)} title="Adjust Bonus / Attendance">
              <Edit3 size={16} />
            </IconButton>
          )}
          <Button
            component={Link}
            href={`/dashboard/payroll/payslips/${params.row.id}`}
            size="small"
            startIcon={<Eye size={14} />}
          >
            Payslip
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <DashboardLayout>
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Navigation Header */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
        <IconButton component={Link} href="/dashboard/payroll" size="small">
          <ArrowLeft size={20} />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {period?.name || 'Payroll Run'}
            </Typography>
            <Chip
              label={period?.status || 'DRAFT'}
              color={period?.status === 'PAID' ? 'success' : period?.status === 'APPROVED' ? 'primary' : 'warning'}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Period: {period ? `${new Date(period.startDate).toLocaleDateString()} - ${new Date(period.endDate).toLocaleDateString()}` : ''} | Working Days: {period?.workingDaysCount}
          </Typography>
        </Box>

        {/* State Machine Action Controls */}
        <Stack direction="row" spacing={2}>
          {period?.status === 'DRAFT' && (
            <>
              <Button
                variant="outlined"
                startIcon={<RefreshCw size={16} />}
                onClick={() => recalculateMutation.mutate()}
                disabled={recalculateMutation.isPending}
              >
                Recalculate
              </Button>
              <Button
                variant="contained"
                startIcon={<Send size={16} />}
                onClick={() => updateStatusMutation.mutate('IN_REVIEW')}
              >
                Submit Review
              </Button>
            </>
          )}

          {period?.status === 'IN_REVIEW' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircle2 size={16} />}
              onClick={() => updateStatusMutation.mutate('APPROVED')}
            >
              Approve Payroll Run
            </Button>
          )}

          {period?.status === 'APPROVED' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<DollarSign size={16} />}
              onClick={() => updateStatusMutation.mutate('PAID')}
            >
              Mark All as Paid
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Summary KPI Totals */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total Gross Pay
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                ₹{Number(period?.totalGrossPay || 0).toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total Deductions
              </Typography>
              <Typography variant="h5" color="warning.main" sx={{ fontWeight: 700, mt: 0.5 }}>
                ₹{Number(period?.totalDeductions || 0).toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total Net Payout
              </Typography>
              <Typography variant="h5" color="success.main" sx={{ fontWeight: 700, mt: 0.5 }}>
                ₹{Number(period?.totalNetPay || 0).toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Staff Payslips Worksheet */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={period?.payslips || []}
            columns={columns}
            loading={isLoading}
            autoHeight
            pageSizeOptions={[10, 20]}
            disableRowSelectionOnClick
            sx={{ border: 'none' }}
          />
        </CardContent>
      </Card>

      {/* Adjust Payslip Modal */}
      <Dialog open={openAdjustModal} onClose={() => setOpenAdjustModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Adjust Payslip: {selectedPayslip?.staff?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Performance Bonus (₹)"
              type="number"
              fullWidth
              value={bonusAmount}
              onChange={(e) => setBonusAmount(Number(e.target.value))}
            />
            <TextField
              label="Overtime Hours"
              type="number"
              fullWidth
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(Number(e.target.value))}
            />
            <TextField
              label="Unpaid Leave Days"
              type="number"
              fullWidth
              value={unpaidLeaveDays}
              onChange={(e) => setUnpaidLeaveDays(Number(e.target.value))}
            />
            <TextField
              label="Manual Deduction (₹)"
              type="number"
              fullWidth
              value={manualDeduction}
              onChange={(e) => setManualDeduction(Number(e.target.value))}
            />
            <TextField
              label="Adjustment Reason"
              placeholder="e.g. Festival bonus / damage penalty"
              fullWidth
              value={adjustmentReason}
              onChange={(e) => setAdjustmentReason(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenAdjustModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveAdjustment}
            disabled={adjustMutation.isPending}
          >
            Save Adjustment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </DashboardLayout>
  );
}
