import { OutletSummary, TenantSummary } from '@/core/stores/tenant.store';

export const MOCK_TENANTS: TenantSummary[] = [
  {
    id: 'tnt_velvet_vine',
    name: 'Velvet & Vine Luxury Salon',
    slug: 'velvet-vine-manhattan',
    logoUrl: '/images/salon_logo_1.png',
    plan: 'enterprise',
    currency: 'USD',
    timezone: 'America/New_York',
  },
  {
    id: 'tnt_luxe_glow',
    name: 'Luxe Glow Skincare & Spa',
    slug: 'luxe-glow-beverly',
    logoUrl: '/images/salon_logo_2.png',
    plan: 'pro',
    currency: 'USD',
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'tnt_crown_blade',
    name: 'Crown & Blade Grooming Co.',
    slug: 'crown-blade-chicago',
    logoUrl: '/images/salon_logo_3.png',
    plan: 'pro',
    currency: 'USD',
    timezone: 'America/Chicago',
  },
];

export const MOCK_OUTLETS: OutletSummary[] = [
  {
    id: 'out_manhattan_main',
    tenantId: 'tnt_velvet_vine',
    name: 'Manhattan Flagship - 5th Ave',
    code: 'NY-MAIN',
    address: '740 5th Ave, New York, NY 10019',
    isPrimary: true,
  },
  {
    id: 'out_soho_studio',
    tenantId: 'tnt_velvet_vine',
    name: 'SoHo Boutique Studio',
    code: 'NY-SOHO',
    address: '128 Spring St, New York, NY 10012',
    isPrimary: false,
  },
  {
    id: 'out_beverly_hills',
    tenantId: 'tnt_luxe_glow',
    name: 'Beverly Hills Spa Center',
    code: 'LA-BH',
    address: '9684 Wilshire Blvd, Beverly Hills, CA 90212',
    isPrimary: true,
  },
];
