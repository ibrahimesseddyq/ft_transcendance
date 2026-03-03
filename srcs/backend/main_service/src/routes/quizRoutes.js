import * as quizController from '../controllers/quizController.js'
import express from 'express'

const router = express.Router()

router.get('/api/quiz/tests/:testId/start',
    quizController.startTest)
    .post('/api/quiz/tests/:testId/submit',
    quizController.submitTest);

export default router;