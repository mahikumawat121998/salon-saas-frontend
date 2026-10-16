import { axiosClient } from './axios-client';

export interface AiMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'model' | 'assistant' | 'system';
  content: string;
  toolCalls?: any;
  toolResults?: any;
  createdAt: string;
}

export interface AiConversation {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: AiMessage[];
}

export interface SendAiMessagePayload {
  message: string;
  conversationId?: string;
}

export interface SendAiMessageResponse {
  conversationId: string;
  message: AiMessage;
  structuredCards?: Array<{
    name: string;
    args: any;
    result: any;
  }>;
}

export const aiApiService = {
  async sendMessage(payload: SendAiMessagePayload): Promise<SendAiMessageResponse> {
    const response = await axiosClient.post('/ai/chat', payload);
    return (response.data as any).data || response.data;
  },

  async getConversations(): Promise<AiConversation[]> {
    const response = await axiosClient.get('/ai/conversations');
    return (response.data as any).data || response.data;
  },

  async getConversation(id: string): Promise<AiConversation> {
    const response = await axiosClient.get(`/ai/conversations/${id}`);
    return (response.data as any).data || response.data;
  },

  async deleteConversation(id: string): Promise<{ success: boolean }> {
    const response = await axiosClient.delete(`/ai/conversations/${id}`);
    return (response.data as any).data || response.data;
  },
};
