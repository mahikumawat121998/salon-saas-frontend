import { axiosClient } from './axios-client';
import { ApiResponse } from '@/types/api';

export interface StaffLeave {
  id: string;
  tenantId: string;
  staffId: string;
  startAt: string;
  endAt: string;
  reason: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  type: 'CASUAL' | 'SICK' | 'UNPAID' | 'EARNED';
  adminNote?: string | null;
  approvedById?: string | null;
  createdAt: string;
  staff?: {
    id: string;
    name: string;
    profilePicture?: string | null;
  };
}

class LeaveApiService {
  async getAllLeaves(): Promise<StaffLeave[]> {
    const res = await axiosClient.get<ApiResponse<StaffLeave[]>>('/staff/leaves');
    return res.data.data;
  }

  async createLeave(staffId: string, data: { startAt: string; endAt: string; reason?: string; type: string }): Promise<StaffLeave> {
    const res = await axiosClient.post<ApiResponse<StaffLeave>>(`/staff/${staffId}/leaves`, data);
    return res.data.data;
  }

  async deleteLeave(leaveId: string): Promise<void> {
    await axiosClient.delete(`/staff/leaves/${leaveId}`);
  }

  async updateLeaveStatus(leaveId: string, status: 'APPROVED' | 'REJECTED' | 'CANCELLED', adminNote?: string): Promise<StaffLeave> {
    const res = await axiosClient.patch<ApiResponse<StaffLeave>>(`/staff/leaves/${leaveId}/status`, { status, adminNote });
    return res.data.data;
  }
}

export const leaveApiService = new LeaveApiService();
