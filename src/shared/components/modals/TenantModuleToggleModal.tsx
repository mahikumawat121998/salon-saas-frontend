'use client';

import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import {
  X,
  Sliders,
  Calendar,
  Users,
  Scissors,
  UserCheck,
  CreditCard,
  Package,
  BarChart3,
  Megaphone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiService } from '@/services/api/admin.service';
import { QUERY_KEYS } from '@/config/query-keys';
import { showToast } from '@/shared/components/Toast';

interface TenantModuleToggleModalProps {
  open: boolean;
  onClose: () => void;
  tenantId: string;
  tenantName: string;
  planName?: string;
  initialModules?: string[];
}

const ALL_MODULES = [
  {
    code: 'APPOINTMENTS',
    name: 'Appointments Calendar',
    description: 'Booking calendar, appointment scheduling & timeline',
    icon: Calendar,
    color: '#7C3AED',
  },
  {
    code: 'CUSTOMERS',
    name: 'Client CRM & Notes',
    description: 'Customer profiles, history, preferences & notes',
    icon: Users,
    color: '#3B82F6',
  },
  {
    code: 'CATALOG',
    name: 'Service Catalog & Pricing',
    description: 'Services, categories & dynamic pricing tiers',
    icon: Scissors,
    color: '#EC4899',
  },
  {
    code: 'STAFF',
    name: 'Staff Roster & Leave Management',
    description: 'Staff profiles, schedules, breaks & leaves',
    icon: UserCheck,
    color: '#10B981',
  },
  {
    code: 'BILLING',
    name: 'Invoicing & POS Billing',
    description: 'Invoices, payment collection & checkout POS',
    icon: CreditCard,
    color: '#F59E0B',
  },
  {
    code: 'INVENTORY',
    name: 'Inventory & Stock Control',
    description: 'Product catalog, stock levels & reorder alerts',
    icon: Package,
    color: '#6366F1',
  },
  {
    code: 'REPORTS',
    name: 'Analytics & Financial Reports',
    description: 'Revenue analytics, staff metrics & service breakdown',
    icon: BarChart3,
    color: '#8B5CF6',
  },
  {
    code: 'MARKETING',
    name: 'Marketing & Promotions',
    description: 'SMS campaigns, discount codes & client recall',
    icon: Megaphone,
    color: '#EF4444',
  },
  {
    code: 'WHATSAPP',
    name: 'WhatsApp Business Direct',
    description: 'Automated WhatsApp appointment confirmations & reminders',
    icon: MessageSquare,
    color: '#22C55E',
  },
  {
    code: 'ATTENDANCE',
    name: 'Attendance Tracking',
    description: 'Staff clock-in/out, breaks, and daily attendance logs',
    icon: Sparkles,
    color: '#06B6D4',
  },
  {
    code: 'LEAVE',
    name: 'Leave Management',
    description: 'Leave requests, approvals, and balances',
    icon: Sparkles,
    color: '#F43F5E',
  },
  {
    code: 'PAYROLL',
    name: 'Payroll & Commissions',
    description: 'Automated payroll generation & commission splits',
    icon: Sparkles,
    color: '#14B8A6',
  }
];

export function TenantModuleToggleModal({
  open,
  onClose,
  tenantId,
  tenantName,
  planName = 'Starter Plan',
  initialModules = ['APPOINTMENTS', 'CUSTOMERS', 'CATALOG', 'STAFF', 'BILLING'],
}: TenantModuleToggleModalProps) {
  const queryClient = useQueryClient();
  const [enabledModules, setEnabledModules] = useState<string[]>(initialModules);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (initialModules && initialModules.length > 0) {
      setEnabledModules(initialModules);
    }
  }, [initialModules, open]);

  const toggleMutation = useMutation({
    mutationFn: () =>
      adminApiService.updateTenantModules(tenantId, {
        allowedModules: enabledModules,
        reason,
      }),
    onSuccess: () => {
      showToast.success('Module Permissions Updated', `Feature toggles updated for ${tenantName}`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.tenants() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.metrics });
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update module permissions';
      showToast.error('Update Failed', msg);
    },
  });

  const handleToggle = (code: string) => {
    setEnabledModules((prev) =>
      prev.includes(code) ? prev.filter((m) => m !== code) : [...prev, code]
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            p: 1.5,
            backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            border: (t) => `1px solid ${t.palette.divider}`,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Sliders size={22} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary' }}>
              Selective Feature Permissions
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Turn ON/OFF specific operational modules for <strong>{tenantName}</strong> ({planName})
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {ALL_MODULES.map((mod) => {
          const Icon = mod.icon;
          const isEnabled = enabledModules.includes(mod.code);

          return (
            <Card
              key={mod.code}
              sx={{
                p: 2,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: (t) =>
                  isEnabled
                    ? t.palette.mode === 'dark'
                      ? 'rgba(16, 185, 129, 0.06)'
                      : 'rgba(16, 185, 129, 0.03)'
                    : t.palette.mode === 'dark'
                    ? '#0B0F17'
                    : '#FAFAFC',
                border: isEnabled
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : (t) => `1px solid ${t.palette.divider}`,
                transition: 'all 0.2s ease',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '10px',
                    backgroundColor: isEnabled ? `${mod.color}18` : 'rgba(156, 163, 175, 0.1)',
                    color: isEnabled ? mod.color : '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.9rem', color: isEnabled ? 'text.primary' : 'text.disabled' }}>
                      {mod.name}
                    </Typography>
                    <Chip
                      label={isEnabled ? 'ENABLED' : 'OFF'}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        backgroundColor: isEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(156, 163, 175, 0.15)',
                        color: isEnabled ? '#10B981' : '#9CA3AF',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem', mt: 0.2 }}>
                    {mod.description}
                  </Typography>
                </Box>
              </Box>

              <Switch
                checked={isEnabled}
                onChange={() => handleToggle(mod.code)}
                color="success"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#10B981',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#10B981',
                  },
                }}
              />
            </Card>
          );
        })}

        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="Audit Reason for Feature Toggle Change"
            placeholder="e.g. Granted trial access to Reports & Inventory module per customer request"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          onClick={() => toggleMutation.mutate()}
          variant="contained"
          disabled={toggleMutation.isPending}
          startIcon={<Sparkles size={18} />}
          sx={{
            borderRadius: '12px',
            fontWeight: 800,
            textTransform: 'none',
            px: 3.5,
            py: 1,
            backgroundColor: '#10B981',
            '&:hover': { backgroundColor: '#059669' },
          }}
        >
          {toggleMutation.isPending ? 'Saving...' : 'Save Feature Permissions'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
