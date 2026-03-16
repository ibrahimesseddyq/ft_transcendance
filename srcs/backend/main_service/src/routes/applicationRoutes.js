import * as applicationController from '../controllers/applicationController.js';
import express from 'express';
import { verifyRoles } from '../middleware/auth.js';
import { UserRole } from '../../generated/prisma/index.js';
const router = express.Router();


router.get('/:id', 
        applicationController.getApplicaticationById)
    .get('/:id/phase',
        applicationController.getCurrentPhase)
    .get('/:id/phases', 
        applicationController.getApplicationPhases)
    .post('/', 
        applicationController.submitApplication)
    .patch('/:id/withdraw',
        verifyRoles([UserRole.candidate]),
        applicationController.withdrawApplication)
    .patch('/:id/reject',
        verifyRoles([UserRole.recruiter]),
        applicationController.rejectApplication)
    .patch('/:id/advance',
        verifyRoles([UserRole.recruiter]),
        applicationController.advance)

export default router