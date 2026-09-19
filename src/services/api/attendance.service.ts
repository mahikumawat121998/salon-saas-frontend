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
  staff: {
    id: string;
    name: string;
    profilePicture: string | null;
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

  async getDailyAttendance(date?: string): Promise<any[]> {
    const params = date ? { date } : {};
    const res = await axiosClient.get<ApiResponse<any[]>>('/staff/attendance', { params });
    return res.data.data;
  }

  async clockIn(staffId: string, date: string, clockInTime?: string): Promise<StaffAttendance> {
    const isoDate = new Date(date).toISOString();
    const res = await axiosClient.post<ApiResponse<StaffAttendance>>(`/staff/${staffId}/attendance/clock-in`, { date: isoDate, clockInTime });
    return res.data.data;
  }

  async clockOut(staffId: string, date: string, clockOutTime?: string): Promise<StaffAttendance> {
    const isoDate = new Date(date).toISOString();
    const res = await axiosClient.post<ApiResponse<StaffAttendance>>(`/staff/${staffId}/attendance/clock-out`, { date: isoDate, clockOutTime });
    return res.data.data;
  }

  async markAbsent(staffId: string, date: string, status: string = 'ABSENT'): Promise<StaffAttendance> {
    const isoDate = new Date(date).toISOString();
    const res = await axiosClient.post<ApiResponse<StaffAttendance>>(`/staff/${staffId}/attendance/mark-absent`, { date: isoDate, status });
    return res.data.data;
  }

  async startBreak(staffId: string, type: 'LUNCH' | 'SHORT' | 'OTHER' = 'LUNCH'): Promise<any> {
    const res = await axiosClient.post<ApiResponse<any>>(`/staff/${staffId}/attendance/break/start`, { type });
    return res.data.data;
  }

  async endBreak(staffId: string): Promise<any> {
    const res = await axiosClient.post<ApiResponse<any>>(`/staff/${staffId}/attendance/break/end`);
    return res.data.data;
  }
}

export const attendanceApiService = new AttendanceApiService();
