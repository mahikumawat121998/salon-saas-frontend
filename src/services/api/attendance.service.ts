import { axiosClient } from './axios-client';
import { ApiResponse } from '@/types/api';

export interface TenantAttendancePolicy {
  id?: string;
  tenantId?: string;
  shiftStartTime: string;
  shiftEndTime: string;
  lateThreshold: number;
  halfDayThreshold: number;
  minWorkingHours: number;
  areBreaksPaid: boolean;
}

export interface StaffAttendanceBreak {
  id: string;
  attendanceId: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  type: 'LUNCH' | 'SHORT' | 'OTHER';
}

export interface StaffAttendance {
  id: string;
  tenantId: string;
  staffId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE' | 'HOLIDAY' | 'WEEK_OFF';
  clockIn: string | null;
  clockOut: string | null;
  totalHours: number;
  workingHours: number;
  overtimeHours: number;
  breaks: StaffAttendanceBreak[];
  staff?: {
    id: string;
    name: string;
    email?: string;
  };
}

class AttendanceApiService {
  async getPolicy(): Promise<TenantAttendancePolicy> {
    const res = await axiosClient.get<ApiResponse<TenantAttendancePolicy>>('/api/attendance-policy');
    return res.data.data;
  }

  async updatePolicy(data: Partial<TenantAttendancePolicy>): Promise<TenantAttendancePolicy> {
    const res = await axiosClient.put<ApiResponse<TenantAttendancePolicy>>('/api/attendance-policy', data);
    return res.data.data;
  }

  async getDailyAttendance(date?: string): Promise<StaffAttendance[]> {
    const params = date ? { date } : {};
    const res = await axiosClient.get<ApiResponse<StaffAttendance[]>>('/attendance', { params });
    return res.data.data;
  }

  async clockIn(staffId: string): Promise<StaffAttendance> {
    const res = await axiosClient.post<ApiResponse<StaffAttendance>>('/attendance/clock-in', { staffId });
    return res.data.data;
  }

  async clockOut(staffId: string): Promise<StaffAttendance> {
    const res = await axiosClient.post<ApiResponse<StaffAttendance>>('/attendance/clock-out', { staffId });
    return res.data.data;
  }

  async startBreak(staffId: string, type: 'LUNCH' | 'SHORT' | 'OTHER'): Promise<StaffAttendanceBreak> {
    const res = await axiosClient.post<ApiResponse<StaffAttendanceBreak>>('/attendance/break/start', { staffId, type });
    return res.data.data;
  }

  async endBreak(staffId: string): Promise<StaffAttendanceBreak> {
    const res = await axiosClient.post<ApiResponse<StaffAttendanceBreak>>('/attendance/break/end', { staffId });
    return res.data.data;
  }
}

export const attendanceApiService = new AttendanceApiService();
