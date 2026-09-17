'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Switch from '@mui/material/Switch';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import {
  Building2,
  Store,
  Scissors,
  Receipt,
  Sliders,
  FileText,
  ArrowLeftRight,
  ChevronRight,
  Edit2,
  Crown,
  Check,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  CreditCard,
  Bell,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import Link from 'next/link';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';

interface SettingCategoryItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const SETTINGS_CATEGORIES: SettingCategoryItem[] = [
  {
    id: 'business_info',
    title: 'Business Information',
    description: 'Update your business name, address, contact details and logo.',
    icon: Building2,
    iconBg: '#F3E8FF',
    iconColor: '#7C3AED',
  },
  {
    id: 'branch_management',
    title: 'Branch Management',
    description: 'Manage your branches, working hours and holiday settings.',
    icon: Store,
    iconBg: '#ECFDF5',
    iconColor: '#10B981',
  },
  {
    id: 'services_pricing',
    title: 'Services & Pricing',
    description: 'Manage your services, categories, durations and pricing.',
    icon: Scissors,
    iconBg: '#FFF7ED',
    iconColor: '#F97316',
  },
  {
    id: 'tax_settings',
    title: 'Tax Settings',
    description: 'Configure tax rates and invoice preferences.',
    icon: Receipt,
    iconBg: '#EFF6FF',
    iconColor: '#3B82F6',
  },
  {
    id: 'custom_fields',
    title: 'Custom Fields',
    description: 'Manage custom fields for appointments and customers.',
    icon: Sliders,
    iconBg: '#F3E8FF',
    iconColor: '#7C3AED',
  },
  {
    id: 'document_templates',
    title: 'Document Templates',
    description: 'Customize invoices, receipts and other document templates.',
    icon: FileText,
    iconBg: '#ECFDF5',
    iconColor: '#10B981',
  },
  {
    id: 'roles_permissions',
    title: 'Roles & Permission Management',
    description: 'Manage custom roles, system permissions and staff access control.',
    icon: Shield,
    iconBg: '#F3E8FF',
    iconColor: '#7C3AED',
  },
  {
    id: 'data_import_export',
    title: 'Data Import / Export',
    description: 'Import data to SalonOS or export your business data.',
    icon: ArrowLeftRight,
    iconBg: '#FFF7ED',
    iconColor: '#F97316',
  },
];

import { useTenantStore } from '@/core/stores/tenant.store';
import { useAuthStore } from '@/core/stores/auth.store';

export default function SettingsPage() {
  const { activeTenant } = useTenantStore();
  const user = useAuthStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [preferences, setPreferences] = useState({
    reminders: true,
    sms: true,
    email: true,
    darkMode: false,
    staffHours: true,
  });
  const [logoUrl, setLogoUrl] = useState<string>('');

  const [businessHours, setBusinessHours] = useState([
    { dayOfWeek: 1, dayName: 'Monday', openTime: '09:00', closeTime: '21:00', isOpen: true },
    { dayOfWeek: 2, dayName: 'Tuesday', openTime: '09:00', closeTime: '21:00', isOpen: true },
    { dayOfWeek: 3, dayName: 'Wednesday', openTime: '09:00', closeTime: '21:00', isOpen: true },
    { dayOfWeek: 4, dayName: 'Thursday', openTime: '09:00', closeTime: '21:00', isOpen: true },
    { dayOfWeek: 5, dayName: 'Friday', openTime: '09:00', closeTime: '21:00', isOpen: true },
    { dayOfWeek: 6, dayName: 'Saturday', openTime: '09:00', closeTime: '21:00', isOpen: true },
    { dayOfWeek: 0, dayName: 'Sunday', openTime: '10:00', closeTime: '18:00', isOpen: true },
  ]);
  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);
  const [editingHours, setEditingHours] = useState(businessHours);

  const handleOpenHoursDialog = () => {
    setEditingHours(JSON.parse(JSON.stringify(businessHours)));
    setIsHoursDialogOpen(true);
  };

  const handleSaveHours = () => {
    setBusinessHours(editingHours);
    setIsHoursDialogOpen(false);
  };

  const handleToggleDayOpen = (index: number) => {
    setEditingHours((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isOpen: !updated[index].isOpen };
      return updated;
    });
  };

  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime', val: string) => {
    setEditingHours((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleTogglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', maxWidth: '100%', pb: 4 }}>
          {/* Header Title Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <PageHeader
              title="Settings"
              subtitle="Manage your business, preferences and account settings."
            />
            <Button
              component={Link}
              href="/dashboard/settings/roles"
              variant="contained"
              startIcon={<Shield size={18} />}
              sx={{
                borderRadius: '12px',
                backgroundColor: '#7C3AED',
                fontWeight: 700,
                fontSize: '0.84rem',
                py: 1,
                px: 2.5,
                textTransform: 'none',
                boxShadow: '0px 4px 14px rgba(124, 58, 237, 0.25)',
                '&:hover': { backgroundColor: '#6D28D9' },
              }}
            >
              Roles & Permissions
            </Button>
          </Box>

          {/* Settings Main Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3.5, mt: 0.5 }}>
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  minWidth: 'auto',
                  px: 2.5,
                },
              }}
            >
              <Tab label="Business Settings" />
              <Tab label="Team & Roles" />
              <Tab label="Payment & Billing" />
              <Tab label="Notifications" />
              <Tab label="Integrations" />
              <Tab label="Backup & Security" />
            </Tabs>
          </Box>

          {/* Main 2-Column Settings Layout */}
          <Grid container spacing={3}>
            {/* LEFT COLUMN: Categories & Working Hours (65%) */}
            <Grid size={{ xs: 12, lg: 7.5, xl: 8 }}>
              {/* Card 1: Vertical Settings Categories List */}
              <Card
                sx={{
                  borderRadius: '20px',
                  border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                  p: 1.5,
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {SETTINGS_CATEGORIES.map((category, idx) => {
                    const IconComponent = category.icon;
                    return (
                      <React.Fragment key={category.id}>
                        <Box
                          component={Link}
                          href={category.id === 'roles_permissions' ? '/dashboard/settings/roles' : '#'}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            borderRadius: '14px',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                            '&:hover': {
                              backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#FAFAFC'),
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '12px',
                                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(124, 58, 237, 0.15)' : category.iconBg),
                                color: (theme) => (theme.palette.mode === 'dark' ? '#C4B5FD' : category.iconColor),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <IconComponent size={22} />
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.95rem', color: 'text.primary' }}>
                                {category.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem', mt: 0.2, display: 'block' }}>
                                {category.description}
                              </Typography>
                            </Box>
                          </Box>

                          <ChevronRight size={20} color="#9CA3AF" />
                        </Box>
                        {idx < SETTINGS_CATEGORIES.length - 1 && (
                          <Divider sx={{ my: 0.5, borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#F3F4F6') }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </Box>
              </Card>

              {/* Card 2: Business Working Hours */}
              <Card
                sx={{
                  borderRadius: '20px',
                  border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                  p: 3,
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Clock size={20} color="#7C3AED" />
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary' }}>
                      Business Working Hours
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleOpenHoursDialog}
                    startIcon={<Edit2 size={14} />}
                    sx={{
                      borderRadius: '10px',
                      borderColor: (theme) => (theme.palette.mode === 'dark' ? '#C4B5FD' : '#7C3AED'),
                      color: (theme) => (theme.palette.mode === 'dark' ? '#C4B5FD' : '#7C3AED'),
                      fontWeight: 600,
                      fontSize: '0.78125rem',
                      px: 1.8,
                      py: 0.5,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(124, 58, 237, 0.08)',
                      },
                    }}
                  >
                    Edit Operating Hours
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {/* Left Column: Mon - Thu */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                      {businessHours.slice(0, 4).map((b) => (
                        <Box key={b.dayOfWeek} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color={b.isOpen ? 'text.secondary' : 'error.main'} sx={{ fontSize: '0.8125rem', minWidth: 90, fontWeight: b.isOpen ? 400 : 600 }}>
                            {b.dayName}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: b.isOpen ? 'text.primary' : 'error.main' }}>
                            {b.isOpen ? `${b.openTime} - ${b.closeTime}` : 'Closed'}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>

                  {/* Right Column: Fri - Sun */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                      {businessHours.slice(4).map((b) => (
                        <Box key={b.dayOfWeek} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color={b.isOpen ? 'text.secondary' : 'error.main'} sx={{ fontSize: '0.8125rem', minWidth: 90, fontWeight: b.isOpen ? 400 : 600 }}>
                            {b.dayName}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: b.isOpen ? 'text.primary' : 'error.main' }}>
                            {b.isOpen ? `${b.openTime} - ${b.closeTime}` : 'Closed'}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* RIGHT COLUMN: Business Info Overview, Plan & Preferences (35%) */}
            <Grid size={{ xs: 12, lg: 4.5, xl: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Card 1: Business Information Card */}
                <Card
                  sx={{
                    borderRadius: '20px',
                    border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                    p: 2.5,
                    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary' }}>
                      Business Information
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit2 size={14} />}
                      sx={{
                        borderRadius: '10px',
                        borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#E5E7EB'),
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: '0.78125rem',
                        px: 1.5,
                        py: 0.4,
                        textTransform: 'none',
                      }}
                    >
                      Edit
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    {/* Salon Logo Box */}
                    <Box sx={{ width: 72, height: 72, flexShrink: 0, boxShadow: '0px 4px 12px rgba(0,0,0,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                      <ImageUpload 
                        value={logoUrl || activeTenant?.logoUrl} 
                        onChange={setLogoUrl} 
                        className="w-full h-full" 
                        folderPath={`tenants/${activeTenant?.id || 'unknown'}/salon/logo`}
                        placeholder="Logo"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary' }}>
                          {activeTenant?.name || 'Beauty Lounge'}
                        </Typography>
                        <Chip
                          label={user?.subscriptionStatus || 'Active'}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            color: '#10B981',
                            fontWeight: 700,
                            height: 18,
                            fontSize: '0.6875rem',
                            borderRadius: '4px',
                          }}
                        />
                      </Box>

                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem', lineHeight: 1.4 }}>
                        Timezone: {activeTenant?.timezone || 'Asia/Kolkata'}
                      </Typography>

                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.78125rem', color: 'text.primary' }}>
                        Currency: {activeTenant?.currency || 'INR'}
                      </Typography>

                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.78125rem', color: (theme) => (theme.palette.mode === 'dark' ? '#C4B5FD' : 'primary.main') }}>
                        {user?.email || 'hello@beautylounge.com'}
                      </Typography>
                    </Box>
                  </Box>
                </Card>

                {/* Card 2: Subscription Plan Card */}
                <Card
                  sx={{
                    borderRadius: '20px',
                    border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                    p: 2.5,
                    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      mb: 2.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Crown size={20} color="#7C3AED" />
                      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary' }}>
                        Subscription Plan
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: '10px',
                        borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(196, 181, 253, 0.4)' : 'rgba(124, 58, 237, 0.3)'),
                        color: (theme) => (theme.palette.mode === 'dark' ? '#C4B5FD' : '#7C3AED'),
                        fontWeight: 700,
                        fontSize: '0.78125rem',
                        px: 1.8,
                        py: 0.5,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(124, 58, 237, 0.08)',
                        },
                      }}
                    >
                      Upgrade Plan
                    </Button>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                        Current Plan
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1rem', mt: 0.2, color: (theme) => (theme.palette.mode === 'dark' ? '#C4B5FD' : 'primary.main') }}>
                        {activeTenant?.plan ? activeTenant.plan.charAt(0).toUpperCase() + activeTenant.plan.slice(1).toLowerCase() : 'Starter'}
                      </Typography>
                    </Grid>

                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                        Modules
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1rem', mt: 0.2, color: 'text.primary' }}>
                        {user?.tenantModules?.length || '0'} Unlocked
                      </Typography>
                    </Grid>

                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                        Expires On
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', mt: 0.2, color: 'text.primary' }}>
                        {user?.trialEndsAt ? new Date(user.trialEndsAt).toLocaleDateString() : 'Active'}
                      </Typography>
                    </Grid>

                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                        Status
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.95rem', mt: 0.2, color: 'text.primary' }}>
                        {user?.subscriptionStatus || 'ACTIVE'}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Usage Progress Bar */}
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={60}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(124, 58, 237, 0.2)' : '#F3E8FF'),
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#7C3AED',
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem', display: 'block', mt: 1 }}>
                      You&apos;re using 60% of your plan
                    </Typography>
                  </Box>
                </Card>

                {/* Card 3: App Preferences Card */}
                <Card
                  sx={{
                    borderRadius: '20px',
                    border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                    p: 2.5,
                    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary', mb: 2 }}>
                    App Preferences
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem', color: 'text.primary' }}>
                        Enable appointment reminders
                      </Typography>
                      <Switch
                        size="small"
                        checked={preferences.reminders}
                        onChange={() => handleTogglePreference('reminders')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#7C3AED',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#7C3AED',
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem', color: 'text.primary' }}>
                        Enable SMS notifications
                      </Typography>
                      <Switch
                        size="small"
                        checked={preferences.sms}
                        onChange={() => handleTogglePreference('sms')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#7C3AED',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#7C3AED',
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem', color: 'text.primary' }}>
                        Enable email notifications
                      </Typography>
                      <Switch
                        size="small"
                        checked={preferences.email}
                        onChange={() => handleTogglePreference('email')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#7C3AED',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#7C3AED',
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem', color: 'text.primary' }}>
                        Dark mode
                      </Typography>
                      <Switch
                        size="small"
                        checked={preferences.darkMode}
                        onChange={() => handleTogglePreference('darkMode')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#7C3AED',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#7C3AED',
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem', color: 'text.primary' }}>
                        Calendar: Show staff working hours
                      </Typography>
                      <Switch
                        size="small"
                        checked={preferences.staffHours}
                        onChange={() => handleTogglePreference('staffHours')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#7C3AED',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#7C3AED',
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderRadius: '12px',
                      borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#E5E7EB'),
                      color: (theme) => (theme.palette.mode === 'dark' ? '#C4B5FD' : '#7C3AED'),
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(124, 58, 237, 0.08)',
                        borderColor: '#7C3AED',
                      },
                    }}
                  >
                    Save Preferences
                  </Button>
                </Card>
              </Box>
            </Grid>
          </Grid>
          {/* Edit Operating Hours Dialog */}
          <Dialog
            open={isHoursDialogOpen}
            onClose={() => setIsHoursDialogOpen(false)}
            maxWidth="md"
            fullWidth
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '20px',
                  p: 1,
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
                  backgroundImage: 'none',
                },
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 800, fontSize: '1.2rem', pb: 1, color: 'text.primary' }}>
              Edit Business Operating Hours
            </DialogTitle>
            <DialogContent dividers sx={{ border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6') }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure store opening & closing times for each day. Staff working schedules cannot be set outside these store operating hours.
              </Typography>

              <Grid container spacing={2}>
                {editingHours.map((item, idx) => (
                  <Grid size={{ xs: 12 }} key={item.dayOfWeek}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.8,
                        borderRadius: '12px',
                        backgroundColor: (theme) => item.isOpen ? (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#FAFAFC') : (theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2'),
                        border: '1px solid',
                        borderColor: (theme) => item.isOpen ? (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB') : (theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5'),
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 150 }}>
                        <Switch
                          checked={item.isOpen}
                          onChange={() => handleToggleDayOpen(idx)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#7C3AED' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#7C3AED' },
                          }}
                        />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: item.isOpen ? 'text.primary' : '#EF4444' }}>
                          {item.dayName}
                        </Typography>
                      </Box>

                      {item.isOpen ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <TextField
                            size="small"
                            label="Open Time"
                            type="time"
                            value={item.openTime}
                            onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ width: 140, '& .MuiOutlinedInput-root': { backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF') } }}
                          />
                          <Typography variant="body2" color="text.secondary">to</Typography>
                          <TextField
                            size="small"
                            label="Close Time"
                            type="time"
                            value={item.closeTime}
                            onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ width: 140, '& .MuiOutlinedInput-root': { backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF') } }}
                          />
                        </Box>
                      ) : (
                        <Chip label="Closed All Day" size="small" color="error" variant="outlined" sx={{ fontWeight: 600 }} />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : '#F9FAFB'), borderTop: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6') }}>
              <Button onClick={() => setIsHoursDialogOpen(false)} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveHours}
                sx={{
                  borderRadius: '12px',
                  backgroundColor: '#7C3AED',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 3,
                  '&:hover': { backgroundColor: '#6D28D9' },
                }}
              >
                Save Operating Hours
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
