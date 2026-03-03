const express = require('express');
const router = express.Router();
const chatRoutes = require('./chatRoutes');
const messageRoutes = require('./messageRoutes');
const { pool } = require('../config/database');

/**
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: 'OK',
    database: 'disconnected'
  };

  try {
    // Test database connection
    await pool.query('SELECT 1');
    health.database = 'connected';
  } catch (error) {
    health.status = 'ERROR';
    health.database = 'disconnected';
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json({
    success: health.status === 'OK',
    message: 'Chat microservice health check',
    data: health,
  });
});

/**
 * Mount routes
 */
router.use('/chats', chatRoutes);
router.use('/chats', messageRoutes);

module.exports = router;
