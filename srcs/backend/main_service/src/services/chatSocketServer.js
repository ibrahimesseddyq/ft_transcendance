import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { registerNotificationSocketEvents } from './notificationSocketEvents.js';
import {
  conversationIdSchema,
  joinConversationPayloadSchema,
  socketNewMessageSchema
} from '../validators/chatValidator.js';

export const initializeChatSocketServer = ({ server, prisma, accessTokenSecret, corsOrigin }) => {
  const io = new Server(server, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  const onlineUsers = new Map();

  io.use((socket, next) => {

    let token = null;
    const cookieHeader = socket.handshake.headers.cookie || '';
    const cookieMatch = /(?:^|;\s*)accessToken=([^;]+)/.exec(cookieHeader);
    if (cookieMatch) {
      token = decodeURIComponent(cookieMatch[1]);
    }

    if (!token) {
      token = socket.handshake.auth?.token;
    }

    if (!token) {
      next(new Error('Authentication error'));
      return;
    }

    try {
      const decoded = jwt.verify(token, accessTokenSecret);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    socket.join(`user_${userId}`);

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    const wasOffline = onlineUsers.get(userId).size === 0;
    onlineUsers.get(userId).add(socket.id);

    if (wasOffline) {
      io.emit('user:online', { userId });
    }

    socket.on('user:getOnlineUsers', (_data, callback) => {
      const onlineUserIds = Array.from(onlineUsers.keys()).filter(
        (uid) => onlineUsers.get(uid)?.size > 0
      );
      if (typeof callback === 'function') {
        callback({ success: true, data: onlineUserIds });
      }
    });

    socket.on('user:status', ({ userId: targetUserId }, callback) => {
      const isOnline = Boolean(
        targetUserId &&
        onlineUsers.has(targetUserId) &&
        onlineUsers.get(targetUserId)?.size > 0
      );

      if (typeof callback === 'function') {
        callback({ isOnline });
      }
    });

    const joinConversationHandler = async (payload) => {
      try {
        const parsedPayload = joinConversationPayloadSchema.safeParse(payload);
        if (!parsedPayload.success) return;

        const conversationId =
          typeof parsedPayload.data === 'string'
            ? parsedPayload.data
            : parsedPayload.data.conversationId;

        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId,
            userId
          }
        });

        if (participant) {
          socket.join(conversationId);
        }
      } catch {
      }
    };

    socket.on('join:conversation', joinConversationHandler);
    socket.on('conversation:join', joinConversationHandler);

    socket.on('leave:conversation', (conversationId) => {
      const parsedConversationId = conversationIdSchema.safeParse(conversationId);
      if (!parsedConversationId.success) return;

      socket.leave(parsedConversationId.data);
    });

    socket.on('typing:start', (conversationId) => {
      const parsedConversationId = conversationIdSchema.safeParse(conversationId);
      if (!parsedConversationId.success) return;

      socket.to(parsedConversationId.data).emit('user:typing', {
        userId,
        conversationId: parsedConversationId.data
      });
    });

    socket.on('typing:stop', (conversationId) => {
      const parsedConversationId = conversationIdSchema.safeParse(conversationId);
      if (!parsedConversationId.success) return;

      socket.to(parsedConversationId.data).emit('user:stopped-typing', {
        userId,
        conversationId: parsedConversationId.data
      });
    });

    socket.on('message:new', async (data) => {
      try {
        const parsedData = socketNewMessageSchema.safeParse(data);
        if (!parsedData.success) return;

        const { conversationId, message } = parsedData.data;
        socket.to(conversationId).emit('message:received', message);

        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() }
        });
      } catch {
      }
    });

    registerNotificationSocketEvents({ io, socket, prisma, userId });

    socket.on('disconnect', () => {
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);
          io.emit('user:offline', { userId });
        }
      }
    });
  });

  return io;
};
