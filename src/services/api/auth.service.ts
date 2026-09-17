import { API_ENDPOINTS } from '@/config/api';
import { apiClient, publicApiClient } from './axios';

export interface LoginDto {
  email: string;
  password?: string;
}

export interface AuthUserData {
  id: string;
  email: string;
  roles: string[];
  tenantId?: string;
  name?: string;
  avatarUrl?: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: AuthUserData;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApiService = {
  /**
   * Login user via POST /api/auth/login
   */
  async login(credentials: LoginDto): Promise<LoginResponseData> {
    const response = await publicApiClient.post<ApiResponse<LoginResponseData>>(
      API_ENDPOINTS.auth.login,
      credentials
    );
    return response.data.data;
  },

  /**
   * Fetch profile data via GET /api/auth/me
   */
  async getMe(): Promise<AuthUserData> {
    const response = await apiClient.get<ApiResponse<AuthUserData>>(API_ENDPOINTS.auth.me);
    return response.data.data;
  },

  /**
   * Logout user via POST /api/auth/logout
   */
  async logout(refreshToken: string): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.auth.logout,
      { refreshToken }
    );
    return response.data.data;
  },

  /**
   * Request password reset link via POST /api/auth/forgot-password
   */
  async forgotPassword(email: string): Promise<{ message: string; resetUrl?: string }> {
    const response = await publicApiClient.post<ApiResponse<{ message: string; resetUrl?: string }>>(
      API_ENDPOINTS.auth.forgotPassword,
      { email }
    );
    return response.data.data;
  },

  /**
   * Reset password using token via POST /api/auth/reset-password
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await publicApiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.auth.resetPassword,
      { token, newPassword }
    );
    return response.data.data;
  },
};
