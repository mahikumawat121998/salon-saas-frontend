export type SystemRole =
  | 'super_admin'
  | 'system_admin'
  | 'support_admin'
  | 'cluster_owner'
  | 'store_owner'
  | 'manager'
  | 'receptionist'
  | 'stylist'
  | 'customer'
  | string;

export type Permission = string;

// Static fallback mappings for development and mock fixtures
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ['*'],
  system_admin: ['*'],
  store_owner: [
    'appointments:read',
    'appointments:write',
    'appointments:delete',
    'services:read',
    'services:write',
    'services:delete',
    'staff:read',
    'staff:write',
    'staff:delete',
    'customers:read',
    'customers:write',
    'customers:delete',
    'analytics:read',
    'settings:read',
    'settings:write',
    'billing:manage',
  ],
  manager: [
    'appointments:read',
    'appointments:write',
    'appointments:delete',
    'services:read',
    'services:write',
    'staff:read',
    'staff:write',
    'customers:read',
    'customers:write',
    'analytics:read',
    'settings:read',
  ],
  receptionist: [
    'appointments:read',
    'appointments:write',
    'customers:read',
    'customers:write',
    'services:read',
  ],
  stylist: [
    'appointments:read',
    'appointments:write',
    'services:read',
    'customers:read',
    'staff:read',
  ],
  customer: [
    'appointments:read',
    'appointments:write',
    'services:read',
  ],
};

export function hasPermission(
  userPermissions: string[] | undefined,
  requiredPermission: string
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  if (userPermissions.includes('*') || userPermissions.includes('admin:all')) return true;
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userPermissions: string[] | undefined,
  requiredPermissions: string[]
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  return requiredPermissions.some((perm) => hasPermission(userPermissions, perm));
}

export function hasRole(
  userRoles: string[] | undefined,
  requiredRole: string
): boolean {
  if (!userRoles || userRoles.length === 0) return false;
  if (userRoles.includes('super_admin') || userRoles.includes('system_admin')) return true;
  return userRoles.includes(requiredRole);
}
