import express from 'express'
import * as mcqController from '../controllers/mcqController.js'
import validateRequest from '../middleware/ValidateRequest.js'
import {createMcqSchema,updateMcqSchema} from '../validators/mcqValidator.js'
const router =  express.Router();

router.get('/:id', mcqController.getMcqById)
    .get('/', mcqController.getManyMcqs)
    .post('/',
        validateRequest(createMcqSchema),
         mcqController.createMcq)
    .patch('/:id',
        validateRequest(updateMcqSchema),
        mcqController.updateMcq)
    .delete('/:id',mcqController.deleteMcq);

export default router;