'use client';

import { useTenantStore } from '@/core/stores/tenant.store';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Building } from 'lucide-react';
import React from 'react';

export interface TenantGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function TenantGuard({ children, fallback }: TenantGuardProps) {
  const { activeTenantId } = useTenantStore();

  if (!activeTenantId) {
    if (fallback) return <>{fallback}</>;

    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 4,
            borderRadius: '24px',
            backgroundColor: 'background.paper',
            border: (t) => `1px solid ${t.palette.divider}`,
            boxShadow: '0px 20px 40px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Building size={32} />
          </Box>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            No Active Salon Selected
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please select an active salon branch to continue accessing your dashboard.
          </Typography>

          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
            Select Active Salon
          </Button>
        </Box>
      </Container>
    );
  }

  return <>{children}</>;
}

export default TenantGuard;
