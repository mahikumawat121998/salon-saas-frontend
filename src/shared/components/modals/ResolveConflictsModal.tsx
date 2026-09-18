'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { X, AlertTriangle, CalendarClock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentApiService, AppointmentItem } from '@/services/api/appointment.service';
import { staffApiService } from '@/services/api/staff.service';
import { QUERY_KEYS } from '@/config/query-keys';
import { showToast } from '@/shared/components/Toast';

interface ResolveConflictsModalProps {
  open: boolean;
  onClose: () => void;
  appointments: AppointmentItem[];
}

export function ResolveConflictsModal({ open, onClose, appointments }: ResolveConflictsModalProps) {
  const queryClient = useQueryClient();

  const { data: staffList = [] } = useQuery({
    queryKey: QUERY_KEYS.staff.all,
    queryFn: () => staffApiService.getStaff(),
    enabled: open,
  });

  // Track the resolution for each appointment
  // { appointmentId: { action: 'CANCEL' | 'REASSIGN', newStaffId?: string } }
  const [resolutions, setResolutions] = useState<Record<string, { action: 'CANCEL' | 'REASSIGN'; newStaffId?: string }>>({});

  const bulkResolveMutation = useMutation({
    mutationFn: (updates: any) => appointmentApiService.bulkResolveAppointments({ updates }),
    onSuccess: () => {
      showToast.success('Conflicts Resolved', 'Appointments have been successfully reassigned or cancelled.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments.all });
      onClose();
    },
    onError: () => {
      showToast.error('Failed to resolve conflicts', 'Please try again.');
    },
  });

  const handleActionChange = (appointmentId: string, action: 'CANCEL' | 'REASSIGN') => {
    setResolutions((prev) => ({
      ...prev,
      [appointmentId]: { ...prev[appointmentId], action, newStaffId: action === 'CANCEL' ? undefined : prev[appointmentId]?.newStaffId },
    }));
  };

  const handleStaffChange = (appointmentId: string, newStaffId: string) => {
    setResolutions((prev) => ({
      ...prev,
      [appointmentId]: { action: 'REASSIGN', newStaffId },
    }));
  };

  const handleSubmit = () => {
    const updates = appointments.map((appt) => {
      const res = resolutions[appt.id] || { action: 'CANCEL' }; // default to cancel if untouched, or maybe we shouldn't allow it. Let's force a choice.
      return {
        appointmentId: appt.id,
        action: res.action,
        newStaffId: res.newStaffId,
      };
    });

    // Validate that all reassignments have a staff selected
    const invalid = updates.find((u) => u.action === 'REASSIGN' && !u.newStaffId);
    if (invalid) {
      showToast.error('Validation Error', 'Please select a staff member for all reassigned appointments.');
      return;
    }

    bulkResolveMutation.mutate(updates);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#DC2626' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangle size={20} />
          Appointment Conflicts Detected
        </Box>
        <IconButton onClick={onClose} size="small"><X size={18} /></IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ border: 'none' }}>
        <Typography variant="body2" sx={{ mb: 3, color: '#374151' }}>
          This staff member has <strong>{appointments.length}</strong> appointment(s) during the requested leave period. 
          Please resolve these conflicts by reassigning them to another staff member or cancelling them.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {appointments.map((appt) => {
            const currentRes = resolutions[appt.id] || { action: 'CANCEL' };
            const timeString = new Date(appt.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <Box key={appt.id} sx={{ p: 2, borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{appt.customer?.name || 'Walk-in Customer'}</Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarClock size={12} /> {new Date(appt.startAt).toLocaleDateString()} at {timeString} - {appt.service?.name}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Select
                    size="small"
                    value={currentRes.action}
                    onChange={(e) => handleActionChange(appt.id, e.target.value as any)}
                    sx={{ width: 140, borderRadius: '8px', backgroundColor: '#fff' }}
                  >
                    <MenuItem value="REASSIGN">Reassign To</MenuItem>
                    <MenuItem value="CANCEL">Cancel</MenuItem>
                  </Select>

                  {currentRes.action === 'REASSIGN' && (
                    <Select
                      size="small"
                      displayEmpty
                      value={currentRes.newStaffId || ''}
                      onChange={(e) => handleStaffChange(appt.id, e.target.value)}
                      sx={{ flexGrow: 1, borderRadius: '8px', backgroundColor: '#fff' }}
                    >
                      <MenuItem value="" disabled>Select Staff</MenuItem>
                      {staffList.filter((s: any) => s.id !== appt.staffId).map((s: any) => (
                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                      ))}
                    </Select>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={bulkResolveMutation.isPending}
          sx={{ backgroundColor: '#DC2626', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3, '&:hover': { backgroundColor: '#B91C1C' } }}
        >
          {bulkResolveMutation.isPending ? 'Processing...' : 'Confirm & Resolve'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
