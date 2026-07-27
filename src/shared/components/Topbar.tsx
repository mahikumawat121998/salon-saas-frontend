'use client';

import { LAYOUT } from '@/config/layout';
import { useTenantStore } from '@/core/stores/tenant.store';
import { useAuth } from '@/providers/AuthProvider';
import { useColorMode } from '@/providers/ThemeProvider';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { Search } from '@/shared/ui/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MuiMenu from '@mui/material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  Bell,
  Building,
  ChevronDown,
  MapPin,
  Moon,
  Plus,
  Sun,
} from 'lucide-react';
import React, { useState } from 'react';
import { Menu } from './Menu';

import { useRouter } from 'next/navigation';

export interface TopbarProps {
  onMobileMenuToggle?: () => void;
  onOpenCommandPalette?: () => void;
  drawerWidth?: number;
}

export function Topbar({
  onMobileMenuToggle,
  onOpenCommandPalette,
  drawerWidth = LAYOUT.sidebar.expandedWidth,
}: TopbarProps) {
  const router = useRouter();
  const { mode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setUserMenuAnchor(null);
    logout();
    router.push('/login');
  };
  const { activeTenant, activeOutlet, availableTenants, availableOutlets, setActiveTenant, setActiveOutlet } =
    useTenantStore();

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [tenantAnchor, setTenantAnchor] = useState<null | HTMLElement>(null);
  const [outletAnchor, setOutletAnchor] = useState<null | HTMLElement>(null);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        height: `${LAYOUT.topbar.height}px`,
        justifyContent: 'center',
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: `${LAYOUT.topbar.height}px !important`, gap: 2 }}>
        {/* Left Section: Mobile Toggle & Tenant/Outlet Selectors */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {onMobileMenuToggle && (
            <IconButton edge="start" onClick={onMobileMenuToggle} color="inherit" sx={{ display: { md: 'none' } }}>
              <ChevronDown size={22} />
            </IconButton>
          )}

          {/* Tenant Selector Dropdown */}
          <Box
            onClick={(e) => setTenantAnchor(e.currentTarget)}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1.2,
              px: 1.8,
              py: 0.8,
              borderRadius: '12px',
              border: (t) => `1px solid ${t.palette.divider}`,
              cursor: 'pointer',
              backgroundColor: (t) => (t.palette.mode === 'light' ? '#FAFAFC' : '#1E293B'),
              '&:hover': {
                backgroundColor: (t) => (t.palette.mode === 'light' ? '#F3F4F6' : '#334155'),
              },
            }}
          >
            <Building size={18} color="#7C3AED" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.1 }}>
                {activeTenant?.name || 'Beauty Lounge'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block' }}>
                Super Admin
              </Typography>
            </Box>
            <ChevronDown size={16} color="#9CA3AF" />
          </Box>

          <MuiMenu
            anchorEl={tenantAnchor}
            open={Boolean(tenantAnchor)}
            onClose={() => setTenantAnchor(null)}
            slotProps={{ paper: { sx: { borderRadius: '12px', mt: 1, minWidth: 200 } } }}
          >
            {availableTenants.map((t) => (
              <MenuItem
                key={t.id}
                onClick={() => {
                  setActiveTenant(t);
                  setTenantAnchor(null);
                }}
                selected={t.id === activeTenant?.id}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t.name}
                </Typography>
              </MenuItem>
            ))}
          </MuiMenu>

          {/* Outlet Selector Dropdown */}
          <Box
            onClick={(e) => setOutletAnchor(e.currentTarget)}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1.2,
              px: 1.8,
              py: 0.8,
              borderRadius: '12px',
              border: (t) => `1px solid ${t.palette.divider}`,
              cursor: 'pointer',
              backgroundColor: (t) => (t.palette.mode === 'light' ? '#FAFAFC' : '#1E293B'),
              '&:hover': {
                backgroundColor: (t) => (t.palette.mode === 'light' ? '#F3F4F6' : '#334155'),
              },
            }}
          >
            <MapPin size={18} color="#EC4899" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {activeOutlet?.name || 'Rajapark Outlet'}
            </Typography>
            <ChevronDown size={16} color="#9CA3AF" />
          </Box>

          <MuiMenu
            anchorEl={outletAnchor}
            open={Boolean(outletAnchor)}
            onClose={() => setOutletAnchor(null)}
            slotProps={{ paper: { sx: { borderRadius: '12px', mt: 1, minWidth: 200 } } }}
          >
            {availableOutlets.map((o) => (
              <MenuItem
                key={o.id}
                onClick={() => {
                  setActiveOutlet(o);
                  setOutletAnchor(null);
                }}
                selected={o.id === activeOutlet?.id}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {o.name}
                </Typography>
              </MenuItem>
            ))}
          </MuiMenu>
        </Box>

        {/* Center/Right Search Bar & Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, justifyContent: 'flex-end' }}>
          <Box onClick={onOpenCommandPalette} sx={{ cursor: 'pointer', display: { xs: 'none', sm: 'block' } }}>
            <Search
              placeholder="Search customers, appointments..."
              sx={{ width: { sm: 260, lg: 320 } }}
              onClick={onOpenCommandPalette}
            />
          </Box>

          {/* Quick Appointment Button */}
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            sx={{
              borderRadius: '12px',
              px: 2.2,
              py: 1,
              backgroundColor: '#6D28D9',
              fontWeight: 700,
              fontSize: '0.875rem',
              textTransform: 'none',
              boxShadow: '0px 6px 16px rgba(109, 40, 217, 0.25)',
              '&:hover': {
                backgroundColor: '#5B21B6',
              },
            }}
          >
            + Quick Appointment
          </Button>

          {/* Notification Bell */}
          <IconButton color="inherit">
            <Badge badgeContent={5} color="error" pulse>
              <Bell size={20} />
            </Badge>
          </IconButton>

          {/* Theme Toggle */}
          <IconButton onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>

          {/* User Profile Avatar */}
          <IconButton onClick={(e) => setUserMenuAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
            <Avatar name={user?.name || 'Rahul Mehta'} src={user?.avatarUrl} sx={{ width: 36, height: 36 }} />
          </IconButton>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
            items={[
              {
                label: 'Settings',
                href: '/dashboard/settings/profile',
                icon: 'Settings',
              },
              {
                label: 'Logout',
                onClick: handleLogout,
                danger: true,
                icon: 'LogOut',
              },
            ]}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
