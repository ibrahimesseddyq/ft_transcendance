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

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
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
  console.log(`User connected: ${socket.userId} (${socket.userRole})`);

  // Join user's personal room
  const personalRoom = `user_${socket.userId}`;
  socket.join(personalRoom);
  console.log(`User ${socket.userId} joined personal room: ${personalRoom}`);
  console.log(`Socket rooms:`, Array.from(socket.rooms));
  
  // Send a test event to verify personal room works
  setTimeout(() => {
    console.log(`Sending test event to ${personalRoom}`);
    io.in(personalRoom).emit('message:new', {
      message: { id: 'test', content: 'Test message', senderId: 'system' },
      conversationId: 'test'
    });
    console.log(`Test event sent to ${personalRoom}`);
  }, 2000);
  
  // Emit user online status
  io.emit('user:online', { userId: socket.userId });

  // Join conversation room
  socket.on('join:conversation', async (conversationId) => {
    try {
      // Verify user is part of the conversation
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversationId,
          userId: socket.userId
        }
      });

      if (participant) {
        socket.join(conversationId);
        console.log(`User ${socket.userId} joined conversation ${conversationId}`);
        console.log(`Socket rooms after join:`, Array.from(socket.rooms));
      }
    } catch (error) {
      console.error('Error joining conversation:', error);
    }
  });

  // Leave conversation room
  socket.on('leave:conversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`User ${socket.userId} left conversation ${conversationId}`);
  });

  // Typing indicator
  socket.on('typing:start', (conversationId) => {
    socket.to(conversationId).emit('user:typing', {
      userId: socket.userId,
      conversationId
    });
  });

  socket.on('typing:stop', (conversationId) => {
    socket.to(conversationId).emit('user:stopped-typing', {
      userId: socket.userId,
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
      
      socket.to(conversationId).emit('message:read-by', {
        userId: socket.userId,
        conversationId,
        readAt: new Date()
      });
    } catch (error) {
      console.error('Error broadcasting read status:', error);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
    io.emit('user:offline', { userId: socket.userId });
  });
});

server.listen(env.PORT, () => {
  console.log(`Server running on port http://${env.HOST}:${env.PORT}`);
});

