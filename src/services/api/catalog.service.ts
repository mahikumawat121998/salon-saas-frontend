import { API_ROUTES } from '@/config/api-routes';
import { axiosClient } from './axios-client';
import { ApiResponse } from '@/types/api';

export interface ServiceCategory {
  id: string;
  tenantId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  durationMinutes: number;
  price: number;
  tax: number | null;
  status: 'ACTIVE' | 'ARCHIVED';
  commissionRule: string | null;
  category?: ServiceCategory;
  staff?: Array<{ staffId: string; serviceId: string }>;
}

export interface CreateCategoryDto {
  name: string;
}

export interface CreateServiceDto {
  categoryId: string;
  name: string;
  durationMinutes: number;
  price: number;
  tax?: number;
  status?: 'ACTIVE' | 'ARCHIVED';
  commissionRule?: string;
  eligibleStaffIds?: string[];
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {}

export const catalogApiService = {
  // --- Categories ---
  async getCategories(): Promise<ServiceCategory[]> {
    const response = await axiosClient.get<ApiResponse<ServiceCategory[]>>('/catalog/categories');
    return response.data.data;
  },

  async createCategory(data: CreateCategoryDto): Promise<ServiceCategory> {
    const response = await axiosClient.post<ApiResponse<ServiceCategory>>('/catalog/categories', data);
    return response.data.data;
  },

  async updateCategory(id: string, data: CreateCategoryDto): Promise<ServiceCategory> {
    const response = await axiosClient.patch<ApiResponse<ServiceCategory>>(`/catalog/categories/${id}`, data);
    return response.data.data;
  },

  async deleteCategory(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete<ApiResponse<{ message: string }>>(`/catalog/categories/${id}`);
    return response.data.data;
  },

  // --- Services ---
  async getServices(): Promise<ServiceItem[]> {
    const response = await axiosClient.get<ApiResponse<ServiceItem[]>>('/catalog/services');
    return response.data.data;
  },

  async getServiceById(id: string): Promise<ServiceItem> {
    const response = await axiosClient.get<ApiResponse<ServiceItem>>(`/catalog/services/${id}`);
    return response.data.data;
  },

  async createService(data: CreateServiceDto): Promise<ServiceItem> {
    const response = await axiosClient.post<ApiResponse<ServiceItem>>('/catalog/services', data);
    return response.data.data;
  },

  async updateService(id: string, data: UpdateServiceDto): Promise<ServiceItem> {
    const response = await axiosClient.patch<ApiResponse<ServiceItem>>(`/catalog/services/${id}`, data);
    return response.data.data;
  },

  async deleteService(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete<ApiResponse<{ message: string }>>(`/catalog/services/${id}`);
    return response.data.data;
  },
};
