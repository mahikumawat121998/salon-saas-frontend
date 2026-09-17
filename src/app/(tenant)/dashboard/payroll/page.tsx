'use client';

import React, { useState } from 'react';
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
import { payrollApiService, PayrollPeriod } from '@/services/api/payroll.service';
import { Banknote, Plus, Settings, Eye, RefreshCw, Layers } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import DashboardLayout from '@/layouts/DashboardLayout';

export default function PayrollDashboardPage() {
  const queryClient = useQueryClient();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [periodName, setPeriodName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [workingDaysCount, setWorkingDaysCount] = useState(26);

  // Fetch Payroll Periods
  const { data: periods = [], isLoading: isLoadingPeriods } = useQuery({
    queryKey: ['payroll-periods'],
    queryFn: () => payrollApiService.getPeriods(),
  });

  // Fetch Summary
  const { data: summary } = useQuery({
    queryKey: ['payroll-summary'],
    queryFn: () => payrollApiService.getSummary(),
  });

  // Create Period Mutation
  const createMutation = useMutation({
    mutationFn: (newPeriod: { name: string; startDate: string; endDate: string; workingDaysCount: number }) =>
      payrollApiService.createPeriod(newPeriod),
    onSuccess: () => {
      toast.success('Payroll period created and calculated!');
      setOpenCreateModal(false);
      setPeriodName('');
      setStartDate('');
      setEndDate('');
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] });
      queryClient.invalidateQueries({ queryKey: ['payroll-summary'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create payroll period');
    },
  });

  const handleCreate = () => {
    if (!periodName || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    createMutation.mutate({
      name: periodName,
      startDate,
      endDate,
      workingDaysCount: Number(workingDaysCount),
    });
  };

  const columns: GridColDef<PayrollPeriod>[] = [
    {
      field: 'serial',
      headerName: 'S.No.',
      width: 70,
      sortable: false,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1,
    },
    {
      field: 'name',
      headerName: 'Period Name',
      flex: 1.2,
      renderCell: (params) => (
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {params.row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(params.row.startDate).toLocaleDateString()} - {new Date(params.row.endDate).toLocaleDateString()}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      renderCell: (params) => {
        const statusMap: Record<string, { label: string; color: 'default' | 'primary' | 'warning' | 'success' | 'error' }> = {
          DRAFT: { label: 'Draft', color: 'default' },
          IN_REVIEW: { label: 'In Review', color: 'warning' },
          APPROVED: { label: 'Approved', color: 'primary' },
          PAID: { label: 'Paid', color: 'success' },
          CANCELLED: { label: 'Cancelled', color: 'error' },
        };
        const conf = statusMap[params.value] || { label: params.value, color: 'default' };
        return <Chip label={conf.label} color={conf.color} size="small" variant="filled" />;
      },
    },
    {
      field: 'workingDaysCount',
      headerName: 'Working Days',
      flex: 0.8,
      renderCell: (params) => `${params.value} Days`,
    },
    {
      field: 'totalGrossPay',
      headerName: 'Gross Pay',
      flex: 1,
      renderCell: (params) => `₹${Number(params.value).toLocaleString('en-IN')}`,
    },
    {
      field: 'totalDeductions',
      headerName: 'Deductions',
      flex: 1,
      renderCell: (params) => `₹${Number(params.value).toLocaleString('en-IN')}`,
    },
    {
      field: 'totalNetPay',
      headerName: 'Net Payout',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} color="success.main">
          ₹{Number(params.value).toLocaleString('en-IN')}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Button
          component={Link}
          href={`/dashboard/payroll/periods/${params.row.id}`}
          variant="outlined"
          size="small"
          startIcon={<Eye size={14} />}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
            Payroll Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Process staff salaries, attendance-based deductions, overtime, and tiered service/product commissions.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            component={Link}
            href="/dashboard/payroll/configurations"
            variant="outlined"
            startIcon={<Settings size={18} />}
          >
            Salary Setup
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => setOpenCreateModal(true)}
            sx={{ bgcolor: 'primary.main' }}
          >
            New Payroll Run
          </Button>
        </Stack>
      </Stack>

      {/* Analytics KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Disbursed Pay
                  </Typography>
                  <Typography variant="h5" color="success.main" sx={{ fontWeight: 700, mt: 0.5 }}>
                    ₹{(summary?.totals?.netPay || 0).toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'success.light', borderRadius: 2, color: 'success.main', opacity: 0.8 }}>
                  <Banknote size={24} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Service Commissions
                  </Typography>
                  <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700, mt: 0.5 }}>
                    ₹{(summary?.totals?.serviceCommission || 0).toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: 2, color: 'primary.main', opacity: 0.8 }}>
                  <Layers size={24} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Deductions
                  </Typography>
                  <Typography variant="h5" color="warning.main" sx={{ fontWeight: 700, mt: 0.5 }}>
                    ₹{(summary?.totals?.totalDeductions || 0).toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'warning.light', borderRadius: 2, color: 'warning.main', opacity: 0.8 }}>
                  <RefreshCw size={24} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Payroll Runs
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                    {summary?.totalPeriods || periods.length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Banknote size={24} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Datagrid Table */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Payroll Periods History
            </Typography>
          </Box>
          <DataGrid
            rows={periods}
            columns={columns}
            loading={isLoadingPeriods}
            autoHeight
            pageSizeOptions={[10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
            sx={{ border: 'none' }}
          />
        </CardContent>
      </Card>

      {/* Create Period Modal */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Payroll Run</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Payroll Period Name"
              placeholder="e.g. Payroll - October 2026"
              fullWidth
              value={periodName}
              onChange={(e) => setPeriodName(e.target.value)}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Grid>
            </Grid>
            <TextField
              label="Total Working Days in Month"
              type="number"
              fullWidth
              value={workingDaysCount}
              onChange={(e) => setWorkingDaysCount(Number(e.target.value))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Calculating...' : 'Create & Calculate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </DashboardLayout>
  );
}
