import * as quizController from '../controllers/quizController.js'
import express from 'express'

const router = express.Router()

router.get('/tests/:testId/start',
    quizController.startTest)
    .post('/tests/:testId/submit',
    quizController.submitTest);

export default router;