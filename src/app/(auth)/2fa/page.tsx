'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from 'next/link';
import { Scissors } from 'lucide-react';
import { GuestGuard } from '@/shared/components/auth/GuestGuard';

export default function TwoFactorAuthPage() {
  const [otp, setOtp] = useState(['2', '8', '4', '6', '1', '7']);
  const [rememberDevice, setRememberDevice] = useState(true);

  const handleChange = (val: string, index: number) => {
    if (val.length <= 1) {
      const updated = [...otp];
      updated[index] = val;
      setOtp(updated);
    }
  };

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
          <Typography variant="h5" color="#111827" sx={{ fontWeight: 800, mb: 1 }}>
            Two Factor Authentication
          </Typography>
          <Typography variant="body2" color="#6B7280" sx={{ fontSize: '0.875rem', mb: 3.5 }}>
            Enter the 6-digit code from your authenticator app.
          </Typography>

          {/* 6 OTP Input Boxes */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 3 }}>
            {otp.map((digit, idx) => (
              <Box
                key={idx}
                component="input"
                maxLength={1}
                value={digit}
                onChange={(e: any) => handleChange(e.target.value, idx)}
                sx={{
                  width: 48,
                  height: 52,
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FAFAFC',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  color: '#111827',
                  outline: 'none',
                  '&:focus': {
                    borderColor: '#7C3AED',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 0px 0px 3px rgba(124, 58, 237, 0.12)',
                  },
                }}
              />
            ))}
          </Box>

          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <FormControlLabel
              control={<Checkbox checked={rememberDevice} onChange={(e) => setRememberDevice(e.target.checked)} sx={{ color: '#D1D5DB', '&.Mui-checked': { color: '#7C3AED' } }} />}
              label={<Typography variant="body2" color="#4B5563" sx={{ fontSize: '0.8125rem' }}>Remember this device for 30 days</Typography>}
            />
          </Box>

          <Button
            component={Link}
            href="/dashboard"
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
              mb: 2,
              '&:hover': { backgroundColor: '#5B21B6' },
            }}
          >
            Verify Code
          </Button>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600, cursor: 'pointer' }}>
              Try another way
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem' }}>
            Having trouble? <Link href="#" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none' }}>Contact Support</Link>
          </Typography>
        </Box>
      </Box>
    </GuestGuard>
  );
}
