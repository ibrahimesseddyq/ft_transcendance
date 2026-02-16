const twoFAController = require('../controllers/twoFAController');
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth')
const {registerUserSchema,loginUserSchema} = require('../validators/userValidator');


router.post('/setup',verifyToken,twoFAController.setup);
router.post('/verify-setup',verifyToken, twoFAController.verifySetup);
router.post('/disable',verifyToken,twoFAController.disable);
module.exports = router