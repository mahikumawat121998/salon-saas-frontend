'use client';

import React, { createContext, useContext } from 'react';
import { useTenantStore, TenantSummary as Tenant, OutletSummary as Outlet } from '../stores/tenant.store';

interface TenantContextType {
  activeTenant: Tenant | null;
  activeOutlet: Outlet | null;
  availableTenants: Tenant[];
  availableOutlets: Outlet[];
  setActiveTenant: (tenant: Tenant) => void;
  setActiveOutlet: (outlet: Outlet) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const store = useTenantStore();

  return (
    <TenantContext.Provider value={store}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
}
