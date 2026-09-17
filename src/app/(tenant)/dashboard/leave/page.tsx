'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveApiService, StaffLeave } from '@/services/api/leave.service';
import { staffApiService } from '@/services/api/staff.service';
import { Plus, Trash2, CalendarHeart } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function LeaveManagementPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form state
  const [selectedStaff, setSelectedStaff] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [reason, setReason] = useState('');

  const { data: leaves = [], isLoading } = useQuery({
    queryKey: ['leaves'],
    queryFn: () => leaveApiService.getAllLeaves(),
  });

  const { data: staffList = [] } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffApiService.getStaff(),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      leaveApiService.createLeave(selectedStaff, {
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        reason,
      }),
    onSuccess: () => {
      toast.success('Leave requested successfully');
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create leave');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leaveApiService.deleteLeave(id),
    onSuccess: () => {
      toast.success('Leave record deleted');
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete leave');
    },
  });

  const resetForm = () => {
    setSelectedStaff('');
    setStartAt('');
    setEndAt('');
    setReason('');
  };

  const columns: GridColDef<StaffLeave>[] = [
    {
      field: 'serialNumber',
      headerName: 'S.No.',
      width: 70,
      renderCell: (params) => {
        const index = leaves.findIndex((row) => row.id === params.row.id);
        return index + 1;
      },
    },
    {
      field: 'staff',
      headerName: 'Staff Name',
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
      field: 'startAt',
      headerName: 'Start Date',
      flex: 1,
      renderCell: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'endAt',
      headerName: 'End Date',
      flex: 1,
      renderCell: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'reason',
      headerName: 'Reason',
      flex: 1.5,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      renderCell: (params) => {
        // Dummy status calculation based on dates for now
        const now = new Date();
        const start = new Date(params.row.startAt);
        const end = new Date(params.row.endAt);
        let status = 'APPROVED';
        let color = 'success';
        
        if (start > now) {
          status = 'UPCOMING';
          color = 'info';
        } else if (now >= start && now <= end) {
          status = 'ON LEAVE';
          color = 'warning';
        }

        return <Chip label={status} color={color as any} size="small" variant="filled" />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          size="small"
          onClick={() => {
            if (confirm('Are you sure you want to delete this leave record?')) {
              deleteMutation.mutate(params.row.id);
            }
          }}
        >
          <Trash2 size={18} />
        </IconButton>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
              Leave Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track staff vacations, sick days, and pending leave requests.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus size={18} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Leave Record
          </Button>
        </Stack>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <DataGrid
              rows={leaves}
              columns={columns}
              loading={isLoading}
              autoHeight
              disableRowSelectionOnClick
              sx={{ border: 'none' }}
            />
          </CardContent>
        </Card>
      </Container>

      {/* Add Leave Modal */}
      <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarHeart size={20} color="#7C3AED" />
          Add Leave Record
        </DialogTitle>
        <DialogContent sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            select
            label="Staff Member"
            fullWidth
            required
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            sx={{ mt: 1 }}
          >
            {staffList.map((s: any) => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </TextField>
          
          <Stack direction="row" spacing={2}>
            <TextField
              type="date"
              label="Start Date"
              fullWidth
              required
              slotProps={{ inputLabel: { shrink: true } }}
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
            <TextField
              type="date"
              label="End Date"
              fullWidth
              required
              slotProps={{ inputLabel: { shrink: true } }}
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </Stack>

          <TextField
            label="Reason (Optional)"
            multiline
            rows={3}
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setIsAddModalOpen(false)} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={() => createMutation.mutate()}
            disabled={!selectedStaff || !startAt || !endAt || createMutation.isPending}
          >
            {createMutation.isPending ? 'Saving...' : 'Save Leave'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
