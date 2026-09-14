'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import { ROUTES } from '@/config/routes';

interface AssignableService {
  id: string;
  name: string;
  duration: string;
  price: string;
  status: 'Assigned' | 'Not Assigned';
  assigned: boolean;
}

const SERVICES_DATA: AssignableService[] = [
  { id: '1', name: 'Haircut (Male)', duration: '30 min', price: '₹300', status: 'Assigned', assigned: true },
  { id: '2', name: 'Haircut (Female)', duration: '45 min', price: '₹500', status: 'Assigned', assigned: true },
  { id: '3', name: 'Hair Coloring', duration: '90 min', price: '₹1,500', status: 'Assigned', assigned: true },
  { id: '4', name: 'Hair Styling', duration: '30 min', price: '₹400', status: 'Assigned', assigned: true },
  { id: '5', name: 'Keratin Treatment', duration: '120 min', price: '₹2,500', status: 'Not Assigned', assigned: false },
  { id: '6', name: 'Smoothening', duration: '90 min', price: '₹2,000', status: 'Not Assigned', assigned: false },
  { id: '7', name: 'Beard Trim', duration: '20 min', price: '₹200', status: 'Assigned', assigned: true },
];

export default function ServiceAssignmentPage() {
  const [selectedStaff, setSelectedStaff] = useState<string>('rahul');
  const [services, setServices] = useState<AssignableService[]>(SERVICES_DATA);

  const handleToggle = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              assigned: !s.assigned,
              status: !s.assigned ? 'Assigned' : 'Not Assigned',
            }
          : s
      )
    );
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', maxWidth: '100%', pb: 4 }}>
          {/* Header Title */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
            <Box>
              <Button component={Link} href={ROUTES.dashboard.staff.root} startIcon={<ArrowLeft size={16} />} sx={{ textTransform: 'none', fontWeight: 700, color: '#6B7280', p: 0, mb: 1 }}>
                Back to Staff
              </Button>
              <PageHeader title="Service Assignment" subtitle="Assign services to staff members" />
            </Box>
          </Box>

          <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 3, backgroundColor: '#FFFFFF', maxWidth: 840, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ width: 260 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>Select Staff *</Typography>
                <Select fullWidth size="small" value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} sx={{ borderRadius: '10px' }}>
                  <MenuItem value="rahul">Rahul Mehta</MenuItem>
                  <MenuItem value="neha">Neha Kapoor</MenuItem>
                  <MenuItem value="amit">Amit Kumar</MenuItem>
                </Select>
              </Box>

              <Select size="small" defaultValue="bulk" sx={{ borderRadius: '10px', height: 38, minWidth: 140 }}>
                <MenuItem value="bulk">Bulk Actions</MenuItem>
                <MenuItem value="assign_all">Assign All</MenuItem>
                <MenuItem value="unassign_all">Unassign All</MenuItem>
              </Select>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '1px solid #F3F4F6', py: 1.2 } }}>
                    <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((srv) => (
                    <TableRow key={srv.id} hover onClick={() => handleToggle(srv.id)} sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell padding="checkbox"><Checkbox size="small" checked={srv.assigned} /></TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827' }}>{srv.name}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#6B7280' }}>{srv.duration}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 800, color: '#111827' }}>{srv.price}</TableCell>
                      <TableCell>
                        <Chip
                          label={srv.status}
                          size="small"
                          sx={{
                            backgroundColor: srv.assigned ? 'rgba(16, 185, 129, 0.12)' : '#F3F4F6',
                            color: srv.assigned ? '#10B981' : '#6B7280',
                            fontWeight: 700,
                            fontSize: '0.6875rem',
                            height: 22,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3, pt: 2, borderTop: '1px solid #F3F4F6' }}>
              <Button sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
              <Button variant="contained" sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}>
                Save Changes
              </Button>
            </Box>
          </Card>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
