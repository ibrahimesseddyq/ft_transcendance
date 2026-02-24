import app from './src/app.js';
import env from './src/config/env.js';
import {prisma} from './src/config/prisma.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer(app);

// Socket.IO server for chat and notifications
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('authenticate', ({ token, user }) => {
    socket.user = user;
    socket.join(`user_${user.id}`);
    io.emit('user_online', { userId: user.id });
  });

  socket.on('join-private-room', (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on('send_message', (data) => {
    io.to(`user_${data.recipientId}`).emit('new_message', { ...data, timestamp: new Date().toISOString() });
    socket.emit('message_sent', { ...data, timestamp: new Date().toISOString() });
  });

  socket.on('typing', (data) => {
    io.to(`user_${data.recipientId}`).emit('user_typing', { userId: socket.user?.id, conversationId: data.conversationId });
  });

  socket.on('stop_typing', (data) => {
    io.to(`user_${data.recipientId}`).emit('user_stopped_typing', { userId: socket.user?.id, conversationId: data.conversationId });
  });

  socket.on('disconnect', () => {
    if (socket.user) io.emit('user_offline', { userId: socket.user.id });
  });
});

server.listen(env.PORT, () => {
  console.log(`Server running on port http://${env.HOST}:${env.PORT}`);
})
