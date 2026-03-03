const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');
const { chatValidators, validate } = require('../validators');

// Apply authentication to all routes
router.use(authMiddleware);

/**
 * @route   POST /api/chats
 * @desc    Create a new chat between HR and Client
 * @access  Private (HR only)
 */
router.post(
  '/',
  chatValidators.createChat,
  validate,
  chatController.createChat
);

/**
 * @route   GET /api/chats
 * @desc    Get all chats for current user
 * @access  Private
 */
router.get(
  '/',
  chatValidators.listChats,
  validate,
  chatController.getUserChats
);

/**
 * @route   GET /api/chats/:chatId
 * @desc    Get chat by ID
 * @access  Private
 */
router.get(
  '/:chatId',
  chatValidators.getChatById,
  validate,
  chatController.getChatById
);

/**
 * @route   PATCH /api/chats/:chatId/archive
 * @desc    Archive a chat
 * @access  Private
 */
router.patch(
  '/:chatId/archive',
  chatValidators.getChatById,
  validate,
  chatController.archiveChat
);

module.exports = router;
