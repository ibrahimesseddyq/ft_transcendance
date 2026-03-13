import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export const initializeChatSocketServer = ({ server, prisma, accessTokenSecret, corsOrigin }) => {
  const io = new Server(server, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Track online users: Map<userId, Set<socketId>>
  const onlineUsers = new Map();

  io.use((socket, next) => {
    // Primary: read the httpOnly accessToken cookie.
    let token = null;
    const cookieHeader = socket.handshake.headers.cookie || '';
    const cookieMatch = /(?:^|;\s*)accessToken=([^;]+)/.exec(cookieHeader);
    if (cookieMatch) {
      token = decodeURIComponent(cookieMatch[1]);
    }

    // Fallback: legacy clients passing token via socket.handshake.auth.token
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
    console.log(`User connected: ${userId} (${socket.userRole})`);

    socket.join(`user_${userId}`);

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    const wasOffline = onlineUsers.get(userId).size === 0;
    onlineUsers.get(userId).add(socket.id);

    if (wasOffline) {
      io.emit('user:online', { userId });
      console.log(`User ${userId} is now ONLINE`);
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
        const conversationId = typeof payload === 'object' ? payload.conversationId : payload;
        if (!conversationId) return;

        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId,
            userId
          }
        });

        if (participant) {
          socket.join(conversationId);
          console.log(`User ${userId} joined conversation ${conversationId}`);
        }
      } catch (error) {
        console.error('Error joining conversation:', error);
      }
    };

    socket.on('join:conversation', joinConversationHandler);
    socket.on('conversation:join', joinConversationHandler);

    socket.on('leave:conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${userId} left conversation ${conversationId}`);
    });

    socket.on('typing:start', (conversationId) => {
      socket.to(conversationId).emit('user:typing', {
        userId,
        conversationId
      });
    });

    socket.on('typing:stop', (conversationId) => {
      socket.to(conversationId).emit('user:stopped-typing', {
        userId,
        conversationId
      });
    });

    socket.on('message:new', async (data) => {
      try {
        const { conversationId, message } = data;
        socket.to(conversationId).emit('message:received', message);

        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() }
        });
      } catch (error) {
        console.error('Error broadcasting message:', error);
      }
    });

    socket.on('message:read', async (data) => {
      try {
        const { conversationId } = data;

        socket.to(conversationId).emit('message:read-by', {
          userId,
          conversationId,
          readAt: new Date()
        });

        await prisma.notification.updateMany({
          where: {
            userId,
            type: 'newMessage',
            referenceType: 'conversation',
            referenceId: conversationId,
            isRead: false
          },
          data: { isRead: true }
        });

        io.in(`user_${userId}`).emit('notification:cleared', { conversationId });
      } catch (error) {
        console.error('Error broadcasting read status:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected for user: ${userId}`);
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);
          io.emit('user:offline', { userId });
          console.log(`User ${userId} is now OFFLINE`);
        }
      }
    });
  });

  return io;
};
