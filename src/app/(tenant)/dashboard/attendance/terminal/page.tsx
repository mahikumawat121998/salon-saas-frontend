'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  TextField,
  Avatar,
  Dialog,
  DialogContent,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApiService } from '@/services/api/attendance.service';
import { Clock, Coffee, LogOut, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AttendanceTerminalPage() {
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // For terminal mode, assume staff inputs an ID or PIN.
  // We'll just use a Staff ID text field for now.
  const [staffId, setStaffId] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const clockInMutation = useMutation({
    mutationFn: (id: string) => attendanceApiService.clockIn(id),
    onSuccess: () => {
      toast.success('Clocked in successfully!');
      setStaffId('');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to clock in');
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: (id: string) => attendanceApiService.clockOut(id),
    onSuccess: () => {
      toast.success('Clocked out successfully!');
      setStaffId('');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to clock out');
    },
  });

  const breakMutation = useMutation({
    mutationFn: (data: { id: string; type: 'start' | 'end' }) =>
      data.type === 'start'
        ? attendanceApiService.startBreak(data.id, 'LUNCH')
        : attendanceApiService.endBreak(data.id),
    onSuccess: (_, variables) => {
      toast.success(`Break ${variables.type === 'start' ? 'started' : 'ended'}!`);
      setStaffId('');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update break status');
    },
  });

  return (
    <DashboardLayout>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 4, textAlign: 'center', p: 4 }}>
          <CardContent>
            <Typography variant="h1" sx={{ fontWeight: 800, fontSize: '4rem', mb: 1, letterSpacing: '-2px' }}>
              {format(currentTime, 'HH:mm')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
              {format(currentTime, 'EEEE, MMMM do yyyy')}
            </Typography>

            <TextField
              fullWidth
              label="Staff ID / PIN"
              variant="outlined"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              sx={{ mb: 4 }}
              placeholder="Enter your assigned ID"
              autoFocus
            />

            <Stack spacing={2}>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<CheckCircle2 />}
                onClick={() => clockInMutation.mutate(staffId)}
                disabled={!staffId || clockInMutation.isPending}
                sx={{ py: 1.5, fontSize: '1.1rem' }}
              >
                CLOCK IN
              </Button>
              
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="warning"
                  size="large"
                  fullWidth
                  startIcon={<Coffee />}
                  onClick={() => breakMutation.mutate({ id: staffId, type: 'start' })}
                  disabled={!staffId || breakMutation.isPending}
                >
                  Start Break
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  size="large"
                  fullWidth
                  startIcon={<Clock />}
                  onClick={() => breakMutation.mutate({ id: staffId, type: 'end' })}
                  disabled={!staffId || breakMutation.isPending}
                >
                  End Break
                </Button>
              </Stack>

              <Button
                variant="contained"
                color="error"
                size="large"
                startIcon={<LogOut />}
                onClick={() => clockOutMutation.mutate(staffId)}
                disabled={!staffId || clockOutMutation.isPending}
                sx={{ py: 1.5, fontSize: '1.1rem' }}
              >
                CLOCK OUT
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  );
}
