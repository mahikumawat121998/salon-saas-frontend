import { axiosClient } from './axios-client';
import { ApiResponse } from '@/types/api';

export interface StaffItem {
  id: string;
  tenantId: string;
  name: string;
  phone: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  schedules?: StaffScheduleItem[];
}

export interface StaffScheduleItem {
  id?: string;
  staffId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

export const staffApiService = {
  async getStaff(): Promise<StaffItem[]> {
    const response = await axiosClient.get<ApiResponse<StaffItem[]>>('/staff');
    return response.data.data;
  },

  async createStaff(data: any): Promise<StaffItem> {
    const response = await axiosClient.post<ApiResponse<StaffItem>>('/staff', data);
    return response.data.data;
  },

  async updateStaff(id: string, data: any): Promise<StaffItem> {
    const response = await axiosClient.patch<ApiResponse<StaffItem>>(`/staff/${id}`, data);
    return response.data.data;
  },

  async getStaffSchedule(staffId: string): Promise<StaffScheduleItem[]> {
    const response = await axiosClient.get<ApiResponse<StaffScheduleItem[]>>(`/staff/${staffId}/schedules`);
    return response.data.data;
  },

  async updateStaffSchedule(staffId: string, schedules: StaffScheduleItem[]): Promise<any> {
    const response = await axiosClient.put(`/staff/${staffId}/schedules`, { schedules });
    return response.data;
  },
};
