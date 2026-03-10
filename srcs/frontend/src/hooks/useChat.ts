import { useState, useEffect, useCallback, useRef } from 'react';
import { chatApi } from '../services/chatApi';
import { chatSocket } from '../services/chatSocket';
import { Conversation, Message, ChatState } from '../types/chat';
import { toast } from 'react-toastify';


function normalizeMessage(raw: any): Message {
  const att = raw.attachments?.[0];
  return {
    ...raw,
    messageType: ['image', 'video', 'file'].includes(raw.messageType) ? 'file' : (raw.messageType ?? 'text'),
    fileUrl: raw.fileUrl ?? att?.filePath ?? undefined,
    fileName: raw.fileName ?? att?.fileName ?? undefined,
    fileSize: raw.fileSize ?? att?.fileSize ?? undefined,
    fileMimetype: raw.fileMimetype ?? att?.mimeType ?? undefined,
  };
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    user: null,
    conversations: [],
    currentConversation: null,
    messages: [],
    onlineUsers: new Set(),
    typingUsers: new Map(),
    isConnected: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [recruiter, setRecruiter] = useState<any>(null);
  const [isLoadingRecruiter, setIsLoadingRecruiter] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get current user
        const user = await chatApi.getCurrentUser();
        setState((prev) => ({ ...prev, user }));

        // Connect socket
        chatSocket.connect();

        // Check if user is candidate
        const isCandidate = user.role?.toLowerCase() === 'candidate';

        if (isCandidate) {
          // For candidates, load recruiter profile and create/get conversation
          setIsLoadingRecruiter(true);
          try {
            const recruiterData = await chatApi.getRecruiter();
            setRecruiter(recruiterData);

            // Create or get conversation with recruiter
            const conversation = await chatApi.createConversation();

            // Load messages before joining room to avoid race with socket events
            const rawMessages = await chatApi.getMessages(conversation.id);

            // Single atomic setState — no window for socket events to race
            setState((prev) => ({
              ...prev,
              conversations: [conversation],
              currentConversation: conversation,
              messages: rawMessages.map(normalizeMessage).reverse(),
            }));

            // Join room only after state is settled
            chatSocket.joinConversation(conversation.id);
          } catch (error) {
            console.error('Failed to load recruiter profile:', error);
          } finally {
            setIsLoadingRecruiter(false);
          }
        } else {
          // For RH/Admin, load conversations list
          const conversations = await chatApi.getConversations();
          setState((prev) => ({ ...prev, conversations }));

          // Restore last open conversation from sessionStorage
          const savedId = sessionStorage.getItem('chat_conversationId');
          if (savedId) {
            const saved = conversations.find((c) => c.id === savedId);
            if (saved) {
              const rawMessages = await chatApi.getMessages(savedId);
              setState((prev) => ({
                ...prev,
                currentConversation: saved,
                messages: rawMessages.map(normalizeMessage).reverse(),
              }));
              chatSocket.joinConversation(savedId);
              chatSocket.markAsRead(savedId);
            }
          }
        }

        setIsLoading(false);
      } catch (error: any) {
        console.error('Failed to initialize chat:', error);
        toast.error('Failed to load chat. Please refresh the page.');
        setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      chatSocket.disconnect();
    };
  }, []);

  // Stable socket listeners: connection + status events.
  // These never re-register while the component is mounted so no status events are missed.
  useEffect(() => {
    const handleConnect = () => {
      setState((prev) => ({ ...prev, isConnected: true }));
      // Re-request online users list on every (re)connect so state is
      // always fresh without needing a page refresh.
      chatSocket.requestOnlineUsers();
    };

    const handleDisconnect = () => {
      setState((prev) => ({ ...prev, isConnected: false }));
    };

    const handleError = (error: any) => {
      console.error('Socket error:', error);
      toast.error('Connection error. Retrying...');
    };

    const handleUserOnline = (data: { userId: string }) => {
      setState((prev) => {
        const newOnlineUsers = new Set(prev.onlineUsers);
        newOnlineUsers.add(data.userId);
        return { ...prev, onlineUsers: newOnlineUsers };
      });
    };

    const handleUserOffline = (data: { userId: string }) => {
      setState((prev) => {
        const newOnlineUsers = new Set(prev.onlineUsers);
        newOnlineUsers.delete(data.userId);
        return { ...prev, onlineUsers: newOnlineUsers };
      });
    };

    const handleOnlineUsers = (data: { userIds: string[] }) => {
      setState((prev) => ({
        ...prev,
        onlineUsers: new Set(data.userIds),
      }));
    };

    const handleNewConversation = (data: { conversation: Conversation }) => {
      setState((prev) => {
        if (prev.conversations.some((c) => c.id === data.conversation.id)) {
          return prev;
        }
        return {
          ...prev,
          conversations: [data.conversation, ...prev.conversations],
        };
      });
    };

    chatSocket.on('onConnect', handleConnect);
    chatSocket.on('onDisconnect', handleDisconnect);
    chatSocket.on('onError', handleError);
    chatSocket.on('onUserOnline', handleUserOnline);
    chatSocket.on('onUserOffline', handleUserOffline);
    chatSocket.on('onOnlineUsers', handleOnlineUsers);
    chatSocket.on('onNewConversation', handleNewConversation);

    return () => {
      chatSocket.off('onConnect', handleConnect);
      chatSocket.off('onDisconnect', handleDisconnect);
      chatSocket.off('onError', handleError);
      chatSocket.off('onUserOnline', handleUserOnline);
      chatSocket.off('onUserOffline', handleUserOffline);
      chatSocket.off('onOnlineUsers', handleOnlineUsers);
      chatSocket.off('onNewConversation', handleNewConversation);
    };
  }, []); // intentionally stable — never re-registers

  // Conversation-specific listeners: messages + typing.
  // Re-registers when the open conversation changes.
  useEffect(() => {
    const handleNewMessage = (data: { message: any; conversationId: string }) => {
      const { message: raw, conversationId } = data;
      const message = normalizeMessage(raw);

      setState((prev) => {
        // Add to messages only if this is the current conversation
        const updatedMessages =
          prev.currentConversation?.id === conversationId &&
          !prev.messages.some((m) => m.id === message.id)
            ? [...prev.messages, message]
            : prev.messages;

        // Update last message + unread count in conversation list
        const updatedConversations = prev.conversations.map((conv) => {
          if (conv.id !== conversationId) return conv;
          return {
            ...conv,
            lastMessage: message,
            unreadCount:
              prev.currentConversation?.id === conversationId
                ? conv.unreadCount
                : (conv.unreadCount || 0) + 1,
          };
        });

        return { ...prev, messages: updatedMessages, conversations: updatedConversations };
      });

      // Mark as read if it's the active conversation
      setState((prev) => {
        if (prev.currentConversation?.id === conversationId) {
          chatSocket.markAsRead(conversationId);
        }
        return prev;
      });
    };

    const handleTypingUpdate = (data: {
      conversationId: string;
      userId: string;
      userName: string;
      isTyping: boolean;
    }) => {
      setState((prev) => {
        if (data.conversationId !== prev.currentConversation?.id) return prev;
        const newTypingUsers = new Map(prev.typingUsers);
        if (data.isTyping) {
          newTypingUsers.set(data.userId, { userId: data.userId, userName: data.userName });
        } else {
          newTypingUsers.delete(data.userId);
        }
        return { ...prev, typingUsers: newTypingUsers };
      });
    };

    chatSocket.on('onNewMessage', handleNewMessage);
    chatSocket.on('onTypingUpdate', handleTypingUpdate);

    return () => {
      chatSocket.off('onNewMessage', handleNewMessage);
      chatSocket.off('onTypingUpdate', handleTypingUpdate);
    };
  }, [state.currentConversation?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  // Select a conversation
  const selectConversation = useCallback(async (conversationId: string) => {
    try {
      setIsLoadingMessages(true);

      const conversation = state.conversations.find((c) => c.id === conversationId);
      if (!conversation) return;

      // Persist so it survives a page refresh
      sessionStorage.setItem('chat_conversationId', conversationId);

      // Load messages before updating currentConversation to avoid race
      const rawMessages = await chatApi.getMessages(conversationId);
      const loaded = rawMessages.map(normalizeMessage);

      setState((prev) => {
        // Merge any socket messages that arrived while we were loading
        const existing = new Set(loaded.map((m) => m.id));
        const socketMessages = prev.messages.filter(
          (m) => m.conversationId === conversationId && !existing.has(m.id)
        );
        return {
          ...prev,
          currentConversation: conversation,
          messages: [...loaded, ...socketMessages].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
          conversations: prev.conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
          ),
        };
      });

      // Join room and mark read after state is set
      chatSocket.joinConversation(conversationId);
      chatSocket.markAsRead(conversationId);
      await chatApi.markConversationAsRead(conversationId);

      // Refresh online status for all participants in this conversation
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv?.participants) {
        conv.participants.forEach(async (p: any) => {
          const uid = p.userId ?? p.id;
          if (!uid || uid === state.user?.id) return;
          try {
            const { isOnline } = await chatSocket.getUserStatus(uid);
            setState((prev) => {
              const updated = new Set(prev.onlineUsers);
              if (isOnline) updated.add(uid);
              else updated.delete(uid);
              return { ...prev, onlineUsers: updated };
            });
          } catch {}
        });
      }

      setIsLoadingMessages(false);
    } catch (error: any) {
      console.error('Failed to load conversation:', error);
      toast.error('Failed to load messages');
      setIsLoadingMessages(false);
    }
  }, [state.conversations]);

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!state.currentConversation || !content.trim()) return;

      try {
        const raw = await chatApi.sendMessage(
          state.currentConversation.id,
          content.trim()
        );
        const message = normalizeMessage(raw);
        setState((prev) => {
          if (prev.messages.some((m) => m.id === message.id)) return prev;
          return {
            ...prev,
            messages: [...prev.messages, message],
            conversations: prev.conversations.map((conv) =>
              conv.id === message.conversationId
                ? { ...conv, lastMessage: message }
                : conv
            ),
          };
        });
      } catch (error: any) {
        console.error('Failed to send message:', error);
        toast.error('Failed to send message');
      }
    },
    [state.currentConversation]
  );

  // Upload and send file
  const sendFile = useCallback(
    async (file: File) => {
      if (!state.currentConversation) return;

      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File is too large (max 100 MB)');
        return;
      }

      try {
        const raw = await chatApi.uploadFile(state.currentConversation.id, file);
        const message = normalizeMessage(raw);
        setState((prev) => {
          if (prev.messages.some((m) => m.id === message.id)) return prev;
          return {
            ...prev,
            messages: [...prev.messages, message],
            conversations: prev.conversations.map((conv) =>
              conv.id === message.conversationId
                ? { ...conv, lastMessage: message }
                : conv
            ),
          };
        });
        toast.success('File uploaded successfully');
      } catch (error: any) {
        console.error('Failed to upload file:', error);
        toast.error('Failed to upload file');
      }
    },
    [state.currentConversation]
  );

  // Start typing indicator
  const startTyping = useCallback(() => {
    if (state.currentConversation) {
      chatSocket.startTyping(state.currentConversation.id);
    }
  }, [state.currentConversation]);

  // Stop typing indicator
  const stopTyping = useCallback(() => {
    if (state.currentConversation) {
      chatSocket.stopTyping(state.currentConversation.id);
    }
  }, [state.currentConversation]);

  // Get other participant in conversation
  const getOtherParticipant = useCallback(
    (conversation: Conversation) => {
      return conversation.participants.find((p) => p.userId !== state.user?.id);
    },
    [state.user]
  );

  return {
    user: state.user,
    conversations: state.conversations,
    currentConversation: state.currentConversation,
    messages: state.messages,
    onlineUsers: state.onlineUsers,
    typingUsers: state.typingUsers,
    isConnected: state.isConnected,
    isLoading,
    isLoadingMessages,
    recruiter,
    isLoadingRecruiter,
    messagesEndRef,
    selectConversation,
    sendMessage,
    sendFile,
    startTyping,
    stopTyping,
    getOtherParticipant,
  };
}
