'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Trash2, AlertTriangle, Power } from 'lucide-react';

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'delete_customer' | 'cancel_appointment' | 'deactivate_staff';
}

export function ConfirmationDialog({ open, onClose, onConfirm, type }: ConfirmationDialogProps) {
  const getConfig = () => {
    switch (type) {
      case 'delete_customer':
        return {
          icon: Trash2,
          iconBg: '#FEE2E2',
          iconColor: '#EF4444',
          title: 'Delete Customer?',
          description: 'Are you sure you want to delete this customer? This action cannot be undone.',
          cancelText: 'Cancel',
          confirmText: 'Delete',
          confirmBg: '#EF4444',
        };
      case 'cancel_appointment':
        return {
          icon: AlertTriangle,
          iconBg: '#FEF3C7',
          iconColor: '#F59E0B',
          title: 'Cancel Appointment?',
          description: 'Are you sure you want to cancel this appointment?',
          cancelText: 'No, Keep It',
          confirmText: 'Yes, Cancel',
          confirmBg: '#F59E0B',
        };
      case 'deactivate_staff':
        return {
          icon: Power,
          iconBg: '#EFF6FF',
          iconColor: '#3B82F6',
          title: 'Deactivate Staff?',
          description: 'Are you sure you want to deactivate this staff member?',
          cancelText: 'Cancel',
          confirmText: 'Deactivate',
          confirmBg: '#3B82F6',
        };
    }
  };

  const cfg = getConfig();
  const IconComp = cfg.icon;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: '20px', p: 2, textAlign: 'center' } } }}
    >
      <DialogContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            backgroundColor: cfg.iconBg,
            color: cfg.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <IconComp size={28} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', mb: 0.8 }}>
          {cfg.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', lineHeight: 1.5, mb: 3 }}>
          {cfg.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
          <Button
            fullWidth
            onClick={onClose}
            sx={{
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              color: '#374151',
              fontWeight: 700,
              fontSize: '0.84rem',
              py: 1,
              textTransform: 'none',
            }}
          >
            {cfg.cancelText}
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            sx={{
              borderRadius: '10px',
              backgroundColor: cfg.confirmBg,
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.84rem',
              py: 1,
              textTransform: 'none',
              '&:hover': { backgroundColor: cfg.confirmBg, opacity: 0.9 },
            }}
          >
            {cfg.confirmText}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
