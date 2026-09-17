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
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { attendanceApiService, StaffAttendance } from '@/services/api/attendance.service';
import { ArrowRight, Calendar, Clock, MonitorPlay, Users } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AttendanceDashboardPage() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const { data: attendanceData = [], isLoading } = useQuery({
    queryKey: ['attendance', selectedDate],
    queryFn: () => attendanceApiService.getDailyAttendance(selectedDate),
  });

  const columns: GridColDef<StaffAttendance>[] = [
    {
      field: 'serialNumber',
      headerName: 'S.No.',
      width: 70,
      renderCell: (params) => {
        const index = attendanceData.findIndex((row) => row.id === params.row.id);
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
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      renderCell: (params) => {
        const conf: any = {
          PRESENT: { color: 'success' },
          ABSENT: { color: 'error' },
          HALF_DAY: { color: 'warning' },
          ON_LEAVE: { color: 'info' },
          HOLIDAY: { color: 'default' },
          WEEK_OFF: { color: 'default' },
        }[params.value] || { color: 'default' };
        return <Chip label={params.value} color={conf.color} size="small" variant="filled" />;
      },
    },
    {
      field: 'clockIn',
      headerName: 'Clock In',
      flex: 1,
      renderCell: (params) => params.value ? format(new Date(params.value), 'hh:mm a') : '-',
    },
    {
      field: 'clockOut',
      headerName: 'Clock Out',
      flex: 1,
      renderCell: (params) => params.value ? format(new Date(params.value), 'hh:mm a') : '-',
    },
    {
      field: 'workingHours',
      headerName: 'Working Hours',
      flex: 1,
      renderCell: (params) => `${params.value?.toFixed(2)} hrs`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Button variant="outlined" size="small">
          Correct
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
              Attendance Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor daily staff attendance, clock-ins, and breaks.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              href="/dashboard/attendance/terminal"
              variant="contained"
              color="primary"
              startIcon={<MonitorPlay size={18} />}
            >
              Open Terminal UI
            </Button>
          </Stack>
        </Stack>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Calendar size={20} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Select Date:
            </Typography>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <DataGrid
              rows={attendanceData}
              columns={columns}
              loading={isLoading}
              autoHeight
              disableRowSelectionOnClick
              sx={{ border: 'none' }}
            />
          </CardContent>
        </Card>
      </Container>
    </DashboardLayout>
  );
}
