import express from 'express';
import * as messageController from '../controllers/messageController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

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
router.post('/upload', upload.single('file'), messageController.uploadFile);

// Get messages for a conversation (paginated)
router.get('/conversation/:conversationId', messageController.getMessages);

// Send a message
router.post('/conversation/:conversationId', messageController.sendMessage);

// Edit a message
router.patch('/:id', messageController.editMessage);

// Delete a message (soft delete)
router.delete('/:id', messageController.deleteMessage);

// Get unread count for a conversation
router.get('/conversation/:conversationId/unread', messageController.getUnreadCount);

export default router;
