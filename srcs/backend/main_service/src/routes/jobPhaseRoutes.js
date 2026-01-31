const jobPhaseController = require('../controllers/jobPhaseController');
const express = require('express');
const router =  express.Router();

router.get('/:id',jobPhaseController.getJobPhaseById)
    .post('/',jobPhaseController.createJobPhase)
    .get('/:jobId',jobPhaseController.getJobPhases)
    .delete('/:id',jobPhaseController.deleteJobPhase)
    .patch('/:id',jobPhaseController.updateJobPhase);
module.exports = router;