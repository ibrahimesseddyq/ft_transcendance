const { pool } = require('../config/database');

class Message {
  /**
   * Create a new message
   */
  static async create(chatId, senderId, senderRole, content) {
    const [result] = await pool.query(
      `INSERT INTO messages (chat_id, sender_id, sender_role, content, message_type, status) 
       VALUES (?, ?, ?, ?, 'text', 'sent')`,
      [chatId, senderId, senderRole, content]
    );
    
    return await this.findById(result.insertId);
  }

  /**
   * Find message by ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, chat_id, sender_id, sender_role, content, 
              message_type, status, is_deleted, created_at, updated_at
       FROM messages 
       WHERE id = ?`,
      [id]
    );
    
    return rows.length > 0 ? this.formatMessage(rows[0]) : null;
  }

  /**
   * Find messages by chat ID
   */
  static async findByChatId(chatId, options = {}) {
    const {
      page = 1,
      limit = 50,
      before = null,
    } = options;

    const offset = (page - 1) * limit;
    let query = `
      SELECT id, chat_id, sender_id, sender_role, content, 
             message_type, status, is_deleted, created_at, updated_at
      FROM messages 
      WHERE chat_id = ? AND is_deleted = FALSE
    `;
    const params = [chatId];

    if (before) {
      query += ` AND created_at < ?`;
      params.push(before);
    }

    query += ` ORDER BY created_at ASC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    // Get messages
    const [messages] = await pool.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM messages WHERE chat_id = ? AND is_deleted = FALSE`;
    const countParams = [chatId];
    
    if (before) {
      countQuery += ` AND created_at < ?`;
      countParams.push(before);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    return {
      messages: messages.map(msg => this.formatMessage(msg)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark messages as read
   */
  static async markAsRead(chatId, userId) {
    await pool.query(
      `UPDATE messages 
       SET status = 'read' 
       WHERE chat_id = ? AND sender_id != ? AND status != 'read'`,
      [chatId, userId]
    );
  }

  /**
   * Get unread message count
   */
  static async getUnreadCount(chatId, userId) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM messages 
       WHERE chat_id = ? AND sender_id != ? AND status != 'read' AND is_deleted = FALSE`,
      [chatId, userId]
    );
    
    return rows[0].count;
  }

  /**
   * Soft delete a message
   */
  static async softDelete(messageId) {
    await pool.query(
      `UPDATE messages 
       SET is_deleted = TRUE 
       WHERE id = ?`,
      [messageId]
    );
    
    return await this.findById(messageId);
  }

  /**
   * Format message object (convert snake_case to camelCase)
   */
  static formatMessage(message) {
    return {
      id: message.id,
      chatId: message.chat_id,
      senderId: message.sender_id,
      senderRole: message.sender_role,
      content: message.content,
      messageType: message.message_type,
      status: message.status,
      isDeleted: Boolean(message.is_deleted),
      createdAt: message.created_at,
      updatedAt: message.updated_at,
    };
  }
}

module.exports = Message;
