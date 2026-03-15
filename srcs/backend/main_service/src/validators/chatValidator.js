import { z } from 'zod';

const nonEmptyId = z.string().trim().min(1, { message: 'ID is required' });
const messageContentSchema = z
  .string()
  .trim()
  .min(1, { message: 'Message content is required' })
  .max(512, { message: 'Message content must be at most 512 characters' });

export const conversationIdSchema = nonEmptyId;

export const conversationIdParamsSchema = z.object({
  conversationId: conversationIdSchema
});

export const routeIdParamsSchema = z.object({
  id: nonEmptyId
});

export const sendMessageInputSchema = z.object({
  conversationId: nonEmptyId,
  userId: nonEmptyId,
  content: messageContentSchema,
  messageType: z.enum(['text', 'image', 'video', 'file']).default('text')
});

export const editMessageInputSchema = z.object({
  id: nonEmptyId,
  userId: nonEmptyId,
  content: messageContentSchema
});

export const uploadFileInputSchema = z.object({
  userId: nonEmptyId,
  conversationId: nonEmptyId,
  file: z.any().refine(Boolean, {
    message: 'File is required'
  })
});

export const createConversationInputSchema = z.object({
  participantId: nonEmptyId
});

export const createConversationBodySchema = z.object({
  participantId: nonEmptyId.optional()
});

export const sendMessageBodySchema = z.object({
  content: messageContentSchema,
  messageType: z.enum(['text', 'image', 'video', 'file']).default('text')
});

export const editMessageBodySchema = z.object({
  content: messageContentSchema
});

export const uploadFileBodySchema = z.object({
  conversationId: conversationIdSchema
});

export const getMessagesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  before: z.string().trim().min(1).optional()
});

export const joinConversationPayloadSchema = z.union([
  conversationIdSchema,
  z.object({
    conversationId: conversationIdSchema
  })
]);

export const socketNewMessageSchema = z.object({
  conversationId: conversationIdSchema,
  message: z.any()
});
