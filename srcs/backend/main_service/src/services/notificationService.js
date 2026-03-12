import { prisma } from '../config/prisma.js';

/**
 * Base notification creator.
 * Persists the notification to the DB and emits a socket event
 * to the recipient's personal room (user_<userId>).
 */
export const createNotification = async (io, { userId, type, title, message, referenceType, referenceId }) => {
  const notification = await prisma.notification.create({
    data: { userId, type, title, message, referenceType, referenceId }
  });

  if (io) {
    io.in(`user_${userId}`).emit('notification:new', notification);
  }

  return notification;
};

/**
 * Chat notification with deduplication.
 * Only creates one unread notification per conversation per recipient —
 * so if the candidate sends multiple messages, the RH only gets one
 * badge notification until they open the conversation (which marks it read).
 */
export const createChatNotification = async (io, { recipientId, senderName, conversationId }) => {
  const existing = await prisma.notification.findFirst({
    where: {
      userId: recipientId,
      type: 'newMessage',
      referenceType: 'conversation',
      referenceId: conversationId,
      isRead: false
    }
  });

  if (existing) return null;

  return createNotification(io, {
    userId: recipientId,
    type: 'newMessage',
    title: 'New message',
    message: `${senderName} sent you a message`,
    referenceType: 'conversation',
    referenceId: conversationId
  });
};
