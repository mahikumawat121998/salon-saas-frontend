import { axiosClient } from './axios-client';
import { ApiResponse } from '@/types/api';

export interface CustomerItem {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  dob: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  status: 'ACTIVE' | 'INACTIVE';
  isVip: boolean;
  source: 'WALK_IN' | 'ONLINE' | 'REFERRAL';
  createdAt: string;
  updatedAt: string;
  
  // Computed fields from backend
  totalVisits?: number;
  totalSpent?: number;
  lastVisit?: string | null;
  lastAppointment?: {
    service: string;
    staff: string;
    date: string;
  } | null;
}

export interface CustomerDetails extends CustomerItem {
  customerNotes: Array<{ id: string; note: string; createdAt: string }>;
  appointments: Array<{
    id: string;
    appointmentDate: string;
    status: string;
    serviceName: string;
    price: number;
    staff: { name: string };
  }>;
}

export interface CreateCustomerDto {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  status?: 'ACTIVE' | 'INACTIVE';
  isVip?: boolean;
  source?: 'WALK_IN' | 'ONLINE' | 'REFERRAL';
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

export const customerApiService = {
  async getCustomers(): Promise<CustomerItem[]> {
    const response = await axiosClient.get<CustomerItem[]>('/customers');
    // Note: The backend currently returns the array directly in findAll for customers, or wraps it in ApiResponse depending on the controller setup.
    // Let's assume it returns an array directly based on standard NestJS behavior without an interceptor if one wasn't specifically added to CustomerController, 
    // or if there is a global interceptor, it returns { data: ... }. We'll check if it's wrapped.
    // Actually, looking at other services, they use `response.data.data` because of a global interceptor.
    return (response.data as any).data || response.data;
  },

  async getCustomerById(id: string): Promise<CustomerDetails> {
    const response = await axiosClient.get(`/customers/${id}`);
    return (response.data as any).data || response.data;
  },

  async createCustomer(data: CreateCustomerDto): Promise<CustomerItem> {
    const response = await axiosClient.post('/customers', data);
    return (response.data as any).data?.data || (response.data as any).data || response.data;
  },

  async updateCustomer(id: string, data: UpdateCustomerDto): Promise<CustomerItem> {
    const response = await axiosClient.patch(`/customers/${id}`, data);
    return (response.data as any).data || response.data;
  },

  async deleteCustomer(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(`/customers/${id}`);
    return (response.data as any).data || response.data;
  },
  
  async addNote(customerId: string, note: string): Promise<any> {
    const response = await axiosClient.post(`/customers/${customerId}/notes`, { note });
    return (response.data as any).data || response.data;
  },
  
  async deleteNote(noteId: string): Promise<any> {
    const response = await axiosClient.delete(`/customers/notes/${noteId}`);
    return (response.data as any).data || response.data;
  }
};
