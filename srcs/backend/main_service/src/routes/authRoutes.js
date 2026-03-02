import * as authController from '../controllers/authController.js';
import express from 'express';
import env from '../config/env.js'
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
        authController.googleCallBack
);

export default router;