import { prisma } from '../config/prisma.js';

export const getMessageById = async (messageId) => {
    return await prisma.message.findUnique({
        where: { id: messageId },
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
}

export const getConversationParticipant = async (conversationId, userId) => {
    return await prisma.conversationParticipant.findFirst({
        where: {
            conversationId,
            userId
        }
    });
}

export const getConversationParticipants = async (conversationId) => {
    return await prisma.conversationParticipant.findMany({
        where: { conversationId },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                    role: true,
                    email: true
                }
            }
        }
    });
}

export const getMessagesByConversation = async ({ conversationId, limit = 50, before }) => {
    const parsedLimit = Number.parseInt(limit, 10);
    const take = Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 100) : 50;

    return await prisma.message.findMany({
        where: {
            conversationId,
            isDeleted: false,
            ...(before ? { createdAt: { lt: new Date(before) } } : {})
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
        },
        orderBy: { createdAt: 'desc' },
        take
    });
}

export const createMessage = async ({conversationId, senderId, content, messageType, attachment })=> {
    return await prisma.message.create({
        data: {
            conversationId,
            senderId,
            content,
            messageType,
            ...(attachment
                ? {
                    attachments: {
                        create: attachment
                    }
                }
                : {})
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
}

export const updateMessage = async (messageId, data) => {
    return await prisma.message.update({
        where: { id: messageId },
        data,
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
}

export const touchConversation = async (conversationId) => {
    return await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
    });
}

export const getUnreadMessages = async ({ userId, conversationId, lastReadAt }) => {
    return await prisma.message.count({
      where: {
        conversationId,
        senderId: { not: userId },
        isDeleted: false,
        createdAt: lastReadAt
          ? { gt: lastReadAt }
          : undefined
      }
    });
}