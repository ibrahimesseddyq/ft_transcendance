require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3000;

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('Failed to connect to MariaDB. Please check your database configuration.');
      console.error('Run migrations with: npm run migrate');
      process.exit(1);
    }

    // Start listening
    const server = app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║     Chat Microservice Server Running                 ║
║                                                       ║
║     Environment: ${process.env.NODE_ENV?.padEnd(31) || 'development'.padEnd(31)} ║
║     Port: ${String(PORT).padEnd(42)} ║
║     Database: MariaDB/MySQL${' '.repeat(24)} ║
║     API Base: http://localhost:${PORT}/api${' '.repeat(18)} ║
║                                                       ║
║     Health Check: http://localhost:${PORT}/api/health${' '.repeat(9)} ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
