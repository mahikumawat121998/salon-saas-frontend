'use client';

import { MAIN_NAVIGATION, NavItem } from '@/config/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Avatar } from '@/shared/ui/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import {
  BarChart3,
  Bell,
  Calendar,
  Clock,
  CreditCard,
  Headphones,
  Headset,
  LayoutDashboard,
  Megaphone,
  Package,
  Receipt,
  Scissors,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

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
  ShieldCheck: <ShieldCheck size={20} />,
};

export interface SidebarProps {
  onItemClick?: () => void;
  items?: NavItem[];
}

export function Sidebar({ onItemClick, items = MAIN_NAVIGATION }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand Header */}
      <Box
        sx={{
          p: 3,
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
            Salon Management
          </Typography>
        </Box>
      </Box>

      {/* Navigation Links */}
      <List sx={{ px: 2, flexGrow: 1, overflowY: 'auto' }}>
        {items.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);
          const icon = item.icon ? iconMap[item.icon] : null;

          return (
            <ListItemButton
              key={item.path}
              component={Link}
              href={item.path}
              onClick={onItemClick}
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
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    backgroundColor: 'rgba(124, 58, 237, 0.15)',
                    color: '#7C3AED',
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* Need Help Card */}
      <Box
        sx={{
          m: 2,
          p: 2,
          borderRadius: '14px',
          backgroundColor: 'rgba(124, 58, 237, 0.06)',
          border: '1px solid rgba(124, 58, 237, 0.12)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: 'rgba(124, 58, 237, 0.12)',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Headphones size={18} />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
              Need Help?
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              We&apos;re here to help
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Headset size={16} />}
          sx={{
            borderRadius: '10px',
            borderColor: 'rgba(124, 58, 237, 0.3)',
            color: '#7C3AED',
            backgroundColor: '#FFFFFF',
            fontSize: '0.8125rem',
            fontWeight: 600,
            textTransform: 'none',
            py: 0.6,
            '&:hover': {
              backgroundColor: 'rgba(124, 58, 237, 0.04)',
            },
          }}
        >
          Contact Support
        </Button>
      </Box>

      {/* User Profile Card */}
      <Box
        sx={{
          p: 2,
          m: '0 16px 16px',
          borderRadius: '14px',
          backgroundColor: (t) => (t.palette.mode === 'light' ? '#F8FAFC' : '#1E293B'),
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar name={user?.name || 'Rahul Mehta'} src={user?.avatarUrl} status="online" sx={{ width: 36, height: 36 }} />
        <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {user?.name || 'Rahul Mehta'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', fontSize: '0.75rem' }}>
            {user?.roles?.[0] || 'Owner'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
