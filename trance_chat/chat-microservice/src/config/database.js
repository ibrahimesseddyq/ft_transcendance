const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chat_microservice',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ MariaDB Connected Successfully');
    console.log(`  Database: ${process.env.DB_NAME}`);
    console.log(`  Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ MariaDB Connection Error:', error.message);
    return false;
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    console.log('MariaDB connection pool closed');
  } catch (error) {
    console.error('Error closing pool:', error);
  }
};

process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

module.exports = {
  pool,
  testConnection,
  closePool,
};
