'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollApiService, StaffSalaryConfigResponse } from '@/services/api/payroll.service';
import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import DashboardLayout from '@/layouts/DashboardLayout';

export default function SalaryConfigurationsPage() {
  const queryClient = useQueryClient();
  const [selectedStaff, setSelectedStaff] = useState<StaffSalaryConfigResponse | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Form State
  const [payStructureType, setPayStructureType] = useState<any>('MONTHLY');
  const [baseSalary, setBaseSalary] = useState<number>(0);
  const [dailyRate, setDailyRate] = useState<number>(0);
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [overtimeRatePerHour, setOvertimeRatePerHour] = useState<number>(0);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<number>(1.5);
  const [components, setComponents] = useState<any[]>([]);
  const [commissionRules, setCommissionRules] = useState<any[]>([]);

  // Fetch Staff Salary Configurations
  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['staff-salary-configs'],
    queryFn: () => payrollApiService.getStaffConfigs(),
  });

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: (data: { staffId: string; config: any }) =>
      payrollApiService.updateSalaryConfig(data.staffId, data.config),
    onSuccess: () => {
      toast.success('Salary configuration saved successfully!');
      setOpenDrawer(false);
      queryClient.invalidateQueries({ queryKey: ['staff-salary-configs'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save salary configuration');
    },
  });

  const handleEditClick = (row: StaffSalaryConfigResponse) => {
    setSelectedStaff(row);
    const conf = row.salaryConfig;
    setPayStructureType(conf?.payStructureType || 'MONTHLY');
    setBaseSalary(Number(conf?.baseSalary || 0));
    setDailyRate(Number(conf?.dailyRate || 0));
    setHourlyRate(Number(conf?.hourlyRate || 0));
    setOvertimeRatePerHour(Number(conf?.overtimeRatePerHour || 0));
    setOvertimeMultiplier(Number(conf?.overtimeMultiplier || 1.5));
    setComponents(conf?.components || []);
    setCommissionRules(conf?.commissionRules || []);
    setOpenDrawer(true);
  };

  const handleSave = () => {
    if (!selectedStaff) return;
    saveMutation.mutate({
      staffId: selectedStaff.staffId,
      config: {
        staffId: selectedStaff.staffId,
        payStructureType,
        baseSalary: Number(baseSalary),
        dailyRate: Number(dailyRate),
        hourlyRate: Number(hourlyRate),
        overtimeRatePerHour: Number(overtimeRatePerHour),
        overtimeMultiplier: Number(overtimeMultiplier),
        components,
        commissionRules,
      },
    });
  };

  const handleAddComponent = () => {
    setComponents([
      ...components,
      { name: 'HRA', type: 'EARNING', calculationType: 'FIXED_AMOUNT', value: 2000, isTaxable: true },
    ]);
  };

  const handleRemoveComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const columns: GridColDef<StaffSalaryConfigResponse>[] = [
    {
      field: 'staffName',
      headerName: 'Staff Name',
      flex: 1.2,
      renderCell: (params) => (
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {params.row.staffName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.phone || 'No phone'}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'payStructureType',
      headerName: 'Pay Structure',
      flex: 1,
      renderCell: (params) => {
        const type = params.row.salaryConfig?.payStructureType || 'NOT_CONFIGURED';
        const labelMap: Record<string, string> = {
          MONTHLY: 'Monthly Base',
          DAILY: 'Daily Rate',
          HOURLY: 'Hourly Rate',
          FIXED_AND_COMMISSION: 'Fixed + Commission',
          COMMISSION_ONLY: 'Commission Only',
          NOT_CONFIGURED: 'Not Set',
        };
        return <Chip label={labelMap[type]} size="small" variant="outlined" color={type === 'NOT_CONFIGURED' ? 'default' : 'primary'} />;
      },
    },
    {
      field: 'baseSalary',
      headerName: 'Base Rate / Salary',
      flex: 1,
      renderCell: (params) => {
        const conf = params.row.salaryConfig;
        if (!conf) return '₹0';
        if (conf.payStructureType === 'DAILY') return `₹${conf.dailyRate}/day`;
        if (conf.payStructureType === 'HOURLY') return `₹${conf.hourlyRate}/hr`;
        return `₹${Number(conf.baseSalary).toLocaleString('en-IN')}/mo`;
      },
    },
    {
      field: 'components',
      headerName: 'Allowances / Deductions',
      flex: 1,
      renderCell: (params) => `${params.row.salaryConfig?.components?.length || 0} Components`,
    },
    {
      field: 'commissionRules',
      headerName: 'Commission Rules',
      flex: 1,
      renderCell: (params) => `${params.row.salaryConfig?.commissionRules?.length || 0} Rules`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Edit size={14} />}
          onClick={() => handleEditClick(params.row)}
        >
          Configure
        </Button>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 4 }}>
        <IconButton component={Link} href="/dashboard/payroll" size="small">
          <ArrowLeft size={20} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Staff Salary Configurations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure monthly base pay, daily rates, hourly wages, custom components, and tiered commissions per employee.
          </Typography>
        </Box>
      </Stack>

      {/* Configurations Table */}
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={configs}
            getRowId={(row) => row.staffId}
            columns={columns}
            loading={isLoading}
            autoHeight
            pageSizeOptions={[10, 20]}
            disableRowSelectionOnClick
            sx={{ border: 'none' }}
          />
        </CardContent>
      </Card>

      {/* Salary Config Drawer */}
      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box sx={{ width: { xs: '100vw', sm: 540 }, p: 3, role: 'presentation' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
            Configure Salary: {selectedStaff?.staffName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Define base pay model, overtime multipliers, allowances, and commission structures.
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Pay Structure Type</InputLabel>
              <Select
                value={payStructureType}
                label="Pay Structure Type"
                onChange={(e) => setPayStructureType(e.target.value)}
              >
                <MenuItem value="MONTHLY">Monthly Salary</MenuItem>
                <MenuItem value="DAILY">Daily Wage</MenuItem>
                <MenuItem value="HOURLY">Hourly Wage</MenuItem>
                <MenuItem value="FIXED_AND_COMMISSION">Fixed Salary + Commission</MenuItem>
                <MenuItem value="COMMISSION_ONLY">Commission Only</MenuItem>
              </Select>
            </FormControl>

            {['MONTHLY', 'FIXED_AND_COMMISSION'].includes(payStructureType) && (
              <TextField
                label="Monthly Base Salary (₹)"
                type="number"
                fullWidth
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
              />
            )}

            {payStructureType === 'DAILY' && (
              <TextField
                label="Daily Wage Rate (₹/day)"
                type="number"
                fullWidth
                value={dailyRate}
                onChange={(e) => setDailyRate(Number(e.target.value))}
              />
            )}

            {payStructureType === 'HOURLY' && (
              <TextField
                label="Hourly Wage Rate (₹/hr)"
                type="number"
                fullWidth
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
              />
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Overtime Rate (₹/hr)"
                  type="number"
                  fullWidth
                  value={overtimeRatePerHour}
                  onChange={(e) => setOvertimeRatePerHour(Number(e.target.value))}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Overtime Multiplier"
                  type="number"
                  fullWidth
                  value={overtimeMultiplier}
                  onChange={(e) => setOvertimeMultiplier(Number(e.target.value))}
                />
              </Grid>
            </Grid>

            {/* Custom Salary Components (Allowances/Deductions) */}
            <Box>
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Salary Components (Allowances & Deductions)
                </Typography>
                <Button size="small" startIcon={<Plus size={14} />} onClick={handleAddComponent}>
                  Add Component
                </Button>
              </Stack>
              {components.map((comp, idx) => (
                <Stack key={idx} direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Name"
                    value={comp.name}
                    onChange={(e) => {
                      const updated = [...components];
                      updated[idx].name = e.target.value;
                      setComponents(updated);
                    }}
                  />
                  <Select
                    size="small"
                    value={comp.type}
                    onChange={(e) => {
                      const updated = [...components];
                      updated[idx].type = e.target.value;
                      setComponents(updated);
                    }}
                  >
                    <MenuItem value="EARNING">Allowance</MenuItem>
                    <MenuItem value="DEDUCTION">Deduction</MenuItem>
                  </Select>
                  <TextField
                    size="small"
                    type="number"
                    placeholder="Value"
                    value={comp.value}
                    onChange={(e) => {
                      const updated = [...components];
                      updated[idx].value = Number(e.target.value);
                      setComponents(updated);
                    }}
                  />
                  <IconButton size="small" color="error" onClick={() => handleRemoveComponent(idx)}>
                    <Trash2 size={16} />
                  </IconButton>
                </Stack>
              ))}
            </Box>

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={() => setOpenDrawer(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? 'Saving...' : 'Save Salary Config'}
              </Button>
            </Stack>
          </Box>
        </Drawer>
      </Container>
    </DashboardLayout>
  );
}
