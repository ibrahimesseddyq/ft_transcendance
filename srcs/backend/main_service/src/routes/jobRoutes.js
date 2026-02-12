const jobController = require('../controllers/jobController');
const express = require('express');
const router = express.Router();
const {createJobSchema, updateJobSchema} = require('../validators/jobValidator');
const validateRequest = require('../middleware/ValidateRequest')

router.post('/',validateRequest(createJobSchema),jobController.createJob);
router.get('/',jobController.getJobs);
router.get('/:id',jobController.getJobById);
router.patch('/:id',validateRequest(updateJobSchema),jobController.updateJob);
router.delete('/:id',jobController.deleteJob);
router.get('/:id/applications',jobController.getApplicationsByJobId);

module.exports = router;