import { useAuthStore } from '@/core/stores/auth.store';
import { useTenantStore } from '@/core/stores/tenant.store';
import { InternalAxiosRequestConfig } from 'axios';

export function authRequestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const { token } = useAuthStore.getState();
  const { activeTenant, activeOutlet } = useTenantStore.getState();

  // Attach Access Token if present
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Attach Tenant and Outlet headers
  if (config.headers) {
    if (activeTenant?.id) {
      config.headers['x-tenant-id'] = activeTenant.id;
    }
    if (activeOutlet?.id) {
      config.headers['x-outlet-id'] = activeOutlet.id;
    }
  }

  return config;
}
