export const runtime = 'edge';
'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { Phone, MessageCircle, Mail, MoreVertical, ArrowLeft, Edit2 } from 'lucide-react';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Avatar } from '@/shared/ui/Avatar';
import { ROUTES } from '@/config/routes';

export default function DetailedStaffProfilePage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', maxWidth: '100%', pb: 4 }}>
          {/* Back Button */}
          <Button
            component={Link}
            href={ROUTES.dashboard.staff.root}
            startIcon={<ArrowLeft size={16} />}
            sx={{ textTransform: 'none', fontWeight: 700, color: '#6B7280', p: 0, mb: 2 }}
          >
            Back to Staff
          </Button>

          {/* Top Profile Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Avatar name="Rahul Mehta" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" sx={{ width: 72, height: 72 }} />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>
                    Rahul Mehta
                  </Typography>
                  <Chip label="Senior Stylist" size="small" sx={{ backgroundColor: '#F3E8FF', color: '#7C3AED', fontWeight: 800, height: 20 }} />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                  +91 98765 43210 • <span style={{ color: '#7C3AED' }}>rahul.mehta@email.com</span> • <span style={{ color: '#10B981', fontWeight: 700 }}>Active</span>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ backgroundColor: '#EFF6FF', color: '#3B82F6', borderRadius: '10px', p: 1 }}><Phone size={18} /></IconButton>
              <IconButton size="small" sx={{ backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '10px', p: 1 }}><MessageCircle size={18} /></IconButton>
              <IconButton size="small" sx={{ backgroundColor: '#F3E8FF', color: '#7C3AED', borderRadius: '10px', p: 1 }}><Mail size={18} /></IconButton>
              <IconButton size="small" sx={{ border: '1px solid #E5E7EB', borderRadius: '10px', p: 1 }}><MoreVertical size={18} color="#6B7280" /></IconButton>
            </Box>
          </Box>

          {/* Sub Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3.5 }}>
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', px: 2.5 } }}
            >
              <Tab label="Overview" />
              <Tab label="Schedule" />
              <Tab label="Leaves" />
              <Tab label="Breaks" />
              <Tab label="Services" />
              <Tab label="Performance" />
              <Tab label="Documents" />
            </Tabs>
          </Box>

          {/* 3-Column Profile Information Grid */}
          <Grid container spacing={3}>
            {/* Column 1: Personal Information */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>
                    Personal Information
                  </Typography>
                  <Button size="small" startIcon={<Edit2 size={14} />} sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.78125rem', color: '#7C3AED' }}>
                    Edit
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Employee ID</Typography><Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>EMP-1001</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Date of Birth</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>10 Feb 1990</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Gender</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Male</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Address</Typography><Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem', lineHeight: 1.4 }}>123, Green Avenue, Downtown, Mumbai - 400001</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Emergency Contact</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>Priya Mehta (Wife) +91 91234 56789</Typography></Box>
                </Box>
              </Card>
            </Grid>

            {/* Column 2: Work Information */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', mb: 2 }}>
                  Work Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Role</Typography><Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Senior Stylist</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Department</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Hair Services</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Date of Joining</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>15 Jan 2023</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Status</Typography><Typography variant="body2" color="success.main" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Active</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Working Hours</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>9:00 AM - 6:00 PM</Typography></Box>
                </Box>
              </Card>
            </Grid>

            {/* Column 3: Summary */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', mb: 2 }}>
                  Summary
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Total Appointments</Typography><Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>128</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Completed Today</Typography><Typography variant="h6" sx={{ fontWeight: 800, color: '#10B981' }}>5</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Next Shift</Typography><Typography variant="body1" sx={{ fontWeight: 700, color: '#7C3AED' }}>Today, 10:00 AM</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Weekly Off</Typography><Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Monday</Typography></Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
