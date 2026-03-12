import axios, { AxiosInstance } from 'axios';
import { Conversation, Message, User } from '../types/chat';

const env_main_api = import.meta.env.VITE_MAIN_API_URL;

class ChatAPI {
  private readonly api: AxiosInstance;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_MAIN_SERVICE_URL;
    
    
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          globalThis.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async getCurrentUser(): Promise<User> {
    const { data } = await this.api.get(`${env_main_api}/users/me`);
    return data.data?.user || data.user || data.data || data;
  }

  async getConversations(): Promise<Conversation[]> {
    const { data } = await this.api.get(`${env_main_api}/conversations`);
    return Array.isArray(data) ? data : data.data || [];
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    const { data } = await this.api.get(`${env_main_api}/conversations/${conversationId}`);
    return data.data || data;
  }

  async getMessages(
    conversationId: string,
    limit: number = 50,
    before?: string
  ): Promise<Message[]> {
    let url = `${env_main_api}/messages/conversation/${conversationId}?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }
    const { data } = await this.api.get(url);
    return Array.isArray(data) ? data : data.data || [];
  }

  async sendMessage(
    conversationId: string,
    content: string,
    messageType: 'text' | 'file' = 'text'
  ): Promise<Message> {
    const { data } = await this.api.post(
      `${env_main_api}/messages/conversation/${conversationId}`,
      { content, messageType }
    );
    return data.data || data;
  }

  async uploadFile(conversationId: string, file: File): Promise<Message> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', conversationId);

    const { data } = await this.api.post(`${env_main_api}/messages/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return Array.isArray(data) ? data[0] : data.data || data;
  }

  async getRecruiter(): Promise<User> {
    const { data } = await this.api.get(`${env_main_api}/conversations/rh-profile`);
    return data.data || data;
  }

  async createConversation(participantId?: string): Promise<Conversation> {
    const body = participantId ? { participantId } : {};
    const { data } = await this.api.post(`${env_main_api}/conversations`, body);
    return data.data || data;
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    await this.api.patch(`${env_main_api}/conversations/${conversationId}/read`);
  }

  async editMessage(messageId: string, content: string): Promise<Message> {
    const { data } = await this.api.patch(`${env_main_api}/messages/${messageId}`, {
      content,
    });
    return data.data || data;
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.api.delete(`${env_main_api}/messages/${messageId}`);
  }
}

export const chatApi = new ChatAPI();
