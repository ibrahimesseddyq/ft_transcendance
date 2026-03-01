import * as quizController from '../controllers/quizController.js'
import express from 'express'

const router = express.Router()

router.get('/api/quiz/tests/:testId/start',
    // verifyToken,
    quizController.startTest)
    .post('/api/quiz/tests/:testId/submit',
    // verifyToken,
    quizController.submitTest);

export default router;