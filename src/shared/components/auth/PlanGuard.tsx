'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import { Lock, Sparkles, ShieldAlert, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useTenantStore } from '@/core/stores/tenant.store';
import { useAuthStore } from '@/core/stores/auth.store';

interface PlanGuardProps {
  children: React.ReactNode;
  module: 'APPOINTMENTS' | 'CUSTOMERS' | 'CATALOG' | 'STAFF' | 'BILLING' | 'INVENTORY' | 'REPORTS' | 'MARKETING' | 'WHATSAPP';
  fallback?: React.ReactNode;
}

export function PlanGuard({ children, module, fallback }: PlanGuardProps) {
  const { activeTenant } = useTenantStore();
  const user = useAuthStore((s) => s.user);

  // Super Admins bypass frontend plan gating
  if (user?.isSuperAdmin) {
    return <>{children}</>;
  }

  // Active tenant plan module check
  const planCode = activeTenant?.plan?.toUpperCase() || 'STARTER';
  
  // Default module access mapping if tenant store doesn't specify explicit modules list
  const isModuleAllowed = () => {
    if (planCode === 'ENTERPRISE' || planCode === 'PRO_PLUS') return true;
    if (planCode === 'PRO') {
      return module !== 'MARKETING' && module !== 'WHATSAPP';
    }
    // Starter / Free plan
    return ['APPOINTMENTS', 'CUSTOMERS', 'CATALOG', 'STAFF', 'BILLING'].includes(module);
  };

  if (isModuleAllowed()) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: '28px',
          textAlign: 'center',
          backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
          border: (t) => `1px solid ${t.palette.divider}`,
          boxShadow: '0px 24px 48px rgba(15, 23, 42, 0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow accent */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '20px',
            backgroundColor: 'rgba(124, 58, 237, 0.12)',
            color: '#7C3AED',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2.5,
          }}
        >
          <Lock size={32} />
        </Box>

        <Box sx={{ mb: 1 }}>
          <Chip
            label={`${module} MODULE LOCKED`}
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: '0.65rem',
              backgroundColor: 'rgba(124, 58, 237, 0.12)',
              color: '#A78BFA',
              px: 1,
            }}
          />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5, color: 'text.primary' }}>
          Upgrade Subscription to Access {module}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 540, mx: 'auto', mb: 4 }}>
          Your current plan (<strong>{activeTenant?.plan?.toUpperCase() || 'STARTER'}</strong>) does not include access to advanced {module.toLowerCase()} features. Upgrade your subscription plan to unlock full capabilities.
        </Typography>

        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            p: 2,
            borderRadius: '16px',
            backgroundColor: (t) => (t.palette.mode === 'dark' ? '#0B0F17' : '#F8FAFC'),
            mb: 4,
            textAlign: 'left',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle2 size={18} color="#10B981" />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Full {module} Access
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle2 size={18} color="#10B981" />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Unlimited Outlets & Staff
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle2 size={18} color="#10B981" />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Priority Platform Support
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Sparkles size={18} />}
            sx={{
              borderRadius: '14px',
              fontWeight: 800,
              px: 4,
              py: 1.2,
              background: 'linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #6D28D9 0%, #A855F7 100%)' },
            }}
            onClick={() => {
              alert('Please contact your SAMs Super Admin or Account Manager to upgrade your plan tier.');
            }}
          >
            Request Plan Upgrade
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
