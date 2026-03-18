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

app.set('io', io);

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); 
});

server.listen(env.PORT, () => {
  console.log(`Server running on port http://${env.HOST}:${env.PORT}`);
});

