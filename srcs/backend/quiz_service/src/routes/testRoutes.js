import express from 'express'
import * as testController from '../controllers/testController.js'

const router =  express.Router();

router.get('/:id',testController.getTestById)
    .get('/',testController.getTests)
    .post('/',testController.createTest)
    .patch('/:id', testController.updateTest)
    .delete('/:id',testController.deleteTest)

export default router;