'use client';

import { hasAnyPermission, hasPermission } from '@/config/permissions';
import { useAuth } from '@/providers/AuthProvider';
import { Forbidden } from '@/shared/components/errors/Forbidden';
import React from 'react';

export interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  permissions,
  fallback,
}: PermissionGuardProps) {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];

  let isAllowed = true;

  if (permission) {
    isAllowed = hasPermission(userPermissions, permission);
  } else if (permissions && permissions.length > 0) {
    isAllowed = hasAnyPermission(userPermissions, permissions);
  }

  if (!isAllowed) {
    return fallback || <Forbidden />;
  }

  return <>{children}</>;
}

export default PermissionGuard;
