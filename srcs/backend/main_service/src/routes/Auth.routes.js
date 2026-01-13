const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController').default;

// oAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { successReturnToOrRedirect: 'http://localhost:5173/dashboard', 
    failureRedirect: 'http://localhost:5173' }),
    authController.googleCallback
);
router.get("/status", authController.getAuthStatus);
router.get('/logout', authController.logout);


// Just for debuging
router.get('/', (req, res) => {
  res.redirect('http://localhost:5173/');
});

router.get('/login', (req, res) => {
  console.log("login route")
});
router.get('/signup', (req, res) => {
  console.log("signup route")
});

router.post('/login', (req, res) => {
  console.log(req.body)
  res.status(200).json({ redirectUrl: 'http://localhost:5173/dashboard' });
});
router.post('/signup', (req, res) => {
  console.log(req.body)
  res.status(200).json({ redirectUrl: 'http://localhost:5173/dashboard' });
});

module.exports = router;