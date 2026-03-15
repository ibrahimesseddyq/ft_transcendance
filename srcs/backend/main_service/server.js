import app from './src/app.js';
import env from './src/config/env.js';
import {prisma} from './src/config/prisma.js';
import { createServer } from 'node:http';
import { initializeChatSocketServer } from './src/services/chatSocketServer.js';

const server = createServer(app);

const io = initializeChatSocketServer({
  server,
  prisma,
  accessTokenSecret: env.ACCESS_TOKEN_SECRET,
  corsOrigin: env.FRONTEND_URL
});

// Make io accessible to routes/controllers
app.set('io', io);

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

server.listen(env.PORT, () => {
  console.log(`Server running on port http://${env.HOST}:${env.PORT}`);
});

