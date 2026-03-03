const chatService = require('../services/chatService');

class ChatController {
  /**
   * @route   POST /api/chats
   * @desc    Create a new chat (HR only)
   * @access  Private (HR)
   */
  async createChat(req, res, next) {
    try {
      const { id: hrUserId, role } = req.user;
      const { clientUserId } = req.body;

      // Only HR can create chats
      if (role !== 'hr') {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'Only HR users can initiate chats',
        });
      }

      // HR cannot create chat with themselves
      if (clientUserId === hrUserId) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Request',
          message: 'Cannot create chat with yourself',
        });
      }

      const result = await chatService.createChat(hrUserId, clientUserId);

      const statusCode = result.created ? 201 : 200;

      res.status(statusCode).json({
        success: true,
        message: result.created ? 'Chat created successfully' : 'Chat already exists',
        data: {
          chat: result.chat,
          created: result.created,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/chats
   * @desc    Get all chats for current user
   * @access  Private
   */
  async getUserChats(req, res, next) {
    try {
      const { id: userId, role } = req.user;
      const { page, limit, status } = req.query;

      const result = await chatService.getUserChats(userId, role, {
        page,
        limit,
        status,
      });

      res.status(200).json({
        success: true,
        message: 'Chats retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/chats/:chatId
   * @desc    Get chat by ID
   * @access  Private
   */
  async getChatById(req, res, next) {
    try {
      const { chatId } = req.params;
      const { id: userId, role } = req.user;

      const { hasAccess, chat } = await chatService.verifyAccess(chatId, userId, role);

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'You do not have access to this chat',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Chat retrieved successfully',
        data: { chat },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   PATCH /api/chats/:chatId/archive
   * @desc    Archive a chat
   * @access  Private
   */
  async archiveChat(req, res, next) {
    try {
      const { chatId } = req.params;
      const { id: userId, role } = req.user;

      const chat = await chatService.archiveChat(chatId, userId, role);

      res.status(200).json({
        success: true,
        message: 'Chat archived successfully',
        data: { chat },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatController();
