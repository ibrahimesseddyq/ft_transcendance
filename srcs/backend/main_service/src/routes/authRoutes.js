import * as authController from '../controllers/authController.js';
import express from 'express';
import env from '../config/env.js'
import * as jwtService from '../services/jwtService.js';
import validateRequest from '../middleware/ValidateRequest.js';
import passport from '../config/passport.js';
import {registerUserSchema,loginUserSchema} from '../validators/userValidator.js';

const router = express.Router();

router.post('/login',
        validateRequest(loginUserSchema),
        authController.login)
    .post('/register',
        validateRequest(registerUserSchema),
        authController.register)
    .post('/refresh',
        authController.refresh)
    .post('/logout',
        authController.logout)
    .post('/verify-2fa',
        authController.verify2FA)
    .get('/verify-email/:token',
        authController.verifyEmail)
    .post('/resend-verification',
        authController.resendVerification)
    .get('/google',
        passport.authenticate('google', {scope: ['profile', 'email']}))
    .get('/google/callback', 
        passport.authenticate('google', { 
            failureRedirect: `${env.FRONTEND_URL}/Login`,
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
            res
            .cookie('accessToken', tokens)
            .redirect(`http://localhost:5173/auth/callback?userId=${userId}`);
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