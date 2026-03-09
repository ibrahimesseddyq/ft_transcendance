import express from 'express';
import * as conversationController from '../controllers/conversationController.js';

const router = express.Router();

// Get all conversations for the authenticated user
// Candidates: Get their conversation with RH
// RH/Admin: Get all their conversations
router.get('/', conversationController.getConversations);

// Get RH profile (for candidates)
router.get('/rh-profile', conversationController.getRHProfile);

// Get specific conversation
router.get('/:id', conversationController.getConversationById);

// Create new conversation (RH/Admin only)
router.post('/', conversationController.createConversation);

// Mark conversation as read
router.patch('/:id/read', conversationController.markConversationAsRead);

export default router;
