import express from 'express'
import * as internalController from '../controllers/internalController.js';
import { int } from 'zod';

const router = express.Router();

router.get('/:testId',internalController.getTestForEvalution)
    .post('/:testId/evaluate',internalController.evaluateTest)

export default router;