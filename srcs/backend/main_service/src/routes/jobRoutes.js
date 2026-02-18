import * as jobController from '../controllers/jobController.js';
import express from 'express';
import  {UserRole} from '../../generated/prisma/index.js'
import {createJobSchema, updateJobSchema} from '../validators/jobValidator.js';
import validateRequest from '../middleware/ValidateRequest.js';

const router = express.Router();

router.post('/',
    validateRequest(createJobSchema),
    verifyRoles([UserRole.recruiter,UserRole.admin]),
    jobController.createJob);
router.get('/',jobController.getJobs);
router.get('/:id',jobController.getJobById);
router.patch('/:id',
    validateRequest(updateJobSchema),
    verifyRoles([UserRole.recruiter,UserRole.admin]),
    jobController.updateJob);
router.delete('/:id',
    verifyRoles([UserRole.recruiter,UserRole.admin]),
    jobController.deleteJob);
router.get('/:id/applications',jobController.getApplicationsByJobId);

export default router;