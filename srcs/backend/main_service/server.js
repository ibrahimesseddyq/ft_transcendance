import app from './src/app.js';
import env from './src/config/env.js';
import {prisma} from './src/config/prisma.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const server = createServer(app);

// Socket.IO server for chat and notifications
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to routes/controllers
app.set('io', io);

// Track online users: Map<userId, Set<socketId>>
const onlineUsers = new Map();

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    // Primary: read the httpOnly accessToken cookie (sent by the browser automatically)
    let token = null;
    const cookieHeader = socket.handshake.headers.cookie || '';
    const match = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]);
    }

    // Fallback: legacy clients passing token via socket.handshake.auth.token
    if (!token) {
      token = socket.handshake.auth?.token;
    }

    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.userId;
  console.log(`User connected: ${userId} (${socket.userRole})`);

  // Join user's personal room
  const personalRoom = `user_${userId}`;
  socket.join(personalRoom);

  // Track this socket for the user; broadcast online only on first connection
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  const wasOffline = onlineUsers.get(userId).size === 0;
  onlineUsers.get(userId).add(socket.id);

  if (wasOffline) {
    io.emit('user:online', { userId });
    console.log(`User ${userId} is now ONLINE`);
  }

  // Return current online user IDs on request
  socket.on('user:getOnlineUsers', (data, callback) => {
    const onlineUserIds = Array.from(onlineUsers.keys()).filter(
      (uid) => onlineUsers.get(uid)?.size > 0
    );
    if (typeof callback === 'function') {
      callback({ success: true, data: onlineUserIds });
    }
  });

  // Join conversation room — support both event names for compatibility
  const joinConversationHandler = async (payload) => {
    try {
      // payload may be a string (conversationId) or object { conversationId }
      const conversationId = typeof payload === 'object' ? payload.conversationId : payload;
      if (!conversationId) return;

      // Verify user is part of the conversation
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversationId,
          userId,
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

  // Leave conversation room
  socket.on('leave:conversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`User ${userId} left conversation ${conversationId}`);
  });

  // Typing indicator
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

  // New message event (broadcast to conversation room)
  socket.on('message:new', async (data) => {
    try {
      const { conversationId, message } = data;
      
      // Broadcast to all users in the conversation except sender
      socket.to(conversationId).emit('message:received', message);
      
      // Update conversation updatedAt
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
      });
    } catch (error) {
      console.error('Error broadcasting message:', error);
    }
  });

  // Message read event
  socket.on('message:read', async (data) => {
    try {
      const { conversationId } = data;

      // Broadcast read status to other participants in the conversation
      socket.to(conversationId).emit('message:read-by', {
        userId,
        conversationId,
        readAt: new Date()
      });

      // Auto-mark any unread newMessage notifications for this conversation as read
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

      // Tell the user's bell to clear the badge for this conversation
      io.in(`user_${userId}`).emit('notification:cleared', { conversationId });
    } catch (error) {
      console.error('Error broadcasting read status:', error);
    }
  });

  // Disconnect — only broadcast offline when the user's last socket disconnects
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

server.listen(env.PORT, () => {
  console.log(`Server running on port http://${env.HOST}:${env.PORT}`);
});

