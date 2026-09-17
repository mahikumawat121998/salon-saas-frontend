import { axiosClient } from './axios-client';
import { ApiResponse } from '@/types/api';

export interface StaffLeave {
  id: string;
  tenantId: string;
  staffId: string;
  startAt: string;
  endAt: string;
  reason: string | null;
  createdAt: string;
  staff?: {
    id: string;
    name: string;
  };
}

class LeaveApiService {
  async getAllLeaves(): Promise<StaffLeave[]> {
    const res = await axiosClient.get<ApiResponse<StaffLeave[]>>('/staff/leaves');
    return res.data.data;
  }

  async createLeave(staffId: string, data: { startAt: string; endAt: string; reason?: string }): Promise<StaffLeave> {
    const res = await axiosClient.post<ApiResponse<StaffLeave>>(`/staff/${staffId}/leaves`, data);
    return res.data.data;
  }

  async deleteLeave(leaveId: string): Promise<void> {
    await axiosClient.delete(`/staff/leaves/${leaveId}`);
  }

  async updateLeaveStatus(leaveId: string, status: 'APPROVED' | 'REJECTED'): Promise<StaffLeave> {
    const res = await axiosClient.patch<ApiResponse<StaffLeave>>(`/staff/leaves/${leaveId}/status`, { status });
    return res.data.data;
  }
}

export const leaveApiService = new LeaveApiService();
