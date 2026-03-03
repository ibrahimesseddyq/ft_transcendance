const Chat = require('../models/Chat');

class ChatService {
  /**
   * Create a new chat between HR and Client
   */
  async createChat(hrUserId, clientUserId) {
    try {
      // Check if chat already exists
      const existingChat = await Chat.findByParticipants(hrUserId, clientUserId);

      if (existingChat) {
        return {
          chat: existingChat,
          created: false,
        };
      }

      // Create new chat
      const chat = await Chat.create(hrUserId, clientUserId);

      return {
        chat,
        created: true,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get chat by ID
   */
  async getChatById(chatId) {
    try {
      const chat = await Chat.findById(chatId);
      return chat;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all chats for a user
   */
  async getUserChats(userId, role, options = {}) {
    try {
      return await Chat.findByUser(userId, role, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify user has access to chat
   */
  async verifyAccess(chatId, userId, role) {
    try {
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return { hasAccess: false, chat: null };
      }

      // Check if user is a participant
      const isParticipant = await Chat.isParticipant(chatId, userId, role);

      return {
        hasAccess: isParticipant,
        chat: isParticipant ? chat : null,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update chat's last message timestamp
   */
  async updateLastMessage(chatId) {
    try {
      await Chat.updateLastMessage(chatId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Archive a chat
   */
  async archiveChat(chatId, userId, role) {
    try {
      const { hasAccess } = await this.verifyAccess(chatId, userId, role);

      if (!hasAccess) {
        throw new Error('Unauthorized access to chat');
      }

      return await Chat.archive(chatId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get chat between specific HR and Client
   */
  async getChatByParticipants(hrUserId, clientUserId) {
    try {
      return await Chat.findByParticipants(hrUserId, clientUserId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ChatService();
