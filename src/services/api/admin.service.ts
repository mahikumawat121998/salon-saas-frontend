import { axiosClient } from './axios-client';
import { ApiResponse } from '@/types/api';

export interface PlatformMetrics {
  totalTenants: number;
  activeTenants: number;
  suspendedTenants: number;
  totalUsers: number;
  totalGMV: number;
  samsMRR: number;
}

export interface TenantDirectoryItem {
  id: string;
  name: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  createdAt: string;
  ownerEmail: string;
  counts: {
    customers: number;
    staff: number;
    appointments: number;
    invoices: number;
  };
  subscription: {
    planName: string;
    status: string;
    currentPeriodEnd: string;
  };
}

export interface TenantDetailView extends TenantDirectoryItem {
  totalGMV: number;
  users: Array<{ id: string; email: string; createdAt: string }>;
  recentAuditLogs: Array<{
    id: string;
    action: string;
    reason?: string;
    actorUserId: string;
    createdAt: string;
  }>;
}

export interface AuditLogItem {
  id: string;
  actorUserId: string;
  action: string;
  targetTenantId?: string | null;
  reason?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export const adminApiService = {
  // Get Platform Overview Metrics
  getMetrics: async (): Promise<PlatformMetrics> => {
    const res = await axiosClient.get<ApiResponse<PlatformMetrics>>('/admin/metrics');
    return (res.data as any)?.data || res.data;
  },

  // Get Platform Revenue & Billing Overview
  getPlatformRevenue: async (search?: string, status?: string): Promise<any> => {
    const res = await axiosClient.get<ApiResponse<any>>('/admin/revenue', {
      params: { search, status },
    });
    return (res.data as any)?.data || res.data;
  },

  // Get Tenants Directory
  getTenants: async (search?: string, status?: string): Promise<TenantDirectoryItem[]> => {
    const res = await axiosClient.get<ApiResponse<TenantDirectoryItem[]>>('/admin/tenants', {
      params: { search, status },
    });
    return (res.data as any)?.data || res.data || [];
  },

  // Get Single Tenant Detail
  getTenantById: async (id: string): Promise<TenantDetailView> => {
    const res = await axiosClient.get<ApiResponse<TenantDetailView>>(`/admin/tenants/${id}`);
    return (res.data as any)?.data || res.data;
  },

  // Update Tenant Status (Activate / Suspend)
  updateTenantStatus: async (
    id: string,
    data: { status: 'ACTIVE' | 'SUSPENDED'; reason?: string }
  ): Promise<TenantDirectoryItem> => {
    const res = await axiosClient.patch<ApiResponse<TenantDirectoryItem>>(`/admin/tenants/${id}/status`, data);
    return (res.data as any)?.data || res.data;
  },

  // Audited Support Impersonation
  impersonateTenant: async (
    id: string,
    data: { reason: string }
  ): Promise<{ accessToken: string; tenantId: string; tenantName: string; impersonatedUserEmail: string }> => {
    const res = await axiosClient.post<
      ApiResponse<{ accessToken: string; tenantId: string; tenantName: string; impersonatedUserEmail: string }>
    >(`/admin/tenants/${id}/impersonate`, data);
    return (res.data as any)?.data || res.data;
  },

  // Create / Onboard New Salon Tenant
  createTenant: async (data: {
    name: string;
    ownerEmail: string;
    ownerPassword: string;
    planId: string;
    timezone?: string;
    currency?: string;
  }): Promise<TenantDirectoryItem> => {
    const res = await axiosClient.post<ApiResponse<TenantDirectoryItem>>('/admin/tenants', data);
    return (res.data as any)?.data || res.data;
  },

  // Create Onboarding Order for Razorpay
  createOnboardingOrder: async (data: { planId: string }): Promise<any> => {
    const res = await axiosClient.post<ApiResponse<any>>('/admin/tenants/onboard-order', data);
    return (res.data as any)?.data || res.data;
  },

  // Update Tenant Subscription Plan
  updateTenantSubscription: async (
    id: string,
    data: { planId: string; reason?: string }
  ): Promise<any> => {
    const res = await axiosClient.patch<ApiResponse<any>>(`/admin/tenants/${id}/subscription`, data);
    return (res.data as any)?.data || res.data;
  },

  // Granular Selective Module Permission Feature Toggles
  updateTenantModules: async (
    id: string,
    data: { allowedModules: string[]; reason?: string }
  ): Promise<any> => {
    const res = await axiosClient.patch<ApiResponse<any>>(`/admin/tenants/${id}/modules`, data);
    return (res.data as any)?.data || res.data;
  },

  // Get SaaS Subscription Plans
  getPlans: async (): Promise<any[]> => {
    const res = await axiosClient.get<ApiResponse<any[]>>('/admin/plans');
    return (res.data as any)?.data || res.data || [];
  },

  // Create New Subscription Plan
  createPlan: async (data: any): Promise<any> => {
    const res = await axiosClient.post<ApiResponse<any>>('/admin/plans', data);
    return (res.data as any)?.data || res.data;
  },

  // Update Existing Subscription Plan
  updatePlan: async (id: string, data: any): Promise<any> => {
    const res = await axiosClient.patch<ApiResponse<any>>(`/admin/plans/${id}`, data);
    return (res.data as any)?.data || res.data;
  },

  // Delete Subscription Plan
  deletePlan: async (id: string): Promise<any> => {
    const res = await axiosClient.delete<ApiResponse<any>>(`/admin/plans/${id}`);
    return (res.data as any)?.data || res.data;
  },

  // Get Platform Audit Logs
  getAuditLogs: async (): Promise<AuditLogItem[]> => {
    const res = await axiosClient.get<ApiResponse<AuditLogItem[]>>('/admin/audit-logs');
    return (res.data as any)?.data || res.data || [];
  },

  // Get Platform Growth Analytics
  getAnalytics: async (range?: string): Promise<any> => {
    const res = await axiosClient.get<ApiResponse<any>>('/admin/analytics', {
      params: { range },
    });
    return (res.data as any)?.data || res.data;
  },

  // Feature Catalog
  getFeatures: async (): Promise<any[]> => {
    const res = await axiosClient.get<ApiResponse<any[]>>('/admin/features');
    return (res.data as any)?.data || res.data || [];
  },

  createFeature: async (data: { code: string; name: string; description?: string; category?: string }): Promise<any> => {
    const res = await axiosClient.post<ApiResponse<any>>('/admin/features', data);
    return (res.data as any)?.data || res.data;
  },

  updateFeature: async (id: string, data: { name?: string; description?: string; category?: string }): Promise<any> => {
    const res = await axiosClient.patch<ApiResponse<any>>(`/admin/features/${id}`, data);
    return (res.data as any)?.data || res.data;
  },

  deleteFeature: async (id: string): Promise<any> => {
    const res = await axiosClient.delete<ApiResponse<any>>(`/admin/features/${id}`);
    return (res.data as any)?.data || res.data;
  },

  // Permission Catalog
  getPermissionsCatalog: async (): Promise<any[]> => {
    const res = await axiosClient.get<ApiResponse<any[]>>('/admin/permissions');
    return (res.data as any)?.data || res.data || [];
  },

  createPermissionCatalog: async (data: { code: string; name: string; description?: string; featureId: string }): Promise<any> => {
    const res = await axiosClient.post<ApiResponse<any>>('/admin/permissions', data);
    return (res.data as any)?.data || res.data;
  },

  updatePermissionCatalog: async (id: string, data: { name?: string; description?: string; featureId?: string }): Promise<any> => {
    const res = await axiosClient.patch<ApiResponse<any>>(`/admin/permissions/${id}`, data);
    return (res.data as any)?.data || res.data;
  },

  deletePermissionCatalog: async (id: string): Promise<any> => {
    const res = await axiosClient.delete<ApiResponse<any>>(`/admin/permissions/${id}`);
    return (res.data as any)?.data || res.data;
  },
};


