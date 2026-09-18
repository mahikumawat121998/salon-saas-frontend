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
        const index = attendanceData.findIndex((row) => row.staff?.id === params.row.staff?.id);
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
        const status = params.row.attendance?.status;
        if (!status) return <Typography variant="body2" color="text.secondary">-</Typography>;
        
        const statusMap: Record<string, any> = {
          PRESENT: { color: 'success' },
          ABSENT: { color: 'error' },
          HALF_DAY: { color: 'warning' },
          ON_LEAVE: { color: 'info' },
          HOLIDAY: { color: 'default' },
          WEEK_OFF: { color: 'default' },
        };
        const conf = statusMap[String(status)] || { color: 'default' };
        return <Chip label={status} color={conf.color} size="small" variant="filled" />;
      },
    },
    {
      field: 'clockIn',
      headerName: 'Clock In',
      flex: 1,
      renderCell: (params) => {
        const val = params.row.attendance?.clockIn;
        return val ? format(new Date(val), 'hh:mm a') : '-';
      },
    },
    {
      field: 'clockOut',
      headerName: 'Clock Out',
      flex: 1,
      renderCell: (params) => {
        const val = params.row.attendance?.clockOut;
        return val ? format(new Date(val), 'hh:mm a') : '-';
      },
    },
    {
      field: 'workingHours',
      headerName: 'Working Hours',
      flex: 1,
      renderCell: (params) => {
        const val = params.row.attendance?.workingHours;
        return val != null ? `${Number(val).toFixed(2)} hrs` : '-';
      },
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
              getRowId={(row) => row.staff?.id || Math.random().toString()}
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
