'use client';

import { PageHeader } from '@/shared/components/PageHeader';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Clock, CreditCard, Shield, User, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import DashboardLayout from './DashboardLayout';

export interface SettingsTabItem {
  label: string;
  path: string;
  icon: React.ReactElement;
}

const SETTINGS_TABS: SettingsTabItem[] = [
  {
    label: 'Profile & Salon',
    path: '/dashboard/settings/profile',
    icon: <User size={18} />,
  },
  {
    label: 'Business Hours',
    path: '/dashboard/settings/business-hours',
    icon: <Clock size={18} />,
  },
  {
    label: 'Billing & Subscription',
    path: '/dashboard/settings/billing',
    icon: <CreditCard size={18} />,
  },
  {
    label: 'Team Permissions',
    path: '/dashboard/settings/permissions',
    icon: <Users size={18} />,
  },
  {
    label: 'Security',
    path: '/dashboard/settings/security',
    icon: <Shield size={18} />,
  },
];

export interface SettingsLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function SettingsLayout({
  children,
  title = 'Settings',
  subtitle = 'Manage your salon preferences, business hours, and subscription details.',
}: SettingsLayoutProps) {
  const pathname = usePathname();

  const currentTabValue =
    SETTINGS_TABS.find((tab) => pathname === tab.path || pathname?.startsWith(`${tab.path}/`))
      ?.path || SETTINGS_TABS[0].path;

  return (
    <DashboardLayout>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings' },
        ]}
      />

      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
          <Tabs value={currentTabValue} variant="scrollable" scrollButtons="auto">
            {SETTINGS_TABS.map((tab) => (
              <Tab
                key={tab.path}
                component={Link}
                href={tab.path}
                value={tab.path}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                sx={{
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: 48,
                  fontSize: '0.875rem',
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2.5, sm: 4 } }}>{children}</Box>
      </Card>
    </DashboardLayout>
  );
}

export default SettingsLayout;
