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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [preferences, setPreferences] = useState({
    reminders: true,
    sms: true,
    email: true,
    darkMode: false,
    staffHours: true,
  });

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
                  border: '1px solid #F3F4F6',
                  p: 1.5,
                  backgroundColor: '#FFFFFF',
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
                              backgroundColor: '#FAFAFC',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '12px',
                                backgroundColor: category.iconBg,
                                color: category.iconColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <IconComponent size={22} />
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>
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
                          <Divider sx={{ my: 0.5, borderColor: '#F3F4F6' }} />
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
                  border: '1px solid #F3F4F6',
                  p: 3,
                  backgroundColor: '#FFFFFF',
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
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
                    Business Working Hours
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Edit2 size={14} />}
                    sx={{
                      borderRadius: '10px',
                      borderColor: '#E5E7EB',
                      color: '#374151',
                      fontWeight: 600,
                      fontSize: '0.78125rem',
                      px: 1.8,
                      py: 0.5,
                      textTransform: 'none',
                    }}
                  >
                    Edit
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {/* Left Column: Mon-Wed, Sun */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', minWidth: 90 }}>
                          Monday
                        </Typography>
                        <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                          09:00 AM - 09:00 PM
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', minWidth: 90 }}>
                          Tuesday
                        </Typography>
                        <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                          09:00 AM - 09:00 PM
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', minWidth: 90 }}>
                          Wednesday
                        </Typography>
                        <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                          09:00 AM - 09:00 PM
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="error.main" sx={{ fontWeight: 600, fontSize: '0.8125rem', minWidth: 90 }}>
                          Sunday
                        </Typography>
                        <Typography variant="body2" color="error.main" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                          Closed
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Right Column: Thu-Sat */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', minWidth: 90 }}>
                          Thursday
                        </Typography>
                        <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                          09:00 AM - 09:00 PM
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', minWidth: 90 }}>
                          Friday
                        </Typography>
                        <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                          09:00 AM - 09:00 PM
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', minWidth: 90 }}>
                          Saturday
                        </Typography>
                        <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                          09:00 AM - 10:00 PM
                        </Typography>
                      </Box>
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
                    border: '1px solid #F3F4F6',
                    p: 2.5,
                    backgroundColor: '#FFFFFF',
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
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
                      Business Information
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit2 size={14} />}
                      sx={{
                        borderRadius: '10px',
                        borderColor: '#E5E7EB',
                        color: '#374151',
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
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '16px',
                        backgroundColor: '#000000',
                        color: '#D4AF37',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 1,
                        flexShrink: 0,
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: 'serif', lineHeight: 1 }}>
                        B
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.5rem', letterSpacing: 1.5, fontWeight: 700, mt: 0.3 }}>
                        BEAUTY LOUNGE
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
                          Beauty Lounge
                        </Typography>
                        <Chip
                          label="Active"
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
                        Rajapark Main Road, Jaipur, Rajasthan 302004, India
                      </Typography>

                      <Typography variant="caption" color="#374151" sx={{ fontWeight: 600, fontSize: '0.78125rem' }}>
                        +91 98765 43210
                      </Typography>

                      <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600, fontSize: '0.78125rem' }}>
                        hello@beautylounge.com
                      </Typography>
                    </Box>
                  </Box>
                </Card>

                {/* Card 2: Subscription Plan Card */}
                <Card
                  sx={{
                    borderRadius: '20px',
                    border: '1px solid #F3F4F6',
                    p: 2.5,
                    backgroundColor: '#FFFFFF',
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Crown size={20} color="#7C3AED" />
                      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
                        Subscription Plan
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: '10px',
                        borderColor: 'rgba(124, 58, 237, 0.3)',
                        color: '#7C3AED',
                        fontWeight: 700,
                        fontSize: '0.78125rem',
                        px: 1.8,
                        py: 0.5,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(124, 58, 237, 0.04)',
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
                      <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 800, fontSize: '1rem', mt: 0.2 }}>
                        Professional
                      </Typography>
                    </Grid>

                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                        Users
                      </Typography>
                      <Typography variant="subtitle1" color="#111827" sx={{ fontWeight: 800, fontSize: '1rem', mt: 0.2 }}>
                        12 / 20
                      </Typography>
                    </Grid>

                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                        Expires On
                      </Typography>
                      <Typography variant="subtitle2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.84rem', mt: 0.2 }}>
                        12 Sep 2025
                      </Typography>
                    </Grid>

                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                        Monthly Price
                      </Typography>
                      <Typography variant="subtitle2" color="#111827" sx={{ fontWeight: 800, fontSize: '0.95rem', mt: 0.2 }}>
                        $49.00
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
                        backgroundColor: '#F3E8FF',
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
                    border: '1px solid #F3F4F6',
                    p: 2.5,
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827', mb: 2 }}>
                    App Preferences
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="#374151" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
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
                      <Typography variant="body2" color="#374151" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
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
                      <Typography variant="body2" color="#374151" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
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
                      <Typography variant="body2" color="#374151" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
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
                      <Typography variant="body2" color="#374151" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
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
                      borderColor: '#E5E7EB',
                      color: '#7C3AED',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(124, 58, 237, 0.04)',
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
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
