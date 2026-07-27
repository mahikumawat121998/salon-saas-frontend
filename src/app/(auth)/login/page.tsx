'use client';

import { useAuth } from '@/providers/AuthProvider';
import { authService } from '@/core/auth/auth-service';
import { useTenantStore } from '@/core/stores/tenant.store';
import { axiosClient } from '@/services/api/axios-client';
import { API_ROUTES } from '@/config/api-routes';
import { GuestGuard } from '@/shared/components/auth/GuestGuard';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  BarChart3,
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Package,
  Scissors,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.35 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29c-.82 1.63-1.29 3.47-1.29 5.42s.47 3.79 1.29 5.42l3.99-3.15z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.12-1.96.99-3.1-.96.04-2.13.64-2.81 1.44-.61.71-1.14 1.87-1 2.99 1.07.08 2.16-.51 2.82-1.33z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const { login } = useAuth();

  const [email, setEmail] = useState('owner@urbancuts.com');
  const [password, setPassword] = useState('Owner@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // 1. Save access/session state (POST /auth/login)
      const loginRes = await authService.login({ email, password });

      login(loginRes.accessToken, loginRes.refreshToken, {
        id: loginRes.user.id,
        email: loginRes.user.email,
        name: loginRes.user.email ? loginRes.user.email.split('@')[0] : 'User',
        roles: loginRes.user.roles || [],
        permissions: ['*'],
      });

      // 2 & 3. Call GET /auth/me to fetch & store full user profile, roles, and permissions
      try {
        const meRes = await authService.getMe();
        const fullUser = {
          id: meRes.id || loginRes.user.id,
          name: meRes.email ? meRes.email.split('@')[0] : 'User',
          email: meRes.email || loginRes.user.email,
          roles: meRes.roles || loginRes.user.roles || ['OWNER'],
          permissions: meRes.permissions || ['*'],
          tenantId: meRes.tenantId || loginRes.user.tenantId,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
        login(loginRes.accessToken, loginRes.refreshToken, fullUser);
      } catch (meErr) {
        console.warn('Could not fetch /auth/me, proceeding with login payload', meErr);
      }

      // 4. Resolve available tenants & set active tenant
      try {
        const tenantRes = await axiosClient.get(API_ROUTES.tenant.current);
        const tenantData = tenantRes.data?.data || tenantRes.data;
        if (tenantData) {
          useTenantStore.getState().setActiveTenant({
            id: tenantData.id || 'tnt_beauty_lounge',
            name: tenantData.name || 'Urban Cuts',
            slug: tenantData.name ? tenantData.name.toLowerCase().replace(/\s+/g, '_') : 'urban_cuts',
            currency: tenantData.settings?.currency || 'INR',
            timezone: tenantData.settings?.timezone || 'Asia/Kolkata',
            logoUrl: '',
            plan: 'free',
          });
        }
      } catch (tenantErr) {
        console.warn('Could not fetch tenant settings, applying default tenant', tenantErr);
      }

      // 5. Redirect to the correct dashboard
      router.push(redirectTo);
    } catch (err: any) {
      console.error('API Login Error:', err);
      const apiMsg = err?.response?.data?.message || err?.message;
      if (typeof apiMsg === 'string') {
        setError(apiMsg);
      } else if (Array.isArray(apiMsg)) {
        setError(apiMsg.join(', '));
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const featureList = [
    {
      icon: <Calendar size={20} />,
      title: 'Smart Appointments',
      desc: 'Easy scheduling and calendar management',
    },
    {
      icon: <Users size={20} />,
      title: 'Staff & Performance',
      desc: 'Manage staff, roles and track performance',
    },
    {
      icon: <Package size={20} />,
      title: 'Inventory Management',
      desc: 'Track stock, products and notifications',
    },
    {
      icon: <BarChart3 size={20} />,
      title: 'Reports & Analytics',
      desc: 'Powerful insights to grow your business',
    },
  ];

  return (
    <GuestGuard>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          width: '100%',
          backgroundColor: '#FAF9FE',
        }}
      >
        {/* Left Side - Hero / Brand Section */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            width: '50%',
            position: 'relative',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 6,
            color: 'white',
            overflow: 'hidden',
          }}
        >
          {/* Background Image & Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
            }}
          >
            <Image
              src="/images/salon_login_bg.png"
              alt="SalonOS Interior"
              fill
              sizes="50vw"
              style={{ objectFit: 'cover' }}
              priority
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(180deg, rgba(15, 10, 30, 0.85) 0%, rgba(20, 15, 40, 0.92) 100%)',
              }}
            />
          </Box>

          {/* Content Wrapper */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 8px 20px rgba(124, 58, 237, 0.4)',
                }}
              >
                <Scissors size={24} color="#FFFFFF" />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  SalonOS
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.75rem' }}>
                  Salon Management System
                </Typography>
              </Box>
            </Box>

            {/* Main Headline */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: '2.75rem',
                lineHeight: 1.2,
                mb: 2,
                maxWidth: 480,
              }}
            >
              Everything you need to run your salon{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(90deg, #A78BFA 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                smarter
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                opacity: 0.8,
                fontSize: '1rem',
                mb: 5,
                maxWidth: 440,
                lineHeight: 1.6,
              }}
            >
              Manage appointments, staff, customers, inventory and grow your business.
            </Typography>

            {/* Feature List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, mb: 6 }}>
              {featureList.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(124, 58, 237, 0.2)',
                      border: '1px solid rgba(167, 139, 250, 0.3)',
                      color: '#A78BFA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.8125rem', mt: 0.3 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Bottom Security Badge */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              p: 2.5,
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              maxWidth: 420,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: 'rgba(124, 58, 237, 0.3)',
                color: '#A78BFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={22} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 700 }}>
                Secure & Reliable
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.78125rem' }}>
                Your data is always safe with us
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Side - Form Section */}
        <Box
          sx={{
            flexGrow: 1,
            width: { lg: '50%' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, sm: 6 },
            position: 'relative',
            backgroundImage:
              'radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.04) 0%, transparent 40%)',
          }}
        >
          {/* Main Card Container */}
          <Box
            sx={{
              width: '100%',
              maxWidth: 460,
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              p: { xs: 3.5, sm: 4.5 },
              boxShadow: '0px 24px 60px rgba(124, 58, 237, 0.08), 0px 4px 16px rgba(0, 0, 0, 0.02)',
              border: '1px solid rgba(230, 232, 240, 0.8)',
            }}
          >
            {/* Form Top Brand Icon */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '20px',
                  backgroundColor: '#F3E8FF',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 10px 25px rgba(124, 58, 237, 0.15)',
                }}
              >
                <Scissors size={32} />
              </Box>
            </Box>

            {/* Header Text */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" color="#111827" sx={{ fontWeight: 800 }} gutterBottom>
                Welcome Back!
              </Typography>
              <Typography variant="body2" color="#6B7280" sx={{ fontSize: '0.9375rem', mb: 2 }}>
                Login to access your SalonOS account
              </Typography>

              {/* Demo Account Quick Selector Pills */}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Chip
                  label="Tenant Owner: owner@urbancuts.com"
                  size="small"
                  onClick={() => {
                    setEmail('owner@urbancuts.com');
                    setPassword('Owner@123');
                  }}
                  sx={{
                    backgroundColor: email === 'owner@urbancuts.com' ? '#F3E8FF' : '#F3F4F6',
                    color: email === 'owner@urbancuts.com' ? '#7C3AED' : '#4B5563',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#F3E8FF', color: '#7C3AED' },
                  }}
                />
              </Box>
            </Box>

            {error && (
              <Box
                sx={{
                  p: 1.5,
                  mb: 2.5,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  color: '#DC2626',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                {error}
              </Box>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" color="#374151" sx={{ fontWeight: 600, mb: 0.8, display: 'block' }}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your email address"
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

              {/* Password */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                  <Typography variant="caption" color="#374151" sx={{ fontWeight: 600 }}>
                    Password
                  </Typography>
                  <Link
                    href="/forgot-password"
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#7C3AED',
                      textDecoration: 'none',
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: '#9CA3AF' }}>
                          <Lock size={18} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                            sx={{ color: '#9CA3AF' }}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </IconButton>
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

              {/* Remember Me */}
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: '#D1D5DB',
                        '&.Mui-checked': { color: '#7C3AED' },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="#4B5563" sx={{ fontSize: '0.875rem' }}>
                      Remember me
                    </Typography>
                  }
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  backgroundColor: '#6D28D9',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0px 8px 20px rgba(109, 40, 217, 0.3)',
                  '&:hover': {
                    backgroundColor: '#5B21B6',
                    boxShadow: '0px 10px 24px rgba(109, 40, 217, 0.4)',
                  },
                }}
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </Button>
            </Box>

            {/* Social Divider */}
            <Divider sx={{ my: 3, color: '#9CA3AF', fontSize: '0.8125rem' }}>
              or continue with
            </Divider>

            {/* Social Login Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3.5 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.1,
                  borderRadius: '12px',
                  borderColor: '#E5E7EB',
                  color: '#374151',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#D1D5DB',
                    backgroundColor: '#F9FAFB',
                  },
                }}
              >
                Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<AppleIcon />}
                sx={{
                  py: 1.1,
                  borderRadius: '12px',
                  borderColor: '#E5E7EB',
                  color: '#374151',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#D1D5DB',
                    backgroundColor: '#F9FAFB',
                  },
                }}
              >
                Apple
              </Button>
            </Box>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="#6B7280">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  style={{
                    color: '#7C3AED',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* Footer Security Note */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 4,
              color: '#9CA3AF',
            }}
          >
            <ShieldCheck size={16} />
            <Typography variant="caption" sx={{ fontSize: '0.8125rem' }}>
              Secure login • Your data is protected
            </Typography>
          </Box>
        </Box>
      </Box>
    </GuestGuard>
  );
}
