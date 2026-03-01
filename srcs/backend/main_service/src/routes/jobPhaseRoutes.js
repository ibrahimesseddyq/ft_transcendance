import * as jobPhaseController from '../controllers/jobPhaseController.js';
import express from 'express';

const router =  express.Router();

router.get('/:id',
        // verifyToken,
    jobPhaseController.getJobPhaseById)
    .get('/:id/phase',
        // verifyToken,
        jobPhaseController.getJobPhases)
    .post('/',
        // verifyToken,
        verifyRoles([UserRole.recruiter,UserRole.admin]),
        jobPhaseController.createJobPhase)
    .delete('/:id',
        // verifyToken,
        verifyRoles([UserRole.recruiter,UserRole.admin]),
        jobPhaseController.deleteJobPhase)
    .patch('/:id',
        // verifyToken,
        verifyRoles([UserRole.recruiter,UserRole.admin]),
        jobPhaseController.updateJobPhase);

export default router;