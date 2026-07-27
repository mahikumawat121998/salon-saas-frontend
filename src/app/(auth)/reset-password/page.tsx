'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Link from 'next/link';
import { Lock, Eye, EyeOff, Scissors, ArrowLeft } from 'lucide-react';
import { GuestGuard } from '@/shared/components/auth/GuestGuard';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        {/* Logo Header */}
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

        {/* Main Form Card */}
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
            Reset Password
          </Typography>
          <Typography variant="body2" color="#6B7280" sx={{ fontSize: '0.875rem', mb: 3.5 }}>
            Enter your new password below.
          </Typography>

          <Box component="form" noValidate sx={{ textAlign: 'left' }}>
            {/* New Password */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" color="#374151" sx={{ fontWeight: 600, mb: 0.8, display: 'block' }}>
                New Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter new password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start" sx={{ color: '#9CA3AF' }}><Lock size={18} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNew(!showNew)} size="small" sx={{ color: '#9CA3AF' }}>
                          {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '12px', backgroundColor: '#FAFAFC', fontSize: '0.9375rem' },
                  },
                }}
              />

              {/* Password Strength Indicator */}
              <Box sx={{ mt: 1.2 }}>
                <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                  <Box sx={{ height: 4, flex: 1, borderRadius: 2, backgroundColor: '#10B981' }} />
                  <Box sx={{ height: 4, flex: 1, borderRadius: 2, backgroundColor: '#10B981' }} />
                  <Box sx={{ height: 4, flex: 1, borderRadius: 2, backgroundColor: '#10B981' }} />
                  <Box sx={{ height: 4, flex: 1, borderRadius: 2, backgroundColor: '#10B981' }} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                  Password strength: <span style={{ color: '#10B981', fontWeight: 700 }}>Strong</span>
                </Typography>
              </Box>
            </Box>

            {/* Confirm Password */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="#374151" sx={{ fontWeight: 600, mb: 0.8, display: 'block' }}>
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Confirm new password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start" sx={{ color: '#9CA3AF' }}><Lock size={18} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirm(!showConfirm)} size="small" sx={{ color: '#9CA3AF' }}>
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '12px', backgroundColor: '#FAFAFC', fontSize: '0.9375rem' },
                  },
                }}
              />
            </Box>

            {/* Submit Button */}
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
              Reset Password
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Link
              href="/login"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}
            >
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </Box>
        </Box>
      </Box>
    </GuestGuard>
  );
}
