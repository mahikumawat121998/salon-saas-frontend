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
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { X, Zap, DollarSign, Users, Building, Sparkles } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiService } from '@/services/api/admin.service';
import { QUERY_KEYS } from '@/config/query-keys';
import { showToast } from '@/shared/components/Toast';

interface CreateEditPlanModalProps {
  open: boolean;
  onClose: () => void;
  planToEdit?: any;
}

const AVAILABLE_MODULES = [
  { code: 'APPOINTMENTS', label: 'Appointments Booking & Calendar' },
  { code: 'CUSTOMERS', label: 'Client CRM & Notes' },
  { code: 'SERVICES', label: 'Service Catalog & Pricing' },
  { code: 'STAFF', label: 'Staff Roster & Leaves' },
  { code: 'BILLING', label: 'Invoices & POS Checkout' },
  { code: 'INVENTORY', label: 'Inventory & Stock Control' },
  { code: 'REPORTS', label: 'Revenue & Staff Performance Reports' },
  { code: 'MARKETING', label: 'SMS Marketing Campaigns' },
  { code: 'WHATSAPP', label: 'WhatsApp Direct Confirmation Automation' },
  { code: 'PAYROLL', label: 'Payroll & Commissions' },
  { code: 'ATTENDANCE', label: 'Attendance Tracking' },
  { code: 'LEAVE', label: 'Leave Management' },
];

export function CreateEditPlanModal({ open, onClose, planToEdit }: CreateEditPlanModalProps) {
  const queryClient = useQueryClient();
  const isEditing = Boolean(planToEdit);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState<number>(1499);
  const [yearlyPrice, setYearlyPrice] = useState<number>(14990);
  const [maxOutlets, setMaxOutlets] = useState<number>(1);
  const [maxStaff, setMaxStaff] = useState<number>(10);
  const [allowedModules, setAllowedModules] = useState<string[]>([
    'APPOINTMENTS',
    'CUSTOMERS',
    'SERVICES',
    'STAFF',
    'BILLING',
  ]);

  useEffect(() => {
    if (planToEdit) {
      setName(planToEdit.name || '');
      setCode(planToEdit.code || '');
      setDescription(planToEdit.description || '');
      setMonthlyPrice(planToEdit.monthlyPrice || 0);
      setYearlyPrice(planToEdit.yearlyPrice || 0);
      setMaxOutlets(planToEdit.maxOutlets || 1);
      setMaxStaff(planToEdit.maxStaff || 5);
      setAllowedModules(planToEdit.allowedModules || ['APPOINTMENTS', 'CUSTOMERS', 'SERVICES', 'STAFF', 'BILLING']);
    } else {
      setName('');
      setCode('');
      setDescription('');
      setMonthlyPrice(1499);
      setYearlyPrice(14990);
      setMaxOutlets(1);
      setMaxStaff(10);
      setAllowedModules(['APPOINTMENTS', 'CUSTOMERS', 'SERVICES', 'STAFF', 'BILLING']);
    }
  }, [planToEdit, open]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        name,
        code: code.toUpperCase(),
        description,
        monthlyPrice: Number(monthlyPrice),
        yearlyPrice: Number(yearlyPrice),
        maxOutlets: Number(maxOutlets),
        maxStaff: Number(maxStaff),
        enableInventory: allowedModules.includes('INVENTORY'),
        enableReports: allowedModules.includes('REPORTS'),
        enableMarketing: allowedModules.includes('MARKETING'),
        enableWhatsApp: allowedModules.includes('WHATSAPP'),
        allowedModules,
      };

      if (isEditing) {
        return adminApiService.updatePlan(planToEdit.id, payload);
      }
      return adminApiService.createPlan(payload);
    },
    onSuccess: (data) => {
      showToast.success(
        isEditing ? 'Plan Updated' : 'Subscription Plan Created',
        `${data.name} has been ${isEditing ? 'updated' : 'created'} successfully`
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.plans });
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save plan';
      showToast.error('Save Failed', Array.isArray(msg) ? msg.join(', ') : msg);
    },
  });

  const handleModuleToggle = (modCode: string) => {
    setAllowedModules((prev) =>
      prev.includes(modCode) ? prev.filter((m) => m !== modCode) : [...prev, modCode]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      showToast.error('Validation Error', 'Plan Name and Code are required');
      return;
    }
    saveMutation.mutate();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
              background: 'linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.3)',
            }}
          >
            <Zap size={22} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary' }}>
              {isEditing ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Configure pricing, operational limits & included feature modules
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Grid container spacing={2}>
            {/* Plan Name */}
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                fullWidth
                required
                label="Plan Display Name"
                placeholder="e.g. Professional Plan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            {/* Plan Code */}
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                required
                label="Unique Plan Code"
                placeholder="e.g. PRO"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Zap size={16} color="#7C3AED" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Plan Description"
            placeholder="e.g. Ideal for multi-staff salons needing Inventory & Analytics"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Grid container spacing={2}>
            {/* Monthly Price */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Monthly Price (INR)"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  },
                }}
              />
            </Grid>

            {/* Yearly Price */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Yearly Price (INR)"
                value={yearlyPrice}
                onChange={(e) => setYearlyPrice(Number(e.target.value))}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  },
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {/* Max Outlets */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Max Outlets Included"
                value={maxOutlets}
                onChange={(e) => setMaxOutlets(Number(e.target.value))}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Building size={18} color="#9CA3AF" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Max Staff */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Max Staff Members Included"
                value={maxStaff}
                onChange={(e) => setMaxStaff(Number(e.target.value))}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Users size={18} color="#9CA3AF" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Module Permissions Checklist */}
          <Box sx={{ pt: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
              Included Feature Modules:
            </Typography>
            <Grid container spacing={1}>
              {AVAILABLE_MODULES.map((m) => (
                <Grid size={{ xs: 12, sm: 6 }} key={m.code}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allowedModules.includes(m.code)}
                        onChange={() => handleModuleToggle(m.code)}
                        color="secondary"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {m.label}
                      </Typography>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saveMutation.isPending}
            startIcon={<Sparkles size={18} />}
            sx={{
              borderRadius: '12px',
              fontWeight: 800,
              textTransform: 'none',
              px: 3.5,
              py: 1,
              backgroundColor: '#7C3AED',
              '&:hover': { backgroundColor: '#6D28D9' },
            }}
          >
            {saveMutation.isPending ? 'Saving...' : isEditing ? 'Update Plan' : 'Create Plan'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
