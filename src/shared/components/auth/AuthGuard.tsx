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
  const { isHydrated, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAuthenticated && redirectToLogin) {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, redirectToLogin, router]);

  if (!isHydrated) {
    return <FullScreenLoader message="Loading SalonOS..." />;
  }

  if (!isAuthenticated && redirectToLogin) {
    return null;
  }

  return <>{children}</>;
}

export default AuthGuard;
