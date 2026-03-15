import express from 'express';
import * as conversationController from '../controllers/conversationController.js';
import validateRequest from '../middleware/ValidateRequest.js';
import {
	createConversationBodySchema,
	routeIdParamsSchema
} from '../validators/chatValidator.js';

const router = express.Router();


router.get('/', conversationController.getConversations);

router.get('/rh-profile', conversationController.getRHProfile);

router.get('/:id', validateRequest(routeIdParamsSchema, 'params'), conversationController.getConversationById);

router.post('/', validateRequest(createConversationBodySchema), conversationController.createConversation);

router.patch('/:id/read', validateRequest(routeIdParamsSchema, 'params'), conversationController.markConversationAsRead);

export default router;
