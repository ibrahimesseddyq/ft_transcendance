import * as authController from '../controllers/authController.js';
import express from 'express';
import * as jwtService from '../services/jwtService.js';
import validateRequest from '../middleware/ValidateRequest.js';
import passport from '../config/passport.js';
import {registerUserSchema,loginUserSchema} from '../validators/userValidator.js';

const router = express.Router();

router.post('/login',validateRequest(loginUserSchema),authController.login);
router.post('/register',validateRequest(registerUserSchema),authController.register);
router.post('/refresh',authController.refresh);
router.post('/logout',authController.logout);
router.post('/verify-2fa', authController.verify2FA);

router.get('/verify-email/:token',authController.verifyEmail);
router.post('/resend-verification',authController.resendVerification);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: 'http://localhost:5173/Login',
        session: false 
    }),
    // the followin async function should moved to the controller
    async (req, res) => {
        try {
            const tokens = jwtService.generateAuthTokens({
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            });
            const userId = req.user.id;
            res.redirect(`http://localhost:5173/auth/callback?token=${tokens.accessToken}&userId=${userId}`);
        } catch (error) {
            res.status(400)
            .json({
                    success: false,
                    message: 'Google authentication failed' 
                });
        }
    }
);

export default router;