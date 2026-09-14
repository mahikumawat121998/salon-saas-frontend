'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from 'next/link';
import { Scissors, MailCheck, CheckCircle2 } from 'lucide-react';
import { GuestGuard } from '@/shared/components/auth/GuestGuard';

export default function InvitationAcceptedPage() {
  return (
    <GuestGuard>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          backgroundColor: '#FAF9FE',
          backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.05) 0%, transparent 50%)',
        }}
      >
        {/* Header Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 8px 20px rgba(124, 58, 237, 0.3)',
            }}
          >
            <Scissors size={24} color="#FFFFFF" />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
              SalonOS
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
              Salon Management System
            </Typography>
          </Box>
        </Box>

        {/* Main Card */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 440,
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            p: { xs: 3.5, sm: 4.5 },
            boxShadow: '0px 24px 60px rgba(124, 58, 237, 0.08), 0px 4px 16px rgba(0, 0, 0, 0.02)',
            border: '1px solid rgba(230, 232, 240, 0.8)',
            textAlign: 'center',
          }}
        >
          {/* Open Envelope Icon with Checkmark Badge */}
          <Box sx={{ position: 'relative', width: 72, height: 72, mx: 'auto', mb: 2.5 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '24px',
                backgroundColor: '#F3E8FF',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 10px 24px rgba(124, 58, 237, 0.18)',
              }}
            >
              <MailCheck size={36} />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}
            >
              <CheckCircle2 size={16} />
            </Box>
          </Box>

          <Typography variant="h5" color="#111827" sx={{ fontWeight: 800, mb: 1 }}>
            Invitation Accepted!
          </Typography>

          <Typography variant="body2" color="#6B7280" sx={{ fontSize: '0.875rem', mb: 1 }}>
            You have been invited to join
          </Typography>

          <Typography variant="subtitle1" color="#111827" sx={{ fontWeight: 800, mb: 1 }}>
            Beauty Lounge
          </Typography>

          <Chip label="Role: Manager" size="small" sx={{ backgroundColor: '#F3E8FF', color: '#7C3AED', fontWeight: 800, mb: 3 }} />

          <Typography variant="body2" color="#6B7280" sx={{ fontSize: '0.84rem', lineHeight: 1.5, mb: 3.5 }}>
            You can now set up your account and start managing your salon.
          </Typography>

          <Button
            component={Link}
            href="/create-password"
            fullWidth
            variant="contained"
            sx={{
              py: 1.4,
              borderRadius: '12px',
              backgroundColor: '#6D28D9',
              fontSize: '0.95rem',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0px 8px 20px rgba(109, 40, 217, 0.3)',
              mb: 2.5,
              '&:hover': { backgroundColor: '#5B21B6' },
            }}
          >
            Continue
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
            <Link href="#" style={{ color: '#EF4444', fontWeight: 700, textDecoration: 'none' }}>
              Decline Invitation
            </Link>
          </Typography>
        </Box>
      </Box>
    </GuestGuard>
  );
}
