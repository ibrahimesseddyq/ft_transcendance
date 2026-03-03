import * as jobController from '../controllers/jobController.js';
import express from 'express';
import  {UserRole} from '../../generated/prisma/index.js'
import {createJobSchema, updateJobSchema} from '../validators/jobValidator.js';
import validateRequest from '../middleware/ValidateRequest.js';
import {verifyRoles } from '../middleware/auth.js'

const router = express.Router();

router.post('/',
        validateRequest(createJobSchema),
        verifyRoles([UserRole.recruiter,UserRole.admin]),
        jobController.createJob)
    .get('/',
        jobController.getJobs)
    .get('/:id',
        jobController.getJobById)
    .patch('/:id',
        validateRequest(updateJobSchema),
        verifyRoles([UserRole.recruiter,UserRole.admin]),
        jobController.updateJob)
    .delete('/:id',
        verifyRoles([UserRole.recruiter,UserRole.admin]),
        jobController.deleteJob)
    .get('/:id/applications',
        verifyRoles([UserRole.recruiter, UserRole.admin]),
        jobController.getApplicationsByJobId);

export default router;