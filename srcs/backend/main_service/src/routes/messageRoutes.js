import express from 'express';
import * as messageController from '../controllers/messageController.js';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import validateRequest from '../middleware/ValidateRequest.js';
import {
  conversationIdParamsSchema,
  editMessageBodySchema,
  getMessagesQuerySchema,
  routeIdParamsSchema,
  sendMessageBodySchema,
  uploadFileBodySchema
} from '../validators/chatValidator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/chat'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: (req, file, cb) => {
    // Allow all file types
    cb(null, true);
  }
});

const router = express.Router();

// Upload file message
router.post('/upload', upload.single('file'), validateRequest(uploadFileBodySchema), messageController.uploadFile);

// Get messages for a conversation (paginated)
router.get(
  '/conversation/:conversationId',
  validateRequest(conversationIdParamsSchema, 'params'),
  validateRequest(getMessagesQuerySchema, 'query'),
  messageController.getMessages
);

// Send a message
router.post(
  '/conversation/:conversationId',
  validateRequest(conversationIdParamsSchema, 'params'),
  validateRequest(sendMessageBodySchema),
  messageController.sendMessage
);

// Edit a message
router.patch('/:id', validateRequest(routeIdParamsSchema, 'params'), validateRequest(editMessageBodySchema), messageController.editMessage);

// Delete a message (soft delete)
router.delete('/:id', validateRequest(routeIdParamsSchema, 'params'), messageController.deleteMessage);

// Get unread count for a conversation
router.get('/conversation/:conversationId/unread', validateRequest(conversationIdParamsSchema, 'params'), messageController.getUnreadCount);

export default router;
