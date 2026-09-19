'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { X, Building2, Mail, Lock, Key, Globe, DollarSign, Sparkles } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiService } from '@/services/api/admin.service';
import { QUERY_KEYS } from '@/config/query-keys';
import { showToast } from '@/shared/components/Toast';

interface CreateTenantModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTenantModal({ open, onClose }: CreateTenantModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('SalonOwner@123');
  const [planId, setPlanId] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [currency, setCurrency] = useState('INR');

  // Fetch available Subscription Plans for dropdown
  const { data: plans = [], isLoading: isPlansLoading } = useQuery({
    queryKey: QUERY_KEYS.admin.plans,
    queryFn: () => adminApiService.getPlans(),
    enabled: open,
  });

  const createTenantMutation = useMutation({
    mutationFn: (paymentDetails?: any) =>
      adminApiService.createTenant({
        name,
        ownerEmail,
        ownerPassword,
        planId: planId || (plans[0]?.id ?? ''),
        timezone,
        currency,
        ...paymentDetails,
      }),
    onSuccess: (data) => {
      showToast.success('Salon Onboarded Successfully', `Registered ${data.name} with owner ${data.ownerEmail}`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.tenants() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.metrics });
      onClose();
      // Reset form
      setName('');
      setOwnerEmail('');
      setOwnerPassword('SalonOwner@123');
      setIsProcessingPayment(false);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to onboard salon tenant';
      showToast.error('Registration Failed', Array.isArray(msg) ? msg.join(', ') : msg);
      setIsProcessingPayment(false);
    },
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setOwnerPassword(pass);
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ownerEmail || !ownerPassword) {
      showToast.error('Missing Fields', 'Please fill in Salon Name, Owner Email and Password');
      return;
    }

    const selectedPlanId = planId || (plans[0]?.id ?? '');
    const plan = plans.find((p: any) => p.id === selectedPlanId);

    if (plan && plan.monthlyPrice > 0) {
      setIsProcessingPayment(true);
      try {
        const loaded = await loadRazorpay();
        if (!loaded) {
          showToast.error('Payment Error', 'Failed to load Razorpay SDK');
          setIsProcessingPayment(false);
          return;
        }

        const orderInfo = await adminApiService.createOnboardingOrder({ planId: selectedPlanId });

        if (orderInfo.orderId) {
          const options = {
            key: orderInfo.keyId,
            amount: orderInfo.amount,
            currency: orderInfo.currency,
            name: 'SalonNO',
            description: `Onboarding: ${name} (${plan.name})`,
            order_id: orderInfo.orderId,
            handler: function (response: any) {
              createTenantMutation.mutate({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
            },
            prefill: {
              name: name,
              email: ownerEmail,
            },
            theme: {
              color: '#7C3AED',
            },
            modal: {
              ondismiss: function () {
                setIsProcessingPayment(false);
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function (response: any) {
             showToast.error('Payment Failed', response.error.description);
          });
          rzp.open();
        } else {
          createTenantMutation.mutate({});
        }
      } catch (err: any) {
        setIsProcessingPayment(false);
        showToast.error('Payment Failed', err?.message || 'Could not initiate payment');
      }
    } else {
      createTenantMutation.mutate({});
    }
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
              background: 'linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.3)',
            }}
          >
            <Building2 size={22} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary' }}>
              Onboard New Salon Tenant
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Register salon, create owner credentials & assign subscription tier
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Salon Name */}
          <TextField
            fullWidth
            required
            label="Salon Brand Name"
            placeholder="e.g. Velvet & Vine Luxury Spa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Building2 size={18} color="#7C3AED" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Owner Email */}
          <TextField
            fullWidth
            required
            type="email"
            label="Salon Owner Email Address"
            placeholder="owner@velvetvine.com"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} color="#9CA3AF" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Owner Initial Password */}
          <TextField
            fullWidth
            required
            label="Initial Owner Password"
            value={ownerPassword}
            onChange={(e) => setOwnerPassword(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} color="#9CA3AF" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button size="small" onClick={generatePassword} sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.72rem' }}>
                      Auto-Generate
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Subscription Plan Selection */}
          <TextField
            select
            fullWidth
            label="Subscription Plan Tier"
            value={planId || (plans[0]?.id ?? '')}
            onChange={(e) => setPlanId(e.target.value)}
            disabled={isPlansLoading}
          >
            {plans.map((p: any) => (
              <MenuItem key={p.id} value={p.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {p.name} ({p.code})
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ₹{p.monthlyPrice}/mo • {p.maxStaff} Staff
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          {/* Store Settings: Timezone & Currency */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Store Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
              <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
              <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
              <MenuItem value="UTC">UTC</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value="INR">INR (₹)</MenuItem>
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
              <MenuItem value="GBP">GBP (£)</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createTenantMutation.isPending || isProcessingPayment}
            startIcon={isProcessingPayment ? <CircularProgress size={18} color="inherit" /> : <Sparkles size={18} />}
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
            {createTenantMutation.isPending || isProcessingPayment ? 'Processing...' : 'Onboard Salon & Pay'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
