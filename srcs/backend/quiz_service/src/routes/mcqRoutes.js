import express from 'express'
import * as mcqController from '../controllers/mcqController.js'

const router =  express.Router();

router.get('/:id', mcqController.getMcqById)
    .get('/', mcqController.getManyMcqs)
    .post('/', mcqController.createMcq)
    .patch('/:id', mcqController.updateMcq)
    .delete('/:id',mcqController.deleteMcq);

export default router;