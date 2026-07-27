'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { X } from 'lucide-react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApiService } from '@/services/api/customer.service';
import { staffApiService } from '@/services/api/staff.service';
import { catalogApiService } from '@/services/api/catalog.service';
import { appointmentApiService } from '@/services/api/appointment.service';
import { QUERY_KEYS } from '@/config/query-keys';

interface AddAppointmentModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddAppointmentModal({ open, onClose }: AddAppointmentModalProps) {
  const queryClient = useQueryClient();

  const { data: customers = [] } = useQuery({
    queryKey: QUERY_KEYS.customers.all,
    queryFn: () => customerApiService.getCustomers(),
    enabled: open, // Only fetch when modal is open
  });

  const { data: staff = [] } = useQuery({
    queryKey: QUERY_KEYS.staff.all,
    queryFn: () => staffApiService.getStaff(),
    enabled: open,
  });

  const { data: services = [] } = useQuery({
    queryKey: QUERY_KEYS.services.all,
    queryFn: () => catalogApiService.getServices(),
    enabled: open,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: (data: any) => appointmentApiService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments.all });
      setFormData({
        customerId: '',
        staffId: '',
        serviceId: '',
        startAt: '',
        source: 'ADMIN',
        customerNotes: '',
      });
      onClose();
    },
  });

  const [formData, setFormData] = useState({
    customerId: '',
    staffId: '',
    serviceId: '',
    startAt: '',
    source: 'ADMIN',
    customerNotes: '',
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
        Add New Appointment
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ border: 'none' }}>
        <Grid container spacing={3}>
          {/* Left: Client Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#111827' }}>
              Client Details
            </Typography>

            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
              Select Customer *
            </Typography>
            <Select
              fullWidth
              size="small"
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              sx={{ mb: 2, borderRadius: '10px' }}
            >
              {customers.map((c: any) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ''}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
              Notes
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add any notes (optional)..."
              value={formData.customerNotes || ''}
              onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>

          {/* Right: Appointment Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#111827' }}>
              Appointment Details
            </Typography>

            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
              Service *
            </Typography>
            <Select
              fullWidth
              size="small"
              value={formData.serviceId}
              onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
              sx={{ mb: 2, borderRadius: '10px' }}
            >
              {services.map((s: any) => (
                <MenuItem key={s.id} value={s.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{s.name}</span>
                    <strong style={{ color: '#7C3AED' }}>₹{s.price}</strong>
                  </Box>
                </MenuItem>
              ))}
            </Select>

            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
              Staff *
            </Typography>
            <Select
              fullWidth
              size="small"
              value={formData.staffId}
              onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
              sx={{ mb: 2, borderRadius: '10px' }}
            >
              {staff.map((st: any) => (
                <MenuItem key={st.id} value={st.id}>{st.name}</MenuItem>
              ))}
            </Select>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={12}>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                  Date & Time *
                </Typography>
                <DateTimePicker
                  value={formData.startAt ? new Date(formData.startAt) : null}
                  onChange={(newValue) => setFormData({ ...formData, startAt: newValue ? (newValue as Date).toISOString() : '' })}
                  slotProps={{ textField: { fullWidth: true, size: "small", sx: { '& .MuiOutlinedInput-root': { borderRadius: '10px' } } } }}
                />
              </Grid>
            </Grid>

            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
              Duration
            </Typography>
            <Select fullWidth size="small" defaultValue="1hr" sx={{ mb: 2, borderRadius: '10px' }}>
              <MenuItem value="1hr">1 hr</MenuItem>
              <MenuItem value="1.5hr">1.5 hr</MenuItem>
            </Select>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                Repeat Appointment
              </Typography>
              <Switch size="small" />
            </Box>
          </Grid>

          {/* Additional Information Row */}
          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, my: 1.5, color: '#111827' }}>
              Additional Information
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 12 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
                  Source
                </Typography>
                <Select 
                  fullWidth 
                  size="small" 
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                  sx={{ borderRadius: '10px' }}
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="WALK_IN">Walk-In</MenuItem>
                  <MenuItem value="ONLINE">Online</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            createAppointmentMutation.mutate({
              customerId: formData.customerId,
              staffId: formData.staffId,
              serviceId: formData.serviceId,
              startAt: new Date(formData.startAt).toISOString(),
              source: formData.source as any,
              customerNotes: formData.customerNotes,
            });
          }}
          disabled={createAppointmentMutation.isPending || !formData.customerId || !formData.staffId || !formData.serviceId || !formData.startAt}
          sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}
        >
          {createAppointmentMutation.isPending ? 'Creating...' : 'Create Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddAppointmentModal;
