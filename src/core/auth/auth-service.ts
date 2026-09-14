import { API_ROUTES } from '@/config/api-routes';
import { axiosClient, publicAxiosClient } from '@/services/api/axios-client';
import { ApiResponse } from '@/types/api';
import { AuthUser } from '@/types/auth';

export interface LoginRequestDto {
  email: string;
  password?: string;
}

export interface LoginResponsePayload {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    roles: string[];
    tenantId?: string;
  };
}

export const authService = {
  /**
   * POST /api/auth/login
   */
  async login(credentials: LoginRequestDto): Promise<LoginResponsePayload> {
    const response = await publicAxiosClient.post<ApiResponse<LoginResponsePayload>>(
      API_ROUTES.auth.login,
      credentials
    );
    return response.data.data;
  },

  /**
   * GET /api/auth/me
   */
  async getMe(): Promise<AuthUser> {
    const response = await axiosClient.get<ApiResponse<AuthUser>>(API_ROUTES.auth.me);
    return response.data.data;
  },

  /**
   * POST /api/auth/refresh
   */
  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await publicAxiosClient.post<ApiResponse<{ accessToken: string }>>(
      API_ROUTES.auth.refresh,
      { refreshToken }
    );
    return response.data.data;
  },

  /**
   * POST /api/auth/logout
   */
  async logout(refreshToken: string): Promise<{ message: string }> {
    const response = await axiosClient.post<ApiResponse<{ message: string }>>(
      API_ROUTES.auth.logout,
      { refreshToken }
    );
    return response.data.data;
  },
};
