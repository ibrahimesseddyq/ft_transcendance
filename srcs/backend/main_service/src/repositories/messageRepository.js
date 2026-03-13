import { includes } from 'zod';
import { prisma } from '../config/prisma.js';

export const getMessageById = async (messageId) => {
    return await prisma.message.findUniq({
        where : {id : messageId},
        select : {
            createdAt: true
        }
    })
}

export const createMessage = async (data) => {
    return await prisma.message.create({
        data : data,
        include: {
            sender : {
                select : {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                    role: true
                }
            },
            attachments: true
        }
    })
}

export const updateMessage = async (messageId, data) => {
    return await prisma.message.update({
        where: {id : messageId},
        data : data
    })
}

export const getUnreadMwssages = async (userId, participant) => {
    return await prisma.message.count({
      where: {
        conversationId,
        senderId: { not: userId },
        isDeleted: false,
        createdAt: participant.lastReadAt
          ? { gt: participant.lastReadAt }
          : undefined
      }
    });
}