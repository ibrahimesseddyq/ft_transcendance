const jobController = require('../controllers/jobController');
const express = require('express');
const router = express.Router();

router.post('/',jobController.createJob);
router.get('/',jobController.getJobs);
router.get('/:id',jobController.getJobById);
router.patch('/:id',jobController.updateJob);
router.delete('/:id',jobController.deleteJob);

module.exports = router;