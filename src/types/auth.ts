export interface AuthUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roles: string[];
  permissions: string[];
  tenantModules?: string[];
  subscriptionStatus?: string;
  trialEndsAt?: string | null;
  isTrialExpired?: boolean;
  tenantId?: string;
  outletId?: string;
  avatarUrl?: string;
  isSuperAdmin?: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: AuthUser;
}

export type User = AuthUser;
