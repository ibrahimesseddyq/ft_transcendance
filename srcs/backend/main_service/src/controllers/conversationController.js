import { prisma } from '../config/prisma.js';
import { HttpException } from '../utils/httpExceptions.js';
import pkg from '../../generated/prisma/index.js';
import { createConversationInputSchema } from '../validators/chatValidator.js';
const { UserRole } = pkg;

/**
 * Get all conversations for the authenticated user
 * - Candidates: Get their conversation with the RH (auto-created if doesn't exist)
 * - RH: Get all conversations with candidates
 */
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // For candidates, return their conversation with RH
    if (userRole === UserRole.candidate) {
      // Find the first RH user
      const rh = await prisma.user.findFirst({
        where: { role: UserRole.recruiter },
        select: { 
          id: true, 
          firstName: true, 
          lastName: true, 
          avatarUrl: true,
          email: true,
          role: true
        }
      });

      if (!rh) {
        return res.status(200).json([]);
      }

      // Check if conversation exists between candidate and RH
      let conversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { userId: userId } } },
            { participants: { some: { userId: rh.id } } }
          ]
        },
        include: {
          participants: {
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
          },
          messages: {
            where: { isDeleted: false },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      // If no conversation exists, create one
      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            participants: {
              create: [
                { userId: userId },
                { userId: rh.id }
              ]
            }
          },
          include: {
            participants: {
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
            },
            messages: {
              where: { isDeleted: false },
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        });
      }

      return res.status(200).json([conversation]);
    }

    // For RH: Get all their conversations
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: {
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
        },
        messages: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific conversation by ID
 * Verify user has access to this conversation
 */
export const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: {
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
        }
      }
    });

    if (!conversation) {
      throw new HttpException(404, 'Conversation not found');
    }

    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new conversation
 * - RH can create conversations with candidates
 * - Candidates are automatically assigned to RH conversation (handled in getConversations)
 */
export const createConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let participantId = req.body.participantId;

    // If candidate is creating conversation, auto-assign to the RH
    if (userRole === UserRole.candidate && !participantId) {
      const rh = await prisma.user.findFirst({
        where: { role: UserRole.recruiter },
        select: { id: true }
      });
      
      if (!rh) {
        throw new HttpException(404, 'No recruiter available');
      }
      
      participantId = rh.id;
    }

    participantId = createConversationInputSchema.parse({ participantId }).participantId;

    // Verify participant exists
    const participant = await prisma.user.findUnique({
      where: { id: participantId }
    });

    if (!participant) {
      throw new HttpException(404, 'Participant not found');
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: userId } } },
          { participants: { some: { userId: participantId } } }
        ]
      },
      include: {
        participants: {
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
        }
      }
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: participantId }
          ]
        }
      },
      include: {
        participants: {
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
        }
      }
    });

    res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
};

/**
 * Mark conversation as read
 * Updates lastReadAt for the user's participant record
 */
export const markConversationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the participant record
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId: id,
        userId
      }
    });

    if (!participant) {
      throw new HttpException(404, 'Conversation not found');
    }

    // Update lastReadAt
    await prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: { lastReadAt: new Date() }
    });

    res.status(200).json({ message: 'Conversation marked as read' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get RH profile information
 * Used by candidates to see RH details
 */
export const getRHProfile = async (req, res, next) => {
  try {
    const rh = await prisma.user.findFirst({
      where: { role: UserRole.recruiter },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatarUrl: true,
        role: true
      }
    });

    if (!rh) {
      throw new HttpException(404, 'RH not found');
    }

    res.status(200).json(rh);
  } catch (error) {
    next(error);
  }
};
