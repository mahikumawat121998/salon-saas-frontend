'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import { ArrowLeft, Clock, Calendar as CalendarIcon, CheckSquare, XCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthGuard from '@/shared/components/auth/AuthGuard';
import { showToast } from '@/shared/components/Toast';
import { attendanceApiService, StaffAttendance } from '@/services/api/attendance.service';

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<StaffAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const data = await attendanceApiService.getDailyAttendance(selectedDate);
      setRecords(data);
    } catch (err: any) {
      showToast.error('Error fetching attendance', err?.response?.data?.message || 'Failed to load records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const handleClockIn = async (staffId: string) => {
    try {
      await attendanceApiService.clockIn(staffId, selectedDate);
      showToast.success('Clocked In', 'Staff successfully clocked in.');
      fetchAttendance();
    } catch (err: any) {
      showToast.error('Clock In Failed', err?.response?.data?.message || 'Failed to clock in staff.');
    }
  };

  const handleClockOut = async (staffId: string) => {
    try {
      await attendanceApiService.clockOut(staffId, selectedDate);
      showToast.success('Clocked Out', 'Staff successfully clocked out.');
      fetchAttendance();
    } catch (err: any) {
      showToast.error('Clock Out Failed', err?.response?.data?.message || 'Failed to clock out staff.');
    }
  };

  const handleMarkAbsent = async (staffId: string) => {
    try {
      await attendanceApiService.markAbsent(staffId, selectedDate);
      showToast.success('Marked Absent', 'Staff marked as absent.');
      fetchAttendance();
    } catch (err: any) {
      showToast.error('Failed to mark absent', err?.response?.data?.message || 'Failed to mark staff as absent.');
    }
  };

  const getStatusChip = (status?: string | null) => {
    switch (status) {
      case 'PRESENT':
        return <Chip label="Present" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontWeight: 700 }} />;
      case 'ABSENT':
        return <Chip label="Absent" size="small" sx={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', fontWeight: 700 }} />;
      case 'ON_LEAVE':
        return <Chip label="On Leave" size="small" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontWeight: 700 }} />;
      case 'HALF_DAY':
        return <Chip label="Half Day" size="small" sx={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', fontWeight: 700 }} />;
      default:
        return <Chip label="Not Marked" size="small" sx={{ backgroundColor: 'rgba(156, 163, 175, 0.15)', color: '#9CA3AF', fontWeight: 700 }} />;
    }
  };

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredRecords = records.filter(r => r.staff.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', maxWidth: '100%', pb: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Button
              component={Link}
              href={ROUTES.dashboard.staff.root}
              variant="outlined"
              sx={{ minWidth: 40, width: 40, height: 40, p: 0, borderRadius: '12px', borderColor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#E5E7EB', color: 'text.primary' }}
            >
              <ArrowLeft size={18} />
            </Button>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Attendance Tracker</Typography>
              <Typography variant="body2" color="text.secondary">Monitor and manage daily staff attendance</Typography>
            </Box>
          </Box>

          <Card elevation={0} sx={{ borderRadius: '20px', border: (t) => t.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid #F3F4F6', p: 3, backgroundColor: (t) => t.palette.mode === 'dark' ? '#111827' : '#FFFFFF' }}>
            
            {/* Controls */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2, mb: 3 }}>
              <TextField
                type="date"
                size="small"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                sx={{ width: { xs: '100%', sm: 200 }, '& .MuiOutlinedInput-root': { borderRadius: '12px', height: 40 } }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, maxWidth: { xs: '100%', md: 300 } }}>
                <TextField
                  placeholder="Search staff..."
                  size="small"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', height: 40 } }}
                />
              </Box>
            </Box>

            {/* Table */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: (t) => t.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid #F3F4F6', pb: 2 } }}>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Staff Member</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Clock In</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Clock Out</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Total Hours</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                        <CircularProgress size={32} sx={{ color: '#7C3AED' }} />
                      </TableCell>
                    </TableRow>
                  ) : filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No staff members found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredRecords.map((record) => (
                    <TableRow key={record.staff.id} sx={{ '& td': { py: 2, borderBottom: (t) => t.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid #F3F4F6' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar src={record.staff.profilePicture || ''} alt={record.staff.name} sx={{ width: 36, height: 36 }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{record.staff.name}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(record.status)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatTime(record.clockIn)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatTime(record.clockOut)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {record.totalHours ? `${record.totalHours.toFixed(1)}h` : '--'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          {!record.clockIn && record.status !== 'ABSENT' && (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleClockIn(record.staff.id)}
                                sx={{ backgroundColor: '#10B981', '&:hover': { backgroundColor: '#059669' }, textTransform: 'none', borderRadius: '8px', fontSize: '0.75rem' }}
                              >
                                Clock In
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleMarkAbsent(record.staff.id)}
                                sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '0.75rem' }}
                              >
                                Absent
                              </Button>
                            </>
                          )}
                          {record.clockIn && !record.clockOut && (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleClockOut(record.staff.id)}
                              sx={{ backgroundColor: '#F59E0B', '&:hover': { backgroundColor: '#D97706' }, textTransform: 'none', borderRadius: '8px', fontSize: '0.75rem' }}
                            >
                              Clock Out
                            </Button>
                          )}
                          {record.clockOut && (
                            <Chip label="Completed" size="small" variant="outlined" color="success" />
                          )}
                          {record.status === 'ABSENT' && (
                            <Chip label="Marked Absent" size="small" variant="outlined" color="error" />
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
