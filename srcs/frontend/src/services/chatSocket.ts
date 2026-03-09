import { io, Socket } from 'socket.io-client';
import { Message, SocketResponse } from '../types/chat';

export type SocketEventCallback = (data: any) => void;

class ChatSocketService {
  private socket: Socket | null = null;
  private readonly baseUrl: string;
  private readonly eventHandlers: Map<string, Set<SocketEventCallback>> = new Map();

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  connect(token?: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(this.baseUrl, {
      auth: token ? { token } : {},
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      this.emit('onConnect', null);
    });

    this.socket.on('disconnect', (reason: string) => {
      this.emit('onDisconnect', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      this.emit('onError', error);
    });

    // Message events
    this.socket.on('message:new', (data: any) => {
      this.emit('onNewMessage', data);
    });

    this.socket.on('message:updated', (data: any) => {
      this.emit('onMessageUpdated', data);
    });

    this.socket.on('message:deleted', (data: any) => {
      this.emit('onMessageDeleted', data);
    });

    this.socket.on('message:read', (data: any) => {
      this.emit('onMessageRead', data);
    });

    // Typing events
    this.socket.on('typing:update', (data: any) => {
      this.emit('onTypingUpdate', data);
    });

    // User status events
    this.socket.on('user:online', (data: any) => {
      this.emit('onUserOnline', data);
    });

    this.socket.on('user:offline', (data: any) => {
      this.emit('onUserOffline', data);
    });

    this.socket.on('user:onlineUsers', (data: any) => {
      this.emit('onOnlineUsers', data);
    });

    // Conversation events
    this.socket.on('conversation:new', (data: any) => {
      this.emit('onNewConversation', data);
    });

    // Notification events
    this.socket.on('notification:new', (data: any) => {
      this.emit('onNotificationNew', data);
    });

    this.socket.on('notification:message', (data: any) => {
      this.emit('onNotification', data);
    });
  }

  on(event: string, handler: SocketEventCallback): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.add(handler);
    }
  }

  off(event: string, handler: SocketEventCallback): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  // Emit events to server
  sendMessage(
    conversationId: string,
    content: string,
    messageType: 'text' | 'file' = 'text'
  ): Promise<Message> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit(
        'message:send',
        { conversationId, content, messageType },
        (response: SocketResponse<Message>) => {
          if (response.success && response.data) {
            resolve(response.data);
          } else {
            reject(new Error(response.error || 'Failed to send message'));
          }
        }
      );
    });
  }

  startTyping(conversationId: string): void {
    this.socket?.emit('typing:start', { conversationId });
  }

  stopTyping(conversationId: string): void {
    this.socket?.emit('typing:stop', { conversationId });
  }

  joinConversation(conversationId: string): void {
    this.socket?.emit('conversation:join', { conversationId });
  }

  markAsRead(conversationId: string): void {
    this.socket?.emit('message:read', { conversationId });
  }

  requestOnlineUsers(): void {
    if (!this.socket) return;
    this.socket.emit('user:getOnlineUsers', {}, (response: { success: boolean; data: string[] }) => {
      if (response?.success && Array.isArray(response.data)) {
        this.emit('onOnlineUsers', { userIds: response.data });
      }
    });
  }

  getUserStatus(userId: string): Promise<{ isOnline: boolean }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit(
        'user:status',
        { userId },
        (response: { isOnline: boolean }) => {
          resolve(response);
        }
      );
    });
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const chatSocket = new ChatSocketService();
