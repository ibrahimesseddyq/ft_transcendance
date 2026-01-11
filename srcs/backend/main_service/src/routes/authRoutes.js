const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/ValidateRequest');
const {registerUserSchema,loginUserSchema} = require('../validators/userValidator');

router.post('/login',validateRequest(loginUserSchema),authController.login);
router.post('/register',validateRequest(registerUserSchema),authController.register);
router.post('/refresh',authController.refresh);
router.post('/logout',authController.logout);

module.exports = router;