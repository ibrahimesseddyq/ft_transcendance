import * as jobController from '../controllers/jobController.js';
import express from 'express';
import {createJobSchema, updateJobSchema} from '../validators/jobValidator.js';
import validateRequest from '../middleware/ValidateRequest.js';

const router = express.Router();

router.post('/',validateRequest(createJobSchema),jobController.createJob);
router.get('/',jobController.getJobs);
router.get('/:id',jobController.getJobById);
router.patch('/:id',validateRequest(updateJobSchema),jobController.updateJob);
router.delete('/:id',jobController.deleteJob);
router.get('/:id/applications',jobController.getApplicationsByJobId);

export default router;