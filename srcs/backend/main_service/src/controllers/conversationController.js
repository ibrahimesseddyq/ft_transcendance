import { prisma } from '../config/prisma.js';
import { HttpException } from '../utils/httpExceptions.js';
import pkg from '../../generated/prisma/index.js';
import { createConversationInputSchema } from '../validators/chatValidator.js';
const { UserRole } = pkg;

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    if (userRole === UserRole.candidate) {
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

export const createConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let participantId = req.body.participantId;

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

    const participant = await prisma.user.findUnique({
      where: { id: participantId }
    });

    if (!participant) {
      throw new HttpException(404, 'Participant not found');
    }

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

export const markConversationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId: id,
        userId
      }
    });

    if (!participant) {
      throw new HttpException(404, 'Conversation not found');
    }

    await prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: { lastReadAt: new Date() }
    });

    res.status(200).json({ message: 'Conversation marked as read' });
  } catch (error) {
    next(error);
  }
};

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
