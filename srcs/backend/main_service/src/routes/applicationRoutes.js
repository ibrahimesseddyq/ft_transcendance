import * as applicationController from '../controllers/applicationController.js';
import express from 'express';
const router = express.Router();


router.get('/:id', 
                // verifyToken,
                applicationController.getApplicaticationById)
    .get('/:id/phase',
            // verifyToken,
            applicationController.getCurrentPhase)
    .get('/:id/phases', 
            // verifyToken,
            applicationController.getApplicationPhases)
    .post('/', 
            // verifyToken,
            applicationController.submitApplication)
    .patch('/:id/withdraw',
            // verifyToken,
            applicationController.withdrawApplication)
    .patch('/:id/reject',
            // verifyToken,
            applicationController.rejectApplication)
    .patch('/:id/accept',
            applicationController.acceptApplication)
    .patch('/:id/advance',
            // verifyToken,
            applicationController.advance)

export default router