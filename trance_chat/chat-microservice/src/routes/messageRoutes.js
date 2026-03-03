const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');
const { messageValidators, validate } = require('../validators');

// Apply authentication to all routes
router.use(authMiddleware);

/**
 * @route   POST /api/chats/:chatId/messages
 * @desc    Send a message in a chat
 * @access  Private
 */
router.post(
  '/:chatId/messages',
  messageValidators.sendMessage,
  validate,
  messageController.sendMessage
);

/**
 * @route   GET /api/chats/:chatId/messages
 * @desc    Get messages for a chat
 * @access  Private
 */
router.get(
  '/:chatId/messages',
  messageValidators.getMessages,
  validate,
  messageController.getMessages
);

/**
 * @route   PATCH /api/chats/:chatId/messages/read
 * @desc    Mark all messages as read in a chat
 * @access  Private
 */
router.patch(
  '/:chatId/messages/read',
  messageController.markAsRead
);

/**
 * @route   GET /api/chats/:chatId/messages/unread
 * @desc    Get unread message count for a chat
 * @access  Private
 */
router.get(
  '/:chatId/messages/unread',
  messageController.getUnreadCount
);

module.exports = router;
