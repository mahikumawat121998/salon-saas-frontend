'use client';

import React, { useState, Suspense } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Scissors, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { GuestGuard } from '@/shared/components/auth/GuestGuard';
import { authApiService } from '@/services/api/auth.service';

import { useTheme } from '@mui/material/styles';

function ResetPasswordForm() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '#E5E7EB' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#EF4444' };
    if (score === 2 || score === 3) return { score: 3, label: 'Medium', color: '#F59E0B' };
    return { score: 4, label: 'Strong', color: '#10B981' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg('Invalid or missing password reset token. Please request a new link.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please check and try again.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await authApiService.resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || 'Failed to reset password. The link may have expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 440,
        backgroundColor: isDark ? '#151E2E' : '#FFFFFF',
        borderRadius: '24px',
        p: { xs: 3.5, sm: 4.5 },
        boxShadow: isDark
          ? '0px 24px 60px rgba(0, 0, 0, 0.4)'
          : '0px 24px 60px rgba(124, 58, 237, 0.08), 0px 4px 16px rgba(0, 0, 0, 0.02)',
        border: isDark
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid rgba(230, 232, 240, 0.8)',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: isDark ? '#F8FAFC' : '#111827' }}>
        Reset Password
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.875rem', mb: 3.5, color: isDark ? '#94A3B8' : '#6B7280' }}>
        Enter your new password below.
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', textAlign: 'left' }}>
          {errorMsg}
        </Alert>
      )}

      {!token && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px', textAlign: 'left' }}>
          No reset token provided. Please click the reset link sent to your email or request a new one.
        </Alert>
      )}

      {success ? (
        <Box
          sx={{
            p: 3,
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
            border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #D1FAE5',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
            <CheckCircle2 size={42} color="#10B981" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, color: isDark ? '#34D399' : '#065F46' }}>
            Password Reset Complete!
          </Typography>
          <Typography variant="body2" sx={{ mb: 2.5, color: isDark ? '#6EE7B7' : '#047857' }}>
            Your password has been successfully updated. You can now log in with your new credentials.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push('/login')}
            sx={{
              py: 1.2,
              borderRadius: '12px',
              backgroundColor: '#10B981',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#059669' },
            }}
          >
            Go to Login
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ textAlign: 'left' }}>
          {/* New Password */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.8, display: 'block', color: isDark ? '#E2E8F0' : '#374151' }}>
              New Password
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter new password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading || !token}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start" sx={{ color: isDark ? '#94A3B8' : '#9CA3AF' }}><Lock size={18} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNew(!showNew)} size="small" sx={{ color: isDark ? '#94A3B8' : '#9CA3AF' }}>
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FAFAFC',
                    color: isDark ? '#F8FAFC' : '#111827',
                    fontSize: '0.9375rem',
                    '& input': {
                      color: isDark ? '#F8FAFC' : '#111827',
                    },
                    '& fieldset': { borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#E5E7EB' },
                    '&:hover fieldset': { borderColor: '#A78BFA' },
                    '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                  },
                },
              }}
            />

            {/* Password Strength Indicator */}
            {newPassword && (
              <Box sx={{ mt: 1.2 }}>
                <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                  <Box sx={{ height: 4, flex: 1, borderRadius: 2, backgroundColor: strength.score >= 1 ? strength.color : '#E5E7EB' }} />
                  <Box sx={{ height: 4, flex: 1, borderRadius: 2, backgroundColor: strength.score >= 2 ? strength.color : '#E5E7EB' }} />
                  <Box sx={{ height: 4, flex: 1, borderRadius: 2, backgroundColor: strength.score >= 3 ? strength.color : '#E5E7EB' }} />
                  <Box sx={{ height: 4, flex: 1, borderRadius: 2, backgroundColor: strength.score >= 4 ? strength.color : '#E5E7EB' }} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                  Password strength: <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                </Typography>
              </Box>
            )}
          </Box>

          {/* Confirm Password */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.8, display: 'block', color: isDark ? '#E2E8F0' : '#374151' }}>
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              placeholder="Confirm new password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || !token}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start" sx={{ color: isDark ? '#94A3B8' : '#9CA3AF' }}><Lock size={18} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm(!showConfirm)} size="small" sx={{ color: isDark ? '#94A3B8' : '#9CA3AF' }}>
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FAFAFC',
                    color: isDark ? '#F8FAFC' : '#111827',
                    fontSize: '0.9375rem',
                    '& input': {
                      color: isDark ? '#F8FAFC' : '#111827',
                    },
                    '& fieldset': { borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#E5E7EB' },
                    '&:hover fieldset': { borderColor: '#A78BFA' },
                    '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                  },
                },
              }}
            />
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !token}
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
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Reset Password'}
          </Button>
        </Box>
      )}

      <Box sx={{ textAlign: 'center' }}>
        <Link
          href="/login"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#A78BFA', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </Box>
    </Box>
  );
}

export default function ResetPasswordPage() {
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
            <Typography variant="h5" sx={{ fontWeight: 800, color: (t) => (t.palette.mode === 'dark' ? '#F8FAFC' : '#111827'), lineHeight: 1.1 }}>
              SalonNO
            </Typography>
            <Typography variant="caption" sx={{ color: (t) => (t.palette.mode === 'dark' ? '#94A3B8' : '#6B7280'), fontSize: '0.75rem' }}>
              Salon Management System
            </Typography>
          </Box>
        </Box>

        <Suspense fallback={<CircularProgress sx={{ color: '#7C3AED' }} />}>
          <ResetPasswordForm />
        </Suspense>
      </Box>
    </GuestGuard>
  );
}
