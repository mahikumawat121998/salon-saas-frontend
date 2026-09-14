'use client';

import { useAuth } from '@/providers/AuthProvider';
import { FullScreenLoader } from '@/shared/components/loaders/FullScreenLoader';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectToLogin?: boolean;
}

export function AuthGuard({ children, redirectToLogin = true }: AuthGuardProps) {
  const { isHydrated, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated) {
      if (!isAuthenticated && redirectToLogin) {
        router.replace('/login');
        return;
      }

      // If user is a Super Admin trying to access /dashboard without active impersonation
      const isSuperAdmin =
        Boolean(user?.isSuperAdmin) ||
        user?.roles?.includes('super_admin') ||
        user?.roles?.includes('SUPER_ADMIN') ||
        user?.email === 'superadmin@sams.com' ||
        user?.email === 'admin@salon.com';

      if (isAuthenticated && isSuperAdmin && typeof window !== 'undefined') {
        const isImpersonating = Boolean(sessionStorage.getItem('sams_impersonating'));
        if (!isImpersonating) {
          router.replace('/admin/tenants');
        }
      }
    }
  }, [isHydrated, isAuthenticated, user, redirectToLogin, router]);

  if (!isHydrated) {
    return <FullScreenLoader message="Loading SalonOS..." />;
  }

  if (!isAuthenticated && redirectToLogin) {
    return null;
  }

  // Prevent flashing the tenant dashboard if we are about to redirect a super admin
  const isSuperAdmin =
    Boolean(user?.isSuperAdmin) ||
    user?.roles?.includes('super_admin') ||
    user?.roles?.includes('SUPER_ADMIN') ||
    user?.email === 'superadmin@sams.com' ||
    user?.email === 'admin@salon.com';

  const isImpersonating = typeof window !== 'undefined' ? Boolean(sessionStorage.getItem('sams_impersonating')) : false;

  if (isAuthenticated && isSuperAdmin && !isImpersonating) {
    return <FullScreenLoader message="Redirecting to Admin Portal..." />;
  }

  return <>{children}</>;
}

export default AuthGuard;
