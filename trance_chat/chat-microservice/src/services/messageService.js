const Message = require('../models/Message');
const chatService = require('./chatService');

class MessageService {
  /**
   * Send a message in a chat
   */
  async sendMessage(chatId, senderId, senderRole, content) {
    try {
      // Verify sender has access to this chat
      const { hasAccess } = await chatService.verifyAccess(chatId, senderId, senderRole);

      if (!hasAccess) {
        throw new Error('Unauthorized: You do not have access to this chat');
      }

      // Create message
      const message = await Message.create(chatId, senderId, senderRole, content);

      // Update chat's last message timestamp
      await chatService.updateLastMessage(chatId);

      return message;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get messages for a chat
   */
  async getMessages(chatId, userId, role, options = {}) {
    try {
      // Verify user has access to this chat
      const { hasAccess } = await chatService.verifyAccess(chatId, userId, role);

      if (!hasAccess) {
        throw new Error('Unauthorized: You do not have access to this chat');
      }

      return await Message.findByChatId(chatId, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a single message by ID
   */
  async getMessageById(messageId) {
    try {
      return await Message.findById(messageId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(chatId, userId, role) {
    try {
      // Verify access
      const { hasAccess } = await chatService.verifyAccess(chatId, userId, role);

      if (!hasAccess) {
        throw new Error('Unauthorized: You do not have access to this chat');
      }

      await Message.markAsRead(chatId, userId);

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get unread message count for a chat
   */
  async getUnreadCount(chatId, userId) {
    try {
      return await Message.getUnreadCount(chatId, userId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a message (soft delete)
   */
  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Message not found');
      }

      // Only allow sender to delete
      if (message.senderId !== userId) {
        throw new Error('Unauthorized: You can only delete your own messages');
      }

      return await Message.softDelete(messageId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MessageService();
