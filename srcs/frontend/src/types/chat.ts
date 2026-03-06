export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
  company?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  content: string;
  messageType: 'text' | 'file' | 'system';
  senderId: string;
  conversationId: string;
  createdAt: string;
  updatedAt: string;
  isRead?: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileMimetype?: string;
}

export interface Participant {
  userId: string;
  role: string;
  joinedAt: string;
  user: User;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface TypingUser {
  userId: string;
  userName: string;
}

export interface ChatState {
  user: User | null;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  onlineUsers: Set<string>;
  typingUsers: Map<string, TypingUser>;
  isConnected: boolean;
}

export interface SocketResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
