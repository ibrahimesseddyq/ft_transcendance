const twoFAController = require('../controllers/twoFAController');
const express = require('express');
const router = express.Router();


router.post('/setup',validateRequest(registerUserSchema),twoFAController.setup);
router.post('/verify-setup',twoFAController.verifySetup);
router.post('/disable',twoFAController.disable);