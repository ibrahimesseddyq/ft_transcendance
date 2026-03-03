require('dotenv').config();
const { pool } = require('./database');

const createTables = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('Creating database tables...\n');

    // Create chats table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hr_user_id VARCHAR(100) NOT NULL,
        client_user_id VARCHAR(100) NOT NULL,
        status ENUM('active', 'archived', 'blocked') DEFAULT 'active',
        last_message_at DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_hr_client (hr_user_id, client_user_id),
        INDEX idx_hr_user (hr_user_id),
        INDEX idx_client_user (client_user_id),
        INDEX idx_status_updated (status, updated_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ Created table: chats');

    // Create messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chat_id INT NOT NULL,
        sender_id VARCHAR(100) NOT NULL,
        sender_role ENUM('hr', 'client') NOT NULL,
        content TEXT NOT NULL,
        message_type ENUM('text', 'system') DEFAULT 'text',
        status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
        INDEX idx_chat_created (chat_id, created_at),
        INDEX idx_chat_status (chat_id, status),
        INDEX idx_sender (sender_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ Created table: messages');

    console.log('\n✅ All tables created successfully!');
    console.log('\nYou can now start the server with: npm start or npm run dev\n');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  createTables()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { createTables };
