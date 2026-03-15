import express from 'express';
import * as messageController from '../controllers/messageController.js';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import validateRequest from '../middleware/ValidateRequest.js';
import {
  editMessageBodySchema,
  uploadFileBodySchema
} from '../validators/chatValidator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  limits: { fileSize: 100 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

const router = express.Router();

router.post('/upload', upload.single('file'),
  validateRequest(uploadFileBodySchema),
    messageController.uploadFile);

router.get(
  '/conversation/:conversationId',
  messageController.getMessages
);

router.post(
  '/conversation/:conversationId',
  messageController.sendMessage
);

router.patch('/:id',
  validateRequest(editMessageBodySchema),
   messageController.editMessage);

router.delete('/:id',
   messageController.deleteMessage);

router.get('/conversation/:conversationId/unread'
  , messageController.getUnreadCount);

export default router;
