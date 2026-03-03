const messageService = require('../services/messageService');

class MessageController {
  /**
   * @route   POST /api/chats/:chatId/messages
   * @desc    Send a message in a chat
   * @access  Private
   */
  async sendMessage(req, res, next) {
    try {
      const { chatId } = req.params;
      const { id: senderId, role: senderRole } = req.user;
      const { content } = req.body;

      const message = await messageService.sendMessage(
        chatId,
        senderId,
        senderRole,
        content
      );

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: { message },
      });
    } catch (error) {
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: error.message,
        });
      }
      next(error);
    }
  }

  /**
   * @route   GET /api/chats/:chatId/messages
   * @desc    Get messages for a chat
   * @access  Private
   */
  async getMessages(req, res, next) {
    try {
      const { chatId } = req.params;
      const { id: userId, role } = req.user;
      const { page, limit, before } = req.query;

      const result = await messageService.getMessages(chatId, userId, role, {
        page,
        limit,
        before,
      });

      res.status(200).json({
        success: true,
        message: 'Messages retrieved successfully',
        data: result,
      });
    } catch (error) {
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: error.message,
        });
      }
      next(error);
    }
  }

  /**
   * @route   PATCH /api/chats/:chatId/messages/read
   * @desc    Mark messages as read
   * @access  Private
   */
  async markAsRead(req, res, next) {
    try {
      const { chatId } = req.params;
      const { id: userId, role } = req.user;

      await messageService.markAsRead(chatId, userId, role);

      res.status(200).json({
        success: true,
        message: 'Messages marked as read',
      });
    } catch (error) {
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: error.message,
        });
      }
      next(error);
    }
  }

  /**
   * @route   GET /api/chats/:chatId/messages/unread
   * @desc    Get unread message count
   * @access  Private
   */
  async getUnreadCount(req, res, next) {
    try {
      const { chatId } = req.params;
      const { id: userId } = req.user;

      const count = await messageService.getUnreadCount(chatId, userId);

      res.status(200).json({
        success: true,
        data: { unreadCount: count },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();
