'use client';

import { LAYOUT } from '@/config/layout';
import { MAIN_NAVIGATION, NavItem } from '@/config/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useColorMode } from '@/providers/ThemeProvider';
import { Avatar } from '@/shared/ui/Avatar';
import { Search } from '@/shared/ui/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  BarChart3,
  Bell,
  Calendar,
  Clock,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu as MenuIcon,
  Moon,
  Package,
  Receipt,
  Scissors,
  Settings,
  Sun,
  UserCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const DRAWER_WIDTH = LAYOUT.sidebar.expandedWidth;
const TOPBAR_HEIGHT = LAYOUT.topbar.height;

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  Calendar: <Calendar size={20} />,
  Clock: <Clock size={20} />,
  CreditCard: <CreditCard size={20} />,
  Scissors: <Scissors size={20} />,
  Users: <Users size={20} />,
  UserCheck: <UserCheck size={20} />,
  Package: <Package size={20} />,
  Megaphone: <Megaphone size={20} />,
  BarChart3: <BarChart3 size={20} />,
  Bell: <Bell size={20} />,
  Receipt: <Receipt size={20} />,
  Settings: <Settings size={20} />,
};

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const { mode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    router.push('/login');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          p: 3,
          height: `${TOPBAR_HEIGHT}px`,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.25)',
          }}
        >
          <Scissors size={22} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            SalonOS
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Management Suite
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 2, flexGrow: 1, overflowY: 'auto' }}>
        {MAIN_NAVIGATION.map((item: NavItem) => {
          const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);
          const icon = item.icon ? iconMap[item.icon] : null;

          return (
            <ListItemButton
              key={item.path}
              component={Link}
              href={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              selected={isActive}
              sx={{
                borderRadius: '10px',
                mb: 0.5,
                color: isActive ? 'primary.main' : 'text.secondary',
                backgroundColor: isActive
                  ? (t) => (t.palette.mode === 'light' ? 'rgba(124, 58, 237, 0.08)' : 'rgba(139, 92, 246, 0.16)')
                  : 'transparent',
                fontWeight: isActive ? 600 : 400,
                '&:hover': {
                  backgroundColor: (t) =>
                    t.palette.mode === 'light' ? 'rgba(124, 58, 237, 0.04)' : 'rgba(139, 92, 246, 0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? 'primary.main' : 'text.secondary',
                  minWidth: 36,
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: '0.9375rem',
                      fontWeight: isActive ? 600 : 500,
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box
        sx={{
          p: 2,
          m: 2,
          borderRadius: '14px',
          backgroundColor: (t) => (t.palette.mode === 'light' ? '#F8FAFC' : '#1E293B'),
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar name={user?.name || 'Admin User'} status="online" sx={{ width: 36, height: 36 }} />
        <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
            {user?.name || 'Admin User'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
            {user?.roles?.[0] || 'Store Owner'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', maxWidth: '100vw', backgroundColor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          height: `${TOPBAR_HEIGHT}px`,
          justifyContent: 'center',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          color: 'text.primary',
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 }, minHeight: `${TOPBAR_HEIGHT}px !important` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton edge="start" onClick={handleDrawerToggle} color="inherit">
                <MenuIcon size={22} />
              </IconButton>
            )}

            {/* Branch / Outlet Selectors as seen in header image */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <Select
                size="small"
                defaultValue="beauty_lounge"
                sx={{
                  height: 38,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  backgroundColor: (t) => (t.palette.mode === 'light' ? '#F8FAFC' : '#1E293B'),
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                }}
              >
                <MenuItem value="beauty_lounge">Beauty Lounge (Super Admin)</MenuItem>
                <MenuItem value="downtown">Downtown Salon</MenuItem>
              </Select>

              <Select
                size="small"
                defaultValue="rajapark"
                sx={{
                  height: 38,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  backgroundColor: (t) => (t.palette.mode === 'light' ? '#F8FAFC' : '#1E293B'),
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                }}
              >
                <MenuItem value="rajapark">📍 Rajapark Outlet</MenuItem>
                <MenuItem value="manhattan">📍 Manhattan Outlet</MenuItem>
              </Select>
            </Box>

            {/* Global Search Bar */}
            <Search placeholder="Search customers, appointments, services... ⌘K" sx={{ width: { xs: 200, sm: 320, md: 380 } }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="contained"
              component={Link}
              href="/dashboard/services"
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                borderRadius: '10px',
                backgroundColor: '#7C3AED',
                fontWeight: 700,
                fontSize: '0.8125rem',
                px: 2,
                py: 0.8,
                textTransform: 'none',
                boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.25)',
                '&:hover': { backgroundColor: '#6D28D9' },
              }}
            >
              + Add New Service
            </Button>

            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>

            <IconButton color="inherit" sx={{ position: 'relative' }}>
              <Bell size={20} />
              <Box
                sx={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                5
              </Box>
            </IconButton>

            <IconButton onClick={handleUserMenuOpen} sx={{ p: 0.5 }}>
              <Avatar name={user?.name || 'Rahul Mehta'} sx={{ width: 36, height: 36 }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              slotProps={{
                paper: {
                  sx: { borderRadius: '12px', minWidth: 180, mt: 1 },
                },
              }}
            >
              <MenuItem component={Link} href="/dashboard/settings/profile" onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <Settings size={18} />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <LogOut size={18} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            slotProps={{
              paper: {
                sx: { width: DRAWER_WIDTH },
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            slotProps={{
              paper: {
                sx: {
                  width: DRAWER_WIDTH,
                  borderRight: (t) => `1px solid ${t.palette.divider}`,
                },
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 3.5, md: 4 },
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          maxWidth: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minWidth: 0,
          mt: `${TOPBAR_HEIGHT}px`,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;
