import { axiosClient } from './axios-client';
import { ApiResponse } from '@/types/api';

export interface StaffItem {
  id: string;
  tenantId: string;
  name: string;
  phone: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export const staffApiService = {
  async getStaff(): Promise<StaffItem[]> {
    const response = await axiosClient.get<ApiResponse<StaffItem[]>>('/staff');
    return response.data.data;
  },
};
