const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation Rules
 */

const chatValidators = {
  // Create chat validation
  createChat: [
    body('clientUserId')
      .notEmpty()
      .withMessage('Client user ID is required')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Client user ID must be between 1 and 100 characters'),
  ],

  // Get chat by ID validation
  getChatById: [
    param('chatId')
      .notEmpty()
      .withMessage('Chat ID is required')
      .isInt({ min: 1 })
      .withMessage('Chat ID must be a valid integer'),
  ],

  // List chats validation
  listChats: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['active', 'archived', 'blocked'])
      .withMessage('Invalid status value'),
  ],
};

const messageValidators = {
  // Send message validation
  sendMessage: [
    param('chatId')
      .notEmpty()
      .withMessage('Chat ID is required')
      .isInt({ min: 1 })
      .withMessage('Chat ID must be a valid integer'),
    body('content')
      .notEmpty()
      .withMessage('Message content is required')
      .trim()
      .isLength({ min: 1, max: 5000 })
      .withMessage('Message content must be between 1 and 5000 characters'),
  ],

  // Get messages validation
  getMessages: [
    param('chatId')
      .notEmpty()
      .withMessage('Chat ID is required')
      .isInt({ min: 1 })
      .withMessage('Chat ID must be a valid integer'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('before')
      .optional()
      .isISO8601()
      .withMessage('Before must be a valid ISO 8601 date'),
  ],
};

/**
 * Validation Error Handler
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  chatValidators,
  messageValidators,
  validate,
};
