export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  tenant: {
    current: ['tenant', 'current'] as const,
    settings: ['tenant', 'settings'] as const,
  },
  outlets: {
    all: ['outlets'] as const,
    detail: (id: string) => ['outlets', 'detail', id] as const,
  },
  staff: {
    all: ['staff'] as const,
    list: (filters?: Record<string, any>) => ['staff', 'list', filters || {}] as const,
    detail: (id: string) => ['staff', 'detail', id] as const,
    leaves: (staffId?: string) => ['staff', 'leaves', staffId || 'all'] as const,
    breaks: (staffId?: string) => ['staff', 'breaks', staffId || 'all'] as const,
    schedules: (staffId: string) => ['staff', 'schedules', staffId] as const,
  },
  customers: {
    all: ['customers'] as const,
    list: (filters?: Record<string, any>) => ['customers', 'list', filters || {}] as const,
    detail: (id: string) => ['customers', 'detail', id] as const,
    notes: (customerId: string) => ['customers', 'notes', customerId] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    list: (filters?: Record<string, any>) => ['appointments', 'list', filters || {}] as const,
    detail: (id: string) => ['appointments', 'detail', id] as const,
    slots: (date: string, staffId?: string) => ['appointments', 'slots', date, staffId] as const,
  },
  services: {
    all: ['services'] as const,
    categories: ['services', 'categories'] as const,
    list: (filters?: Record<string, any>) => ['services', 'list', filters || {}] as const,
    detail: (id: string) => ['services', 'detail', id] as const,
  },
  billing: {
    invoices: (filters?: Record<string, any>) => ['billing', 'invoices', filters || {}] as const,
    detail: (id: string) => ['billing', 'detail', id] as const,
  },
  reports: {
    summary: ['reports', 'summary'] as const,
    revenue: (range?: string) => ['reports', 'revenue', range || 'weekly'] as const,
    staff: (range?: string) => ['reports', 'staff', range || 'monthly'] as const,
    services: (range?: string) => ['reports', 'services', range || 'monthly'] as const,
    customers: (range?: string) => ['reports', 'customers', range || 'monthly'] as const,
  },
  inventory: {
    all: ['inventory'] as const,
    list: (filters?: Record<string, any>) => ['inventory', 'list', filters || {}] as const,
    detail: (id: string) => ['inventory', 'detail', id] as const,
  },
  roles: {
    all: ['roles'] as const,
    permissions: ['roles', 'permissions'] as const,
    detail: (id: string) => ['roles', 'detail', id] as const,
  },
};
