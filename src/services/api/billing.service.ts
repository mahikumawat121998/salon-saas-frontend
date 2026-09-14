import { axiosClient } from './axios-client';

export interface InvoiceLineItem {
  id?: string;
  description: string;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'RAZORPAY' | 'OTHER';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  tenantId: string;
  appointmentId?: string | null;
  customerId: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  totalAmount: number | string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
  };
  appointment?: {
    id: string;
    serviceName?: string;
    startAt?: string;
  } | null;
  items: InvoiceLineItem[];
  payments: PaymentRecord[];
}

export interface CreateInvoiceDto {
  appointmentId?: string;
  customerId?: string;
  additionalItems?: Array<{ description: string; amount: number }>;
}

export interface CreatePaymentDto {
  amount: number;
  method: 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'RAZORPAY' | 'OTHER';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export class BillingApiService {
  private readonly baseUrl = '/billing/invoices';

  async getInvoices(params?: { status?: string; customerId?: string }): Promise<InvoiceItem[]> {
    const response = await axiosClient.get<any>(this.baseUrl, { params });
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  }

  async getInvoice(id: string): Promise<InvoiceItem> {
    const response = await axiosClient.get<any>(`${this.baseUrl}/${id}`);
    return response.data?.data || response.data;
  }

  async createInvoice(dto: CreateInvoiceDto): Promise<InvoiceItem> {
    const response = await axiosClient.post<any>(this.baseUrl, dto);
    return response.data?.data || response.data;
  }

  async recordPayment(invoiceId: string, dto: CreatePaymentDto): Promise<InvoiceItem> {
    const response = await axiosClient.post<any>(`${this.baseUrl}/${invoiceId}/payments`, dto);
    return response.data?.data || response.data;
  }

  async createRazorpayOrder(invoiceId: string, amount: number): Promise<{ orderId: string; amount: number; currency: string; keyId: string }> {
    const response = await axiosClient.post<any>(`${this.baseUrl}/${invoiceId}/razorpay-order`, { amount });
    return response.data?.data || response.data;
  }

  async cancelInvoice(invoiceId: string): Promise<InvoiceItem> {
    const response = await axiosClient.patch<any>(`${this.baseUrl}/${invoiceId}/cancel`);
    return response.data?.data || response.data;
  }
}

export const billingApiService = new BillingApiService();
