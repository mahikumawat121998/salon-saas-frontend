'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, Shield, FileText, Settings, BarChart3, LogOut, ArrowLeft, LayoutDashboard, Sun, Moon, Zap, TrendingUp, Key } from 'lucide-react';
import { SuperAdminGuard } from '@/shared/components/auth/SuperAdminGuard';
import { useAuth } from '@/providers/AuthProvider';
import { useColorMode } from '@/providers/ThemeProvider';
import { Avatar } from '@/shared/ui/Avatar';
import { showToast } from '@/shared/components/Toast';

const navItems = [
  { label: 'Platform Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Tenants Directory', href: '/admin/tenants', icon: Building2 },
  { label: 'Subscriptions & Plans', href: '/admin/plans', icon: Zap },
  { label: 'Feature & Permissions', href: '/admin/permissions', icon: Key },
  { label: 'Platform Revenue', href: '/admin/revenue', icon: BarChart3 },
  { label: 'Platform Analytics', href: '/admin/analytics', icon: TrendingUp },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
  { label: 'System Settings', href: '/admin/settings', icon: Settings },
];



export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useColorMode();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sams_impersonating');
    }
    logout();
    showToast.success('Logged Out', 'Super Admin session terminated');
    router.replace('/login');
  };

  return (
    <SuperAdminGuard>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: (t) => (t.palette.mode === 'dark' ? '#0B0F17' : '#F8FAFC') }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 260,
            flexShrink: 0,
            borderRight: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
            backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Logo & Brand Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.3)',
                }}
              >
                <Shield size={22} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1.1 }}>
                  SAMs Control
                </Typography>
                <Chip label="SUPER ADMIN" size="small" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 800, backgroundColor: 'rgba(124, 58, 237, 0.15)', color: '#A78BFA', mt: 0.2 }} />
              </Box>
            </Box>

            <IconButton onClick={toggleColorMode} size="small" sx={{ color: 'text.secondary' }}>
              {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <Button
                    fullWidth
                    startIcon={<Icon size={18} />}
                    sx={{
                      justifyContent: 'flex-start',
                      py: 1.2,
                      px: 2,
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      backgroundColor: (t) =>
                        isActive
                          ? t.palette.mode === 'dark'
                            ? 'rgba(124, 58, 237, 0.2)'
                            : 'rgba(124, 58, 237, 0.08)'
                          : 'transparent',
                      color: isActive ? '#7C3AED' : 'text.secondary',
                      borderLeft: isActive ? '3px solid #7C3AED' : '3px solid transparent',
                      '&:hover': {
                        backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9'),
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </Box>

          {/* Footer User Profile & Logout */}
          <Box sx={{ pt: 2, borderTop: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9') }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, px: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, overflow: 'hidden' }}>
                <Avatar name={user?.name || 'Super Admin'} sx={{ width: 34, height: 34 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, fontSize: '0.8125rem', color: 'text.primary' }}>
                    {user?.email || 'superadmin@sams.com'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', display: 'block' }}>
                    Platform Controller
                  </Typography>
                </Box>
              </Box>

              <Tooltip title="Logout Super Admin">
                <IconButton
                  size="small"
                  onClick={handleLogout}
                  sx={{
                    color: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
                  }}
                >
                  <LogOut size={16} />
                </IconButton>
              </Tooltip>
            </Box>

            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <Button
                fullWidth
                startIcon={<ArrowLeft size={16} />}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.78125rem',
                  color: 'text.secondary',
                  border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0'),
                }}
              >
                Tenant App Dashboard
              </Button>
            </Link>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </SuperAdminGuard>
  );
}
