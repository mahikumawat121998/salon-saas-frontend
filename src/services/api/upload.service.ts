import { axiosClient } from './axios-client';

export const uploadService = {
  uploadImage: async (file: File, folderPath?: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const params = folderPath ? new URLSearchParams({ folder: folderPath }) : '';
    const url = `/uploads/image${params ? `?${params.toString()}` : ''}`;

    const response = await axiosClient.post<any>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data?.data?.url || response.data?.url;
  },
};
