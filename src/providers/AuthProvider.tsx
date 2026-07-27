'use client';

import { useAuthStore } from '@/core/stores/auth.store';
import { AuthUser } from '@/types/auth';
import React, { createContext, useContext, useSyncExternalStore } from 'react';

const FALLBACK_DEMO_USER: AuthUser = {
  id: 'usr_rahul',
  name: 'Rahul Mehta',
  firstName: 'Rahul',
  lastName: 'Mehta',
  email: 'rahul@salonos.com',
  roles: ['super_admin', 'store_owner'],
  permissions: ['*'],
  tenantId: 'tnt_beauty_lounge',
  outletId: 'out_rajapark',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (token: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: FALLBACK_DEMO_USER,
  token: 'demo_token',
  refreshToken: 'demo_refresh_token',
  isAuthenticated: true,
  isHydrated: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

const subscribe = () => () => {};

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, token, refreshToken, setAuth, logout, updateUser, isAuthenticated } = useAuthStore();

  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  return (
    <AuthContext.Provider
      value={{
        user: isAuthenticated ? user : null,
        token: isAuthenticated ? token : null,
        refreshToken: isAuthenticated ? refreshToken : null,
        isAuthenticated: Boolean(isAuthenticated),
        isHydrated,
        login: setAuth,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export type { AuthUser };
