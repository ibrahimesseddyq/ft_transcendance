import * as jobPhaseController from '../controllers/jobPhaseController.js';
import express from 'express';
import { verifyRoles } from '../middleware/auth.js';
import { UserRole } from '../../generated/prisma/index.js';

const router =  express.Router();

router.get('/:id',
    jobPhaseController.getJobPhaseById)
    .get('/:id/phase',
        jobPhaseController.getJobPhases)
    .post('/',
        verifyRoles([UserRole.recruiter,UserRole.admin]),
        jobPhaseController.createJobPhase)
    .delete('/:id',
        verifyRoles([UserRole.recruiter,UserRole.admin]),
        jobPhaseController.deleteJobPhase)
    .patch('/:id',
        verifyRoles([UserRole.recruiter,UserRole.admin]),
        jobPhaseController.updateJobPhase);

export default router;