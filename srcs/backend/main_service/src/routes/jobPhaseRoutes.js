import * as jobPhaseController from '../controllers/jobPhaseController.js';
import express from 'express';

const router =  express.Router();

router.get('/:id',jobPhaseController.getJobPhaseById)
    .post('/',jobPhaseController.createJobPhase)
    .get('/:id/phase',jobPhaseController.getJobPhases)
    .delete('/:id',jobPhaseController.deleteJobPhase)
    .patch('/:id',jobPhaseController.updateJobPhase);

export default router;