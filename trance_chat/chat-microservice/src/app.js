const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

/**
 * Security Middleware
 */
app.use(helmet());

/**
 * CORS Configuration
 */
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

/**
 * Body Parser Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Logging Middleware (Development)
 */
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
      body: req.body,
      query: req.query,
      headers: {
        'x-user-id': req.headers['x-user-id'],
        'x-user-role': req.headers['x-user-role'],
      },
    });
    next();
  });
}

/**
 * API Routes
 */
app.use('/api', routes);

/**
 * Root Route
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Chat Microservice API - MariaDB',
    version: '1.0.0',
    database: 'MariaDB/MySQL',
    endpoints: {
      health: 'GET /api/health',
      chats: 'GET /api/chats',
      createChat: 'POST /api/chats',
      messages: 'GET /api/chats/:chatId/messages',
      sendMessage: 'POST /api/chats/:chatId/messages',
    },
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

/**
 * Global Error Handler
 */
app.use(errorHandler);

module.exports = app;
