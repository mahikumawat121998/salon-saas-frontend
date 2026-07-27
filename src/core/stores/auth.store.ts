import { AUTH_STORAGE_KEYS } from '@/core/constants/auth.constants';
import { AuthUser } from '@/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = AuthUser;

const DEMO_USER: AuthUser = {
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

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, refreshToken: string, user: AuthUser) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEMO_USER,
      token: 'demo_access_token',
      refreshToken: 'demo_refresh_token',
      isAuthenticated: true,
      setAuth: (token: string, refreshToken: string, user: AuthUser) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, token);
          localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
          localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
        }
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
        });
      },
      updateUser: (partial: Partial<AuthUser>) =>
        set((state) => {
          const updatedUser = state.user ? { ...state.user, ...partial } : null;
          if (typeof window !== 'undefined' && updatedUser) {
            localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(updatedUser));
          }
          return { user: updatedUser };
        }),
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
          localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
          localStorage.removeItem(AUTH_STORAGE_KEYS.user);
        }
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: AUTH_STORAGE_KEYS.authStore,
    }
  )
);
