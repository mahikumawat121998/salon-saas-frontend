import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: 'free' | 'pro' | 'enterprise';
  currency: string;
  timezone: string;
}

export interface OutletSummary {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  address?: string;
  isPrimary?: boolean;
}

export interface TenantContextState {
  activeTenantId: string | null;
  activeOutletId: string | null;
  activeTenant: TenantSummary | null;
  activeOutlet: OutletSummary | null;
  availableTenants: TenantSummary[];
  availableOutlets: OutletSummary[];
  setActiveTenant: (tenant: TenantSummary | string) => void;
  setActiveOutlet: (outlet: OutletSummary | string) => void;
  setAvailableTenants: (tenants: TenantSummary[]) => void;
  setAvailableOutlets: (outlets: OutletSummary[]) => void;
  clearTenantContext: () => void;
}

const DEFAULT_TENANT: TenantSummary = {
  id: 'tnt_beauty_lounge',
  name: 'Beauty Lounge',
  slug: 'beauty-lounge-rajapark',
  logoUrl: '/images/salon_logo_1.png',
  plan: 'enterprise',
  currency: 'USD',
  timezone: 'Asia/Kolkata',
};

const DEFAULT_OUTLET: OutletSummary = {
  id: 'out_rajapark',
  tenantId: 'tnt_beauty_lounge',
  name: 'Rajapark Outlet',
  code: 'RJP-01',
  address: 'Plot 42, Rajapark, Jaipur',
  isPrimary: true,
};

export const useTenantStore = create<TenantContextState>()(
  persist(
    (set, get) => ({
      activeTenantId: DEFAULT_TENANT.id,
      activeOutletId: DEFAULT_OUTLET.id,
      activeTenant: DEFAULT_TENANT,
      activeOutlet: DEFAULT_OUTLET,
      availableTenants: [
        DEFAULT_TENANT,
        {
          id: 'tnt_velvet_vine',
          name: 'Velvet & Vine Manhattan',
          slug: 'velvet-vine-ny',
          plan: 'enterprise',
          currency: 'USD',
          timezone: 'America/New_York',
        },
      ],
      availableOutlets: [
        DEFAULT_OUTLET,
        {
          id: 'out_c_scheme',
          tenantId: 'tnt_beauty_lounge',
          name: 'C-Scheme Boutique',
          code: 'CSC-02',
          address: 'C-Scheme, Jaipur',
          isPrimary: false,
        },
      ],

      setActiveTenant: (tenantInput) => {
        if (typeof tenantInput === 'string') {
          const found = get().availableTenants.find((t) => t.id === tenantInput) || null;
          set({
            activeTenantId: tenantInput,
            activeTenant: found,
          });
        } else {
          set({
            activeTenantId: tenantInput.id,
            activeTenant: tenantInput,
          });
        }
      },

      setActiveOutlet: (outletInput) => {
        if (typeof outletInput === 'string') {
          const found = get().availableOutlets.find((o) => o.id === outletInput) || null;
          set({
            activeOutletId: outletInput,
            activeOutlet: found,
          });
        } else {
          set({
            activeOutletId: outletInput.id,
            activeOutlet: outletInput,
          });
        }
      },

      setAvailableTenants: (availableTenants) => set({ availableTenants }),
      setAvailableOutlets: (availableOutlets) => set({ availableOutlets }),

      clearTenantContext: () =>
        set({
          activeTenantId: null,
          activeOutletId: null,
          activeTenant: null,
          activeOutlet: null,
          availableTenants: [],
          availableOutlets: [],
        }),
    }),
    {
      name: 'salonos_tenant_store',
    }
  )
);
