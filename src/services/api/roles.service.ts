import { API_ROUTES } from '@/config/api-routes';
import { axiosClient } from './axios-client';
import { ApiResponse } from '@/types/api';

export interface PermissionItem {
  id: string;
  name: string;
  description?: string;
}

export interface RolePayload {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  permissions?: Array<{
    permission: PermissionItem;
  }>;
  _count?: {
    users: number;
  };
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissionIds?: string[];
}

export interface AssignUserRolesDto {
  userId: string;
  roleIds: string[];
}

export const rolesApiService = {
  /**
   * GET /api/roles/permissions
   */
  async getPermissions(): Promise<PermissionItem[]> {
    const response = await axiosClient.get<ApiResponse<PermissionItem[]>>(API_ROUTES.roles.permissions);
    return response.data.data;
  },

  /**
   * GET /api/roles
   */
  async getRoles(): Promise<RolePayload[]> {
    const response = await axiosClient.get<ApiResponse<RolePayload[]>>(API_ROUTES.roles.list);
    return response.data.data;
  },

  /**
   * GET /api/roles/:id
   */
  async getRoleById(id: string): Promise<RolePayload> {
    const response = await axiosClient.get<ApiResponse<RolePayload>>(API_ROUTES.roles.detail(id));
    return response.data.data;
  },

  /**
   * POST /api/roles
   */
  async createRole(data: CreateRoleDto): Promise<RolePayload> {
    const response = await axiosClient.post<ApiResponse<RolePayload>>(API_ROUTES.roles.create, data);
    return response.data.data;
  },

  /**
   * PATCH /api/roles/:id
   */
  async updateRole(id: string, data: UpdateRoleDto): Promise<RolePayload> {
    const response = await axiosClient.patch<ApiResponse<RolePayload>>(API_ROUTES.roles.update(id), data);
    return response.data.data;
  },

  /**
   * DELETE /api/roles/:id
   */
  async deleteRole(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete<ApiResponse<{ message: string }>>(API_ROUTES.roles.delete(id));
    return response.data.data;
  },

  /**
   * GET /api/roles/user/:userId
   */
  async getUserRoles(userId: string): Promise<{ userId: string; email: string; roles: RolePayload[] }> {
    const response = await axiosClient.get<ApiResponse<{ userId: string; email: string; roles: RolePayload[] }>>(
      `/roles/user/${userId}`
    );
    return response.data.data;
  },

  /**
   * POST /api/roles/assign-user
   */
  async assignRolesToUser(data: AssignUserRolesDto): Promise<any> {
    const response = await axiosClient.post<ApiResponse<any>>('/roles/assign-user', data);
    return response.data.data;
  },
};
