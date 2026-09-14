'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { Scissors, Clock, Lock, ArrowLeft } from 'lucide-react';
import { GuestGuard } from '@/shared/components/auth/GuestGuard';

export default function SessionExpiredPage() {
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
          {/* Clock & Lock Graphic Circle */}
          <Box sx={{ position: 'relative', width: 88, height: 88, mx: 'auto', mb: 3 }}>
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                backgroundColor: '#F3E8FF',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 10px 30px rgba(124, 58, 237, 0.2)',
              }}
            >
              <Clock size={44} />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 32,
                height: 32,
                borderRadius: '10px',
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}
            >
              <Lock size={18} />
            </Box>
          </Box>

          <Typography variant="h5" color="#111827" sx={{ fontWeight: 800, mb: 1 }}>
            Session Expired
          </Typography>

          <Typography variant="body2" color="#6B7280" sx={{ fontSize: '0.875rem', lineHeight: 1.6, mb: 3.5 }}>
            Your session has expired due to inactivity. Please login again to continue.
          </Typography>

          <Button
            component={Link}
            href="/login"
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
            Login Again
          </Button>

          <Link
            href="/login"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </Box>
      </Box>
    </GuestGuard>
  );
}
