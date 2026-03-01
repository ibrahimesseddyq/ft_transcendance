import * as jobController from '../controllers/jobController.js';
import express from 'express';
import  {UserRole} from '../../generated/prisma/index.js'
import {createJobSchema, updateJobSchema} from '../validators/jobValidator.js';
import validateRequest from '../middleware/ValidateRequest.js';
import {verifyRoles } from '../middleware/auth.js'

const router = express.Router();

router.post('/',
        // verifyToken,
        validateRequest(createJobSchema),
        verifyRoles([UserRole.recruiter,UserRole.admin]),
        jobController.createJob)
    .get('/',
        // verifyToken,
        jobController.getJobs)
    .get('/:id',
        // verifyToken,
        jobController.getJobById)
    .patch('/:id',
        // verifyToken,
        validateRequest(updateJobSchema),
        verifyRoles([UserRole.recruiter,UserRole.admin]),
        jobController.updateJob)
    .delete('/:id',
        // verifyToken,
        verifyRoles([UserRole.recruiter,UserRole.admin]),
        jobController.deleteJob)
    .get('/:id/applications',
        // verifyToken,

        verifyRoles([UserRole.recruiter, UserRole.admin]),
        jobController.getApplicationsByJobId);

export default router;