import * as messagesService from '../services/MessagesService.js';

export const getMessages = async (req, res, next) => {
  try {
    const messages = await messagesService.getMessages({
      conversationId: req.params.conversationId,
      userId: req.user.id,
      limit: req.query.limit,
      before: req.query.before
    });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
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

    res.status(201).json(result.message);
  } catch (error) {
    next(error);
  }
};

export const editMessage = async (req, res, next) => {
  try {
    const updatedMessage = await messagesService.editMessage({
      id: req.params.id,
      userId: req.user.id,
      content: req.body.content
    });

    res.status(200).json(updatedMessage);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    await messagesService.deleteMessage({
      id: req.params.id,
      userId: req.user.id
    });

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await messagesService.getUnreadCount({
      conversationId: req.params.conversationId,
      userId: req.user.id
    });

    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    const message = await messagesService.uploadFile({
      userId: req.user.id,
      conversationId: req.body.conversationId,
      file: req.file,
      io: req.app.get('io')
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};
