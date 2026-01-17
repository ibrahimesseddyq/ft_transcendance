const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/ValidateRequest');
const passport = require('../config/passport');
const {registerUserSchema,loginUserSchema} = require('../validators/userValidator');

router.post('/login',validateRequest(loginUserSchema),authController.login);
router.post('/register',validateRequest(registerUserSchema),authController.register);
router.post('/refresh',authController.refresh);
router.post('/logout',authController.logout);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }),
    (req, res) =>{
        console.log(req.user);
        console.log(res.user);
    }
);
router.get('/google/callback', 
    passport.authenticate('google', { successReturnToOrRedirect: 'http://localhost:5173/dashboard', 
    failureRedirect: 'http://localhost:5173' }),
    (req, res) =>{
        authController.googleCallback
    }
);


module.exports = router;