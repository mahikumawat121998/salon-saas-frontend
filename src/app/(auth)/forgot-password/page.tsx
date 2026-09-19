'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import { Mail, Scissors, ArrowLeft, ExternalLink } from 'lucide-react';
import { GuestGuard } from '@/shared/components/auth/GuestGuard';
import { authApiService } from '@/services/api/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await authApiService.forgotPassword(email.trim());
      setSubmitted(true);
      if (res.resetUrl) {
        setResetUrl(res.resetUrl);
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || 'Failed to process password reset. Please try again.'
      );
    } finally {
      setLoading(false);
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
          backgroundColor: (t) => (t.palette.mode === 'dark' ? '#0B0F17' : '#FAF9FE'),
          backgroundImage: (t) =>
            t.palette.mode === 'dark'
              ? 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)'
              : 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.05) 0%, transparent 50%)',
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
            <Typography variant="h5" sx={{ fontWeight: 800, color: (t) => (t.palette.mode === 'dark' ? '#F8FAFC' : '#111827'), lineHeight: 1.1 }}>
              SalonNO
            </Typography>
            <Typography variant="caption" sx={{ color: (t) => (t.palette.mode === 'dark' ? '#94A3B8' : '#6B7280'), fontSize: '0.75rem' }}>
              Salon Management System
            </Typography>
          </Box>
        </Box>

        {/* Main Card */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 440,
            backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            borderRadius: '24px',
            p: { xs: 3.5, sm: 4.5 },
            boxShadow: (t) =>
              t.palette.mode === 'dark'
                ? '0px 24px 60px rgba(0, 0, 0, 0.4)'
                : '0px 24px 60px rgba(124, 58, 237, 0.08), 0px 4px 16px rgba(0, 0, 0, 0.02)',
            border: (t) =>
              t.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(230, 232, 240, 0.8)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: (t) => (t.palette.mode === 'dark' ? '#F8FAFC' : '#111827') }}>
            Forgot Password?
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.5, mb: 3.5, color: (t) => (t.palette.mode === 'dark' ? '#94A3B8' : '#6B7280') }}>
            No worries! Enter your email address and we&apos;ll send you a link to reset your password.
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', textAlign: 'left' }}>
              {errorMsg}
            </Alert>
          )}

          {submitted ? (
            <Box
              sx={{
                p: 2.5,
                borderRadius: '14px',
                backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5'),
                border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #D1FAE5'),
                mb: 3,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5, color: (t) => (t.palette.mode === 'dark' ? '#34D399' : '#065F46') }}>
                Reset Link Sent!
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: resetUrl ? 1.5 : 0, color: (t) => (t.palette.mode === 'dark' ? '#6EE7B7' : '#047857') }}>
                If an account with <strong>{email}</strong> exists, instructions to reset your password have been issued.
              </Typography>
              {resetUrl && (
                <Box
                  sx={{
                    mt: 1.5,
                    p: 1.5,
                    borderRadius: '10px',
                    backgroundColor: (t) => (t.palette.mode === 'dark' ? '#0F172A' : '#FFFFFF'),
                    border: '1px dashed #10B981',
                    textAlign: 'left',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: (t) => (t.palette.mode === 'dark' ? '#94A3B8' : '#475569') }}>
                    🛠️ Dev Shortcut (Direct Reset Link):
                  </Typography>
                  <Link
                    href={resetUrl}
                    style={{
                      wordBreak: 'break-all',
                      color: '#A78BFA',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    Open Reset Password Page <ExternalLink size={14} />
                  </Link>
                </Box>
              )}
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.8, display: 'block', color: (t) => (t.palette.mode === 'dark' ? '#E2E8F0' : '#374151') }}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: (t) => (t.palette.mode === 'dark' ? '#94A3B8' : '#9CA3AF') }}>
                          <Mail size={18} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#FAFAFC'),
                        color: (t) => (t.palette.mode === 'dark' ? '#F8FAFC' : '#111827'),
                        fontSize: '0.9375rem',
                        '& input': {
                          color: (t) => (t.palette.mode === 'dark' ? '#F8FAFC' : '#111827'),
                        },
                        '& fieldset': { borderColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#E5E7EB') },
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
                disabled={loading}
                sx={{
                  py: 1.4,
                  borderRadius: '12px',
                  backgroundColor: '#7C3AED',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0px 8px 20px rgba(124, 58, 237, 0.35)',
                  mb: 3,
                  '&:hover': { backgroundColor: '#6D28D9' },
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Send Reset Link'}
              </Button>
            </Box>
          )}

          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#A78BFA',
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
