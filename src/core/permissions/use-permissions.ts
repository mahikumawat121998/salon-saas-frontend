import { useAuthStore } from '../stores/auth.store';

export function usePermissions() {
  const { user } = useAuthStore();

  const userPermissions = user?.permissions || [];
  const userRoles = user?.roles || [];

  const hasPermission = (permission: string): boolean => {
    if (userPermissions.includes('*')) return true;
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (userPermissions.includes('*')) return true;
    return permissions.some((perm) => userPermissions.includes(perm));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (userPermissions.includes('*')) return true;
    return permissions.every((perm) => userPermissions.includes(perm));
  };

  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
  };

  return {
    permissions: userPermissions,
    roles: userRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  };
}
