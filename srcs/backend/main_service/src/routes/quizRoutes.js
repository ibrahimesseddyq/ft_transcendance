import * as quizController from '../controllers/quizController.js'
import express from 'express'

const router = express.Router()

router.get('',quizController.startTest)
    .post('',quizController.submitTest);

export default router;