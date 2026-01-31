const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const jwtService = require('../services/jwtService');
const validateRequest = require('../middleware/ValidateRequest');
const passport = require('../config/passport');
const {registerUserSchema,loginUserSchema} = require('../validators/userValidator');

router.post('/login',validateRequest(loginUserSchema),authController.login);
router.post('/register',validateRequest(registerUserSchema),authController.register);
router.post('/refresh',authController.refresh);
router.post('/logout',authController.logout);
router.get('/verify-email/:token',authController.verifyEmail);
router.post('/resend-verification',authController.resendVerification);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: 'http://localhost:5173/Login',
        session: false 
    }),
    async (req, res) => {
        try {
            const tokens = jwtService.generateAuthTokens({
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            });
            res.redirect(`http://localhost:5173/Login?token=${tokens.accessToken}`);
        } catch (error) {
            console.log(error);
        }
    }
);

module.exports = router;