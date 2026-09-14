import { Permission } from './permissions';
import { ROUTES } from './routes';

export interface NavItem {
  title: string;
  path: string;
  icon?: string;
  permission?: Permission;
  module?: string;
  badge?: string;
  children?: NavItem[];
}

export const MAIN_NAVIGATION: NavItem[] = [
  {
    title: 'Dashboard',
    path: ROUTES.dashboard.root,
    icon: 'LayoutDashboard',
  },
  {
    title: 'Calendar',
    path: ROUTES.dashboard.calendar,
    icon: 'Calendar',
    permission: 'appointments:read',
    module: 'APPOINTMENTS',
  },
  {
    title: 'Appointments',
    path: ROUTES.dashboard.appointments.root,
    icon: 'Clock',
    permission: 'appointments:read',
    module: 'APPOINTMENTS',
    badge: '24',
  },
  {
    title: 'Customers',
    path: ROUTES.dashboard.customers.root,
    icon: 'UserCheck',
    permission: 'customers:read',
    module: 'CUSTOMERS',
  },
  {
    title: 'Staff',
    path: ROUTES.dashboard.staff.root,
    icon: 'Users',
    permission: 'staff:read',
    module: 'STAFF',
  },
  {
    title: 'Roles & Permissions',
    path: '/dashboard/settings/roles',
    icon: 'ShieldCheck',
    permission: 'settings:read',
    module: 'STAFF',
  },
  {
    title: 'Services',
    path: ROUTES.dashboard.services.root,
    icon: 'Scissors',
    permission: 'services:read',
    module: 'SERVICES',
  },
  {
    title: 'POS',
    path: ROUTES.dashboard.pos.root,
    icon: 'CreditCard',
    permission: 'appointments:write',
    module: 'BILLING',
  },
  {
    title: 'Invoices',
    path: '/dashboard/invoices',
    icon: 'Receipt',
    permission: 'appointments:read',
    module: 'BILLING',
  },
  {
    title: 'Inventory',
    path: ROUTES.dashboard.inventory.root,
    icon: 'Package',
    permission: 'services:read',
    module: 'INVENTORY',
  },
  {
    title: 'Marketing',
    path: ROUTES.dashboard.marketing.root,
    icon: 'Megaphone',
    permission: 'settings:read',
    module: 'MARKETING',
  },
  {
    title: 'Reports',
    path: ROUTES.dashboard.analytics.root,
    icon: 'BarChart3',
    permission: 'analytics:read',
    module: 'REPORTS',
  },
  {
    title: 'Settings',
    path: ROUTES.dashboard.settings.root,
    icon: 'Settings',
    permission: 'settings:read',
  },
];
