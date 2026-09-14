'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { Lock, Eye, EyeOff, Scissors, Check } from 'lucide-react';
import { GuestGuard } from '@/shared/components/auth/GuestGuard';

export default function CreatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validations = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'One number or special character', valid: /[0-9!@#$%^&*]/.test(password) },
  ];

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
            Create Your Password
          </Typography>
          <Typography variant="body2" color="#6B7280" sx={{ fontSize: '0.875rem', mb: 3.5 }}>
            Set a strong password to secure your account.
          </Typography>

          <Box component="form" noValidate sx={{ textAlign: 'left' }}>
            {/* New Password */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="#374151" sx={{ fontWeight: 600, mb: 0.8, display: 'block' }}>
                New Password
              </Typography>
              <TextField
                fullWidth
                placeholder="••••••••••••"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} size="small" sx={{ color: '#9CA3AF' }}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '12px', backgroundColor: '#FAFAFC', fontSize: '0.9375rem' },
                  },
                }}
              />
            </Box>

            {/* Validation Checklist */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 2.5, pl: 0.5 }}>
              {validations.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check size={14} color={item.valid ? '#10B981' : '#9CA3AF'} />
                  <Typography variant="caption" sx={{ color: item.valid ? '#10B981' : '#6B7280', fontSize: '0.75rem', fontWeight: item.valid ? 700 : 500 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Confirm Password */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="#374151" sx={{ fontWeight: 600, mb: 0.8, display: 'block' }}>
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                placeholder="••••••••••••"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                slotProps={{
                  input: {
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
                '&:hover': { backgroundColor: '#5B21B6' },
              }}
            >
              Create Password
            </Button>
          </Box>
        </Box>
      </Box>
    </GuestGuard>
  );
}
