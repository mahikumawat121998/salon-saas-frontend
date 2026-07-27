'use client';

import { hasRole } from '@/config/permissions';
import { useAuth } from '@/providers/AuthProvider';
import { Forbidden } from '@/shared/components/errors/Forbidden';
import React from 'react';

export interface RoleGuardProps {
  children: React.ReactNode;
  role?: string;
  roles?: string[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, role, roles, fallback }: RoleGuardProps) {
  const { user } = useAuth();
  const userRoles = user?.roles || [];

  let isAllowed = true;

  if (role) {
    isAllowed = hasRole(userRoles, role);
  } else if (roles && roles.length > 0) {
    isAllowed = roles.some((r) => hasRole(userRoles, r));
  }

  if (!isAllowed) {
    return fallback || <Forbidden />;
  }

  return <>{children}</>;
}

export default RoleGuard;
