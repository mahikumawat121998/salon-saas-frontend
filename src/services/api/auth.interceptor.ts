import { AUTH_STORAGE_KEYS } from '@/core/constants/auth.constants';
import { useAuthStore } from '@/core/stores/auth.store';
import { useTenantStore } from '@/core/stores/tenant.store';
import { InternalAxiosRequestConfig } from 'axios';

export function authRequestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  let token = useAuthStore.getState().token;
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Attach Multi-Tenant & Outlet Context Headers
  const { activeTenantId, activeOutletId } = useTenantStore.getState();

  if (activeTenantId && config.headers) {
    config.headers['x-tenant-id'] = activeTenantId;
  }
  if (activeOutletId && config.headers) {
    config.headers['x-outlet-id'] = activeOutletId;
  }

  return config;
}
