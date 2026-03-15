import * as messagesService from '../services/messagesService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getMessages = asyncHandler(async (req, res, next) => {
    const messages = await messagesService.getMessages({
      conversationId: req.params.conversationId,
      userId: req.user.id,
      limit: req.query.limit,
      before: req.query.before
    });
    res.status(200).json(messages);
});

export const sendMessage = asyncHandler(async (req, res, next) => {
    const result = await messagesService.sendMessage({
      conversationId: req.params.conversationId,
      userId: req.user.id,
      content: req.body.content,
      messageType: req.body.messageType || 'text',
      io: req.app.get('io')
    });
    if (result.blocked) {
      return res.status(400).json({
        error: 'Message blocked by moderation',
        moderation: result.moderation
      });
    }
    const response = { ...result.message };
    if (result.moderation) {
      response.moderation = result.moderation;
    }
    res.status(201).json(response);
});

export const editMessage = asyncHandler(async (req, res, next) => {
    const updatedMessage = await messagesService.editMessage({
      id: req.params.id,
      userId: req.user.id,
      content: req.body.content
    });
    res.status(200).json(updatedMessage);
});

export const deleteMessage = asyncHandler(async (req, res, next) => {
    await messagesService.deleteMessage({
      id: req.params.id,
      userId: req.user.id
    });
    res.status(200).json({ message: 'Message deleted successfully' });
});

export const getUnreadCount = asyncHandler(async (req, res, next) => {
    const count = await messagesService.getUnreadCount({
      conversationId: req.params.conversationId,
      userId: req.user.id
    });
    res.status(200).json({ count });
});

export const uploadFile = asyncHandler(async (req, res, next) => {
    const message = await messagesService.uploadFile({
      userId: req.user.id,
      conversationId: req.body.conversationId,
      file: req.file,
      io: req.app.get('io')
    });
    res.status(201).json(message);
});
