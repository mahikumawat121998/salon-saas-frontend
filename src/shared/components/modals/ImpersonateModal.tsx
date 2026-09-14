'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import { X, ShieldAlert, ExternalLink } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { adminApiService } from '@/services/api/admin.service';
import { showToast } from '@/shared/components/Toast';
import { useAuthStore } from '@/core/stores/auth.store';

interface ImpersonateModalProps {
  open: boolean;
  onClose: () => void;
  tenantId: string;
  tenantName: string;
}

export function ImpersonateModal({ open, onClose, tenantId, tenantName }: ImpersonateModalProps) {
  const [reason, setReason] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);
  const currentUser = useAuthStore((s) => s.user);

  const impersonateMutation = useMutation({
    mutationFn: () => adminApiService.impersonateTenant(tenantId, { reason }),
    onSuccess: (data) => {
      showToast.success(
        'Impersonation Access Granted',
        `Accessing ${data.tenantName} as Tenant Admin`
      );
      if (data.accessToken) {
        if (currentUser) {
          setAuth(data.accessToken, '', {
            ...currentUser,
            tenantId: data.tenantId,
            email: data.impersonatedUserEmail,
          });
        }
        // Store impersonation metadata in session
        sessionStorage.setItem(
          'sams_impersonating',
          JSON.stringify({
            tenantName: data.tenantName,
            tenantId: data.tenantId,
            userEmail: data.impersonatedUserEmail,
          })
        );
        window.location.href = '/dashboard';
      }
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to initialize support access';
      showToast.error('Impersonation Failed', msg);
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            p: 1,
            backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={22} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: 'text.primary' }}>
            Access Tenant Support Mode
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 1 }}>
        <Alert severity="warning" sx={{ mb: 2.5, borderRadius: '12px', fontWeight: 600, fontSize: '0.8125rem' }}>
          You are about to access <strong>{tenantName}</strong> as a Tenant Admin. This session will be recorded in system audit logs for compliance.
        </Alert>

        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: 'text.secondary' }}>
          Reason for Access *
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="e.g. Salon owner requested assistance with appointment booking error..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              fontSize: '0.875rem',
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={!reason.trim() || impersonateMutation.isPending}
          onClick={() => impersonateMutation.mutate()}
          startIcon={<ExternalLink size={16} />}
          sx={{
            borderRadius: '12px',
            fontWeight: 800,
            px: 2.5,
            py: 1,
            textTransform: 'none',
            backgroundColor: '#EF4444',
            '&:hover': { backgroundColor: '#DC2626' },
          }}
        >
          {impersonateMutation.isPending ? 'Connecting...' : 'Continue to Tenant Dashboard'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
