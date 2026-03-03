const { pool } = require('../config/database');

class Chat {
  /**
   * Create a new chat
   */
  static async create(hrUserId, clientUserId) {
    const [result] = await pool.query(
      `INSERT INTO chats (hr_user_id, client_user_id, status) 
       VALUES (?, ?, 'active')`,
      [hrUserId, clientUserId]
    );
    
    return await this.findById(result.insertId);
  }

  /**
   * Find chat by ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, hr_user_id, client_user_id, status, 
              last_message_at, created_at, updated_at
       FROM chats 
       WHERE id = ?`,
      [id]
    );
    
    return rows.length > 0 ? this.formatChat(rows[0]) : null;
  }

  /**
   * Find chat by HR and Client user IDs
   */
  static async findByParticipants(hrUserId, clientUserId) {
    const [rows] = await pool.query(
      `SELECT id, hr_user_id, client_user_id, status, 
              last_message_at, created_at, updated_at
       FROM chats 
       WHERE hr_user_id = ? AND client_user_id = ?`,
      [hrUserId, clientUserId]
    );
    
    return rows.length > 0 ? this.formatChat(rows[0]) : null;
  }

  /**
   * Find all chats for a user
   */
  static async findByUser(userId, role, options = {}) {
    const {
      page = 1,
      limit = 20,
      status = 'active',
    } = options;

    const offset = (page - 1) * limit;
    const userColumn = role === 'hr' ? 'hr_user_id' : 'client_user_id';

    // Get chats
    const [chats] = await pool.query(
      `SELECT id, hr_user_id, client_user_id, status, 
              last_message_at, created_at, updated_at
       FROM chats 
       WHERE ${userColumn} = ? AND status = ?
       ORDER BY updated_at DESC
       LIMIT ? OFFSET ?`,
      [userId, status, parseInt(limit), offset]
    );

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM chats 
       WHERE ${userColumn} = ? AND status = ?`,
      [userId, status]
    );

    const total = countResult[0].total;

    return {
      chats: chats.map(chat => this.formatChat(chat)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update last message timestamp
   */
  static async updateLastMessage(chatId) {
    await pool.query(
      `UPDATE chats 
       SET last_message_at = NOW() 
       WHERE id = ?`,
      [chatId]
    );
  }

  /**
   * Archive a chat
   */
  static async archive(chatId) {
    await pool.query(
      `UPDATE chats 
       SET status = 'archived' 
       WHERE id = ?`,
      [chatId]
    );
    
    return await this.findById(chatId);
  }

  /**
   * Check if user is participant in chat
   */
  static async isParticipant(chatId, userId, role) {
    const chat = await this.findById(chatId);
    
    if (!chat) {
      return false;
    }

    if (role === 'hr') {
      return chat.hrUserId === userId;
    } else {
      return chat.clientUserId === userId;
    }
  }

  /**
   * Format chat object (convert snake_case to camelCase)
   */
  static formatChat(chat) {
    return {
      id: chat.id,
      hrUserId: chat.hr_user_id,
      clientUserId: chat.client_user_id,
      status: chat.status,
      lastMessageAt: chat.last_message_at,
      createdAt: chat.created_at,
      updatedAt: chat.updated_at,
    };
  }
}

module.exports = Chat;
