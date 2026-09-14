'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { FullScreenLoader } from '@/shared/components/loaders/FullScreenLoader';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface SuperAdminGuardProps {
  children: React.ReactNode;
}

export function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  const { isHydrated, isAuthenticated, user } = useAuth();
  const router = useRouter();

  const isSuperAdminUser =
    Boolean(user?.isSuperAdmin) ||
    user?.roles?.includes('super_admin') ||
    user?.roles?.includes('SUPER_ADMIN') ||
    user?.email === 'superadmin@sams.com' ||
    user?.email === 'admin@salon.com';

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login?redirectTo=/admin/tenants');
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    return <FullScreenLoader message="Verifying Super Admin Credentials..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isSuperAdminUser) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          backgroundColor: (t) => (t.palette.mode === 'dark' ? '#0B0F17' : '#F8FAFC'),
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '24px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2.5,
          }}
        >
          <ShieldAlert size={36} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', mb: 1 }}>
          403 — Super Admin Access Required
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 3.5 }}>
          Your current account (<strong>{user?.email}</strong>) does not have Super Admin platform control privileges.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            component={Link}
            href="/dashboard"
            sx={{ borderRadius: '12px', fontWeight: 800, px: 3, backgroundColor: '#7C3AED' }}
          >
            Go to Tenant Dashboard
          </Button>
          <Button
            variant="outlined"
            component={Link}
            href="/login?redirectTo=/admin/tenants"
            sx={{ borderRadius: '12px', fontWeight: 700, px: 3 }}
          >
            Switch Account
          </Button>
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
}

export default SuperAdminGuard;
