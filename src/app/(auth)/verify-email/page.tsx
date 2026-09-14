'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { Mail, Scissors, ArrowLeft } from 'lucide-react';
import { GuestGuard } from '@/shared/components/auth/GuestGuard';

export default function VerifyEmailPage() {
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
          {/* Email Circle Icon */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              backgroundColor: '#F3E8FF',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
              boxShadow: '0px 10px 24px rgba(124, 58, 237, 0.15)',
            }}
          >
            <Mail size={32} />
          </Box>

          <Typography variant="h5" color="#111827" sx={{ fontWeight: 800, mb: 1 }}>
            Verify Your Email
          </Typography>
          <Typography variant="body2" color="#6B7280" sx={{ fontSize: '0.875rem', lineHeight: 1.6, mb: 3 }}>
            We&apos;ve sent a verification link to <strong style={{ color: '#111827' }}>rahul.mehta@example.com</strong>. Please check your inbox and click the link to verify your email address.
          </Typography>

          {/* Spam / Resend Callout Card */}
          <Box sx={{ p: 2, borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', mb: 3, textAlign: 'left' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem', lineHeight: 1.4, display: 'block' }}>
              <strong>Didn&apos;t receive the email?</strong> Check your spam folder or resend the email.
            </Typography>
          </Box>

          <Button
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
              mb: 3,
              '&:hover': { backgroundColor: '#5B21B6' },
            }}
          >
            Resend Email
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
