import { axiosClient } from './axios-client';

export interface InventoryProduct {
  id: string;
  tenantId: string;
  name: string;
  sku: string;
  category: string;
  categoryBg?: string;
  categoryColor?: string;
  brand?: string;
  stock: number;
  unit?: string;
  price?: string;
  status: string;
  image?: string;
  reorderLevel: number;
  purchasePrice?: string;
  sellingPrice?: string;
  barcode?: string;
  expiryDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateInventoryDto = Omit<InventoryProduct, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>;
export type UpdateInventoryDto = Partial<CreateInventoryDto>;

class InventoryApiService {
  private readonly baseUrl = '/inventory';

  async getInventory(): Promise<InventoryProduct[]> {
    const response = await axiosClient.get<any>(this.baseUrl);
    return response.data?.data || response.data;
  }

  async getProduct(id: string): Promise<InventoryProduct> {
    const response = await axiosClient.get<any>(`${this.baseUrl}/${id}`);
    return response.data?.data || response.data;
  }

  async createProduct(data: CreateInventoryDto): Promise<InventoryProduct> {
    const response = await axiosClient.post<any>(this.baseUrl, data);
    return response.data?.data || response.data;
  }

  async updateProduct(id: string, data: UpdateInventoryDto): Promise<InventoryProduct> {
    const response = await axiosClient.put<any>(`${this.baseUrl}/${id}`, data);
    return response.data?.data || response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await axiosClient.delete<any>(`${this.baseUrl}/${id}`);
    return response.data?.data || response.data;
  }
}

export const inventoryApiService = new InventoryApiService();
