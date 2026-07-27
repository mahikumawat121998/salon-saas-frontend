'use client';

import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import { X, Edit2 } from 'lucide-react';
import { Avatar } from '@/shared/ui/Avatar';

export interface CustomerDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  customer?: any;
}

export function CustomerDetailsDrawer({ open, onClose }: CustomerDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: { xs: '100%', sm: 380 }, p: 3, borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>
          Customer Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </Box>

      {/* Customer Header Avatar & Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
        <Avatar name="Priya Sharma" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" sx={{ width: 56, height: 56 }} />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
              Priya Sharma
            </Typography>
            <Chip label="VIP" size="small" sx={{ backgroundColor: '#F3E8FF', color: '#7C3AED', fontWeight: 800, height: 18, fontSize: '0.65rem' }} />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
            +91 98765 43210
          </Typography>
          <Typography variant="caption" color="primary.main" sx={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>
            priya.sharma@email.com
          </Typography>
        </Box>
      </Box>

      {/* Sub Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.78125rem',
              minWidth: 'auto',
              px: 1.5,
              py: 0.5,
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Appointments" />
          <Tab label="Payments" />
          <Tab label="Notes" />
        </Tabs>
      </Box>

      {/* Key Metric Stats List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, mb: 4, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
            Total Appointments
          </Typography>
          <Typography variant="body2" color="#111827" sx={{ fontWeight: 800, fontSize: '0.875rem' }}>
            12
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
            Total Spent
          </Typography>
          <Typography variant="body2" color="#111827" sx={{ fontWeight: 800, fontSize: '0.875rem' }}>
            $1,240.00
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
            Last Visit
          </Typography>
          <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
            22 Jul 2025
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
            Status
          </Typography>
          <Chip label="Active" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontWeight: 700, height: 20 }} />
        </Box>
      </Box>

      {/* Action Button Footer */}
      <Button
        fullWidth
        variant="outlined"
        startIcon={<Edit2 size={16} />}
        sx={{
          borderRadius: '12px',
          borderColor: '#E5E7EB',
          color: '#374151',
          fontWeight: 700,
          fontSize: '0.875rem',
          textTransform: 'none',
          py: 1,
        }}
      >
        Edit Customer
      </Button>
    </Drawer>
  );
}
