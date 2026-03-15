import  express from "express";
import mcqsRoutes from './src/routes/mcqRoutes.js'
import testsRoutes from './src/routes/testRoutes.js'
import internalRoutes from './src/routes/internalRoutes.js'
import { verifyApiKey } from "./src/middleware/verifyApiKey.js";
import { verifyInternalApiKey } from "./src/middleware/verifyInternalApiKey.js";
import { apiRateLimiter } from "./src/middleware/rateLimiter.js";
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import {verifyToken} from './src/middleware/auth.js';
import {verifyRoles} from './src/middleware/auth.js';
import { swaggerSpec } from './src/config/swagger.js';
import cookieParser from 'cookie-parser';
import errorHandler from "./src/middleware/ErrorHandler.js";

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use('/api/quiz/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/quiz/docs.json', (req, res) => res.json(swaggerSpec));

app.use('/api/quiz/internal/tests',verifyInternalApiKey,internalRoutes)

app.use('/api/quiz/public/mcqs',apiRateLimiter, verifyApiKey, mcqsRoutes);
app.use('/api/quiz/public/tests',apiRateLimiter,verifyApiKey, testsRoutes);

app.use('/api/quiz/mcqs',apiRateLimiter,verifyToken, verifyRoles(['recruiter']), mcqsRoutes);
app.use('/api/quiz/tests',apiRateLimiter,verifyToken, verifyRoles(['recruiter']), testsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running " });
});


app.get('/health', async (req, res) => {
  try {
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

app.get("/info", (req, res) => {
  res.json({ app: process.env.APP_NAME || "service" });
});

app.use(errorHandler)

export default app
