import { axiosClient } from './axios-client';
import { ApiResponse } from '@/types/api';

export interface AppointmentItem {
  id: string;
  tenantId: string;
  customerId: string;
  staffId: string;
  serviceId: string;
  appointmentDate: string;
  startAt: string;
  endAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  source: 'ADMIN' | 'ONLINE' | 'WALK_IN' | 'APP';
  serviceName: string;
  durationMinutes: number;
  price: number;
  customerNotes?: string | null;
  internalNotes?: string | null;
  cancellationReason?: string | null;
  createdAt: string;

  // Relations that the backend might return
  customer?: { id: string; name: string; phone?: string | null };
  staff?: { id: string; name: string };
  service?: { id: string; name: string };
}

export interface CreateAppointmentDto {
  customerId: string;
  staffId: string;
  serviceId: string;
  startAt: string; // ISO DateTime string
  source?: 'ADMIN' | 'ONLINE' | 'WALK_IN' | 'APP';
  customerNotes?: string;
  internalNotes?: string;
}

export interface RescheduleAppointmentDto {
  startAt: string; // ISO DateTime string
}

export interface CancelAppointmentDto {
  reason: string;
}

export interface UpdateAppointmentStatusDto {
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
}

export const appointmentApiService = {
  async getAppointments(filters?: Record<string, any>): Promise<AppointmentItem[]> {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString(); // 1 month ago
    const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0).toISOString(); // 3 months from now
    
    const response = await axiosClient.get('/appointments/calendar', { 
      params: { startDate, endDate, ...filters } 
    });
    return (response.data as any).data || response.data;
  },

  async getAppointmentById(id: string): Promise<AppointmentItem> {
    const response = await axiosClient.get(`/appointments/${id}`);
    return (response.data as any).data || response.data;
  },

  async getAvailableSlots(date: string, staffId?: string, serviceId?: string): Promise<any> {
    const response = await axiosClient.get('/appointments/available-slots', { 
      params: { date, staffId, serviceId } 
    });
    return (response.data as any).data || response.data;
  },

  async createAppointment(data: CreateAppointmentDto): Promise<AppointmentItem> {
    const response = await axiosClient.post('/appointments', data);
    return (response.data as any).data || response.data;
  },

  async rescheduleAppointment(id: string, data: RescheduleAppointmentDto): Promise<AppointmentItem> {
    const response = await axiosClient.patch(`/appointments/${id}/reschedule`, data);
    return (response.data as any).data || response.data;
  },

  async cancelAppointment(id: string, data: CancelAppointmentDto): Promise<AppointmentItem> {
    const response = await axiosClient.patch(`/appointments/${id}/cancel`, data);
    return (response.data as any).data || response.data;
  },

  async updateAppointmentStatus(id: string, data: UpdateAppointmentStatusDto): Promise<AppointmentItem> {
    const response = await axiosClient.patch(`/appointments/${id}/status`, data);
    return (response.data as any).data || response.data;
  },
};
