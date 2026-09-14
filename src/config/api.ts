import { env } from './env';

export const API_CONFIG = {
  baseURL: env.apiUrl,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  appointments: {
    list: '/appointments',
    create: '/appointments',
    details: (id: string) => `/appointments/${id}`,
    update: (id: string) => `/appointments/${id}`,
    cancel: (id: string) => `/appointments/${id}/cancel`,
    reschedule: (id: string) => `/appointments/${id}/reschedule`,
  },
  services: {
    list: '/services',
    create: '/services',
    details: (id: string) => `/services/${id}`,
    update: (id: string) => `/services/${id}`,
    delete: (id: string) => `/services/${id}`,
    categories: '/services/categories',
  },
  staff: {
    list: '/staff',
    create: '/staff',
    details: (id: string) => `/staff/${id}`,
    update: (id: string) => `/staff/${id}`,
    delete: (id: string) => `/staff/${id}`,
    schedule: (id: string) => `/staff/${id}/schedule`,
  },
  customers: {
    list: '/customers',
    create: '/customers',
    details: (id: string) => `/customers/${id}`,
    update: (id: string) => `/customers/${id}`,
    delete: (id: string) => `/customers/${id}`,
    history: (id: string) => `/customers/${id}/history`,
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    revenue: '/analytics/revenue',
    appointments: '/analytics/appointments',
    topServices: '/analytics/top-services',
  },
  settings: {
    salonProfile: '/settings/salon',
    businessHours: '/settings/business-hours',
    billing: '/settings/billing',
  },
};
