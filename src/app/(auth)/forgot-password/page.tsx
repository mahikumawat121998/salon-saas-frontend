'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Link from 'next/link';
import { Mail, Scissors, ArrowLeft } from 'lucide-react';
import { GuestGuard } from '@/shared/components/auth/GuestGuard';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            Forgot Password?
          </Typography>
          <Typography variant="body2" color="#6B7280" sx={{ fontSize: '0.875rem', lineHeight: 1.5, mb: 3.5 }}>
            No worries! Enter your email address and we&apos;ll send you a link to reset your password.
          </Typography>

          {submitted ? (
            <Box sx={{ p: 2.5, borderRadius: '14px', backgroundColor: '#ECFDF5', border: '1px solid #D1FAE5', mb: 3 }}>
              <Typography variant="subtitle2" color="#065F46" sx={{ fontWeight: 800, mb: 0.5 }}>
                Reset Link Sent!
              </Typography>
              <Typography variant="caption" color="#047857">
                Check your inbox for further instructions to reset your password.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography variant="caption" color="#374151" sx={{ fontWeight: 600, mb: 0.8, display: 'block' }}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: '#9CA3AF' }}>
                          <Mail size={18} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        backgroundColor: '#FAFAFC',
                        fontSize: '0.9375rem',
                        '& fieldset': { borderColor: '#E5E7EB' },
                        '&:hover fieldset': { borderColor: '#A78BFA' },
                        '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                      },
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
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
                Send Reset Link
              </Button>
            </Box>
          )}

          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#7C3AED',
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </Box>
      </Box>
    </GuestGuard>
  );
}
