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



server.listen(env.PORT, () => {
  console.log(`Server running on port http://${env.HOST}:${env.PORT}`);
});

