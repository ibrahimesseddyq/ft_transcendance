import express from 'express'
import * as testController from '../controllers/testController.js'
import validateRequest from '../middleware/ValidateRequest.js';
import {createTestschema,updateTestschema} from '../validators/testValidator.js'
const router =  express.Router();

router.get('/:id',testController.getTestById)
    .get('/',testController.getTests)
    .post('/',validateRequest(createTestschema),
        testController.createTest)
    .patch('/:id',validateRequest(updateTestschema),
        testController.updateTest)
    .delete('/:id',testController.deleteTest)

export default router;