import express from 'express'
import * as internalController from '../controllers/internalController.js';
import {submissionSchema} from '../validators/submissionValidator.js'
import validateRequest from '../middleware/ValidateRequest.js';

const router = express.Router();

router.get('/:testId',internalController.getTestForEvalution)
    .post('/:testId/evaluate',
        validateRequest(submissionSchema),
        internalController.evaluateTest)

export default router;