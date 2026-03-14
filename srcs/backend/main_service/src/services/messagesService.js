import { HttpException } from '../utils/httpExceptions.js';
import * as messageRepository from '../repositories/messageRepository.js';
import { moderateText } from './aiService.js';
import { createChatNotification } from './notificationService.js';

const validateConversationAccess = async (conversationId, userId) => {
	const participant = await messageRepository.getConversationParticipant(conversationId, userId);
	if (!participant) {
		throw new HttpException(404, 'Conversation not found');
	}
	return participant;
};

const notifyOtherParticipants = async ({ io, conversationId, senderId, senderName }) => {
	if (!io) return;

	const participants = await messageRepository.getConversationParticipants(conversationId);
	const recipients = participants.filter((p) => p.userId !== senderId);

	await Promise.all(
		recipients.map((recipient) =>
			createChatNotification(io, {
				recipientId: recipient.userId,
				senderName,
				conversationId
			})
		)
	);
};

export const getMessages = async ({ conversationId, userId, limit, before }) => {
	await validateConversationAccess(conversationId, userId);
	return await messageRepository.getMessagesByConversation({ conversationId, limit, before });
};

export const sendMessage = async ({ conversationId, userId, content, messageType = 'text', io }) => {
	await validateConversationAccess(conversationId, userId);
	const text = typeof content === 'string' ? content.trim() : '';
	if (!text) {
		throw new HttpException(400, 'Message content is required');
	}

	if (messageType === 'text') {
		try {
			
			const moderation = await moderateText(text, { conversationId, userId });
			if (moderation?.blocked === true) {
				return { blocked: true, moderation };
			}
		} catch (error) {
			// Do not block messaging if moderation service is unavailable.
		}
	}

	const message = await messageRepository.createMessage({
		conversationId,
		senderId: userId,
		content: text,
		messageType
	});

	await messageRepository.touchConversation(conversationId);

	const senderName = `${message.sender?.firstName || ''} ${message.sender?.lastName || ''}`.trim() || 'Someone';
	await notifyOtherParticipants({
		io,
		conversationId,
		senderId: userId,
		senderName
	});

	if (io) {
		io.to(conversationId).emit('message:received', message);
	}

	return { blocked: false, message };
};

export const editMessage = async ({ id, userId, content }) => {
	const existingMessage = await messageRepository.getMessageById(id);
	if (!existingMessage || existingMessage.isDeleted) {
		throw new HttpException(404, 'Message not found');
	}
	if (existingMessage.senderId !== userId) {
		throw new HttpException(403, 'Forbidden');
	}

	const text = typeof content === 'string' ? content.trim() : '';
	if (!text) {
		throw new HttpException(400, 'Message content is required');
	}

	return await messageRepository.updateMessage(id, { content: text });
};

export const deleteMessage = async ({ id, userId }) => {
	const existingMessage = await messageRepository.getMessageById(id);
	if (!existingMessage || existingMessage.isDeleted) {
		throw new HttpException(404, 'Message not found');
	}
	if (existingMessage.senderId !== userId) {
		throw new HttpException(403, 'Forbidden');
	}

	await messageRepository.updateMessage(id, {
		isDeleted: true,
		content: '[Message deleted]'
	});
};

export const getUnreadCount = async ({ conversationId, userId }) => {
	const participant = await validateConversationAccess(conversationId, userId);
	return await messageRepository.getUnreadMessages({
		userId,
		conversationId,
		lastReadAt: participant.lastReadAt
	});
};

export const uploadFile = async ({ userId, conversationId, file, io }) => {
	if (!file) {
		throw new HttpException(400, 'File is required');
	}

	await validateConversationAccess(conversationId, userId);

	const mimeType = file.mimetype || 'application/octet-stream';
	let messageType = 'file';
	if (mimeType.startsWith('image/')) {
		messageType = 'image';
	} else if (mimeType.startsWith('video/')) {
		messageType = 'video';
	}

	const message = await messageRepository.createMessage({
		conversationId,
		senderId: userId,
		content: file.originalname || 'File',
		messageType,
		attachment: {
			fileName: file.originalname,
			filePath: `/uploads/chat/${file.filename}`,
			fileSize: file.size,
			mimeType
		}
	});

	await messageRepository.touchConversation(conversationId);

	const senderName = `${message.sender?.firstName || ''} ${message.sender?.lastName || ''}`.trim() || 'Someone';
	await notifyOtherParticipants({
		io,
		conversationId,
		senderId: userId,
		senderName
	});

	if (io) {
		io.to(conversationId).emit('message:received', message);
	}

	return message;
};
