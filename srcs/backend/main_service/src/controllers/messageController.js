import { prisma } from '../config/prisma.js';
import { HttpException } from '../utils/httpExceptions.js';
import pkg from '../../generated/prisma/index.js';
import { createChatNotification } from '../services/notificationService.js';
import {moderateText} from '../services/aiService.js';
const { MessageType } = pkg;


/**
 * Get messages for a conversation (paginated)
 * Verify user has access to this conversation
 */
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const { limit = 50, before } = req.query;

    // Verify user is part of the conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId
      }
    });

    if (!participant) {
      throw new HttpException(403, 'Access denied to this conversation');
    }

    // Build where clause for pagination
    const whereClause = {
      conversationId,
      isDeleted: false
    };

    if (before) {
      const beforeMessage = await prisma.message.findUnique({
        where: { id: before },
        select: { createdAt: true }
      });

      if (beforeMessage) {
        whereClause.createdAt = { lt: beforeMessage.createdAt };
      }
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true
          }
        },
        attachments: true
      }
    });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

/**
 * Send a message to a conversation
 * - Verify user has access
 * - Update conversation updatedAt
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const { content, messageType = MessageType.text } = req.body;
    if (!content || content.trim() === '') {
      throw new HttpException(400, 'Message content is required');
    }
        // Verify user is part of the conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId
      }
    });

    if (!participant) {
      throw new HttpException(403, 'Access denied to this conversation');
    }
    
    const moderation = await moderateText(content, { conversationId, userId});
     if (moderation.action === 'block') {
      return res.status(400).json({
        error: 'Message blocked by moderation',
        moderation
      });
    }




    // Create message and update conversation
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: content.trim(),
        messageType
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true
          }
        },
        attachments: true
      }
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    // Emit socket event to notify other participants
    const io = req.app.get('io');
    if (io) {
      console.log('[MessageController] Emitting socket event for conversation:', conversationId);
      
      // Get all participants in this conversation
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          participants: {
            select: { userId: true }
          }
        }
      });

      console.log('[MessageController] Conversation participants:', conversation?.participants);

      // Emit to conversation room
      io.in(conversationId).emit('message:new', {
        message,
        conversationId
      });
      console.log('[MessageController] Emitted to conversation room:', conversationId);

      // Also emit to each participant's personal room (for users not in conversation room yet)
      if (conversation) {
        conversation.participants.forEach(participant => {
          if (participant.userId !== userId) {
            const personalRoom = `user_${participant.userId}`;
            console.log('[MessageController] Emitting to personal room:', personalRoom);
            io.in(personalRoom).emit('message:new', {
              message,
              conversationId
            });
            console.log('[MessageController] Emitted successfully to:', personalRoom);
          }
        });
      }

      // Send chat notification to non-sender participants (deduplicated per conversation)
      if (conversation) {
        const senderName = `${message.sender.firstName} ${message.sender.lastName}`;
        for (const p of conversation.participants) {
          if (p.userId !== userId) {
            await createChatNotification(io, { recipientId: p.userId, senderName, conversationId });
          }
        }
      }
    } else {
      console.warn('[MessageController] Socket.IO not available');
    }

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

/**
 * Edit a message (soft update)
 * Only the sender can edit their message
 */
export const editMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      throw new HttpException(400, 'Message content is required');
    }

    // Verify message belongs to user
    const message = await prisma.message.findUnique({
      where: { id }
    });

    if (!message) {
      throw new HttpException(404, 'Message not found');
    }

    if (message.senderId !== userId) {
      throw new HttpException(403, 'You can only edit your own messages');
    }

    if (message.isDeleted) {
      throw new HttpException(400, 'Cannot edit deleted message');
    }

    // Update message
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        content: content.trim(),
        updatedAt: new Date()
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true
          }
        }
      }
    });

    res.status(200).json(updatedMessage);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a message (soft delete)
 * Only the sender can delete their message
 */
export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify message belongs to user
    const message = await prisma.message.findUnique({
      where: { id }
    });

    if (!message) {
      throw new HttpException(404, 'Message not found');
    }

    if (message.senderId !== userId) {
      throw new HttpException(403, 'You can only delete your own messages');
    }

    // Soft delete
    await prisma.message.update({
      where: { id },
      data: {
        isDeleted: true,
        updatedAt: new Date()
      }
    });

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread message count for a conversation
 */
export const getUnreadCount = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Get participant record to find lastReadAt
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId
      }
    });

    if (!participant) {
      throw new HttpException(403, 'Access denied to this conversation');
    }

    // Count messages created after lastReadAt from other users
    const count = await prisma.message.count({
      where: {
        conversationId,
        senderId: { not: userId },
        isDeleted: false,
        createdAt: participant.lastReadAt
          ? { gt: participant.lastReadAt }
          : undefined
      }
    });

    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload file and create message
 */
export const uploadFile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.body;
    const file = req.file;

    if (!file) {
      throw new HttpException(400, 'No file uploaded');
    }

    if (!conversationId) {
      throw new HttpException(400, 'Conversation ID is required');
    }

    // Verify user is part of the conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId
      }
    });

    if (!participant) {
      throw new HttpException(403, 'Access denied to this conversation');
    }

    // Determine message type based on file type
    let messageType = MessageType.file;
    if (file.mimetype.startsWith('image/')) {
      messageType = MessageType.image;
    } else if (file.mimetype.startsWith('video/')) {
      messageType = MessageType.video;
    }

    // Store file path relative to uploads directory
    const filePath = `/uploads/chat/${file.filename}`;

    // Create message with file attachment
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: '', // Empty content for file messages
        messageType,
        attachments: {
          create: {
            fileName: file.originalname,
            filePath: filePath,
            fileSize: file.size,
            mimeType: file.mimetype
          }
        }
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true
          }
        },
        attachments: true
      }
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    // Emit socket event to notify other participants
    const io = req.app.get('io');
    if (io) {
      console.log('[MessageController] Emitting socket event for file upload:', conversationId);
      
      // Get all participants in this conversation
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          participants: {
            select: { userId: true }
          }
        }
      });

      // Emit to conversation room
      io.in(conversationId).emit('message:new', {
        message,
        conversationId
      });

      // Also emit to each participant's personal room
      if (conversation) {
        conversation.participants.forEach(participant => {
          if (participant.userId !== userId) {
            const personalRoom = `user_${participant.userId}`;
            io.in(personalRoom).emit('message:new', {
              message,
              conversationId
            });
          }
        });
      }

      // Send chat notification to non-sender participants (deduplicated per conversation)
      if (conversation) {
        const senderName = `${message.sender.firstName} ${message.sender.lastName}`;
        for (const p of conversation.participants) {
          if (p.userId !== userId) {
            await createChatNotification(io, { recipientId: p.userId, senderName, conversationId });
          }
        }
      }
    }

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};
