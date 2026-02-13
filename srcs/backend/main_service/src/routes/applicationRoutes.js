const applicationController =  require('../controllers/applicationController');
const express = require('express');
const router = express.Router();


router.get('/:id', applicationController.getApplicaticationById)
    .get('/:id/phase',applicationController.getCurrentPhase)
    .get('/:id/phases', applicationController.getApplicationPhases)
    .post('/', applicationController.submitApplication)
    .patch('/:id/withdraw',applicationController.withdrawApplication)
    .patch('/:id/reject', applicationController.rejectApplication)
    .patch('/:id/advance', applicationController.advance)

module.exports = router