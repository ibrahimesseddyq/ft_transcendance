const passport = require('../controllers/GoogleAuth.js');
const express = require('express');
const router = express.Router();


/* ROUTES */
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
  // res.redirect('http://localhost:5173/dashboard')
});
router.post('/signup', (req, res) => {
  console.log(req.body)
  // res.redirect('http://localhost:5173/dashboard')
});


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google',
  { successReturnToOrRedirect: 'http://localhost:5173/dashboard', failureRedirect: 'http://localhost:5173' }),
);
  
router.get("/status", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ loggedIn: true, user: req.user });
    } else {
        res.status(401).json({ loggedIn: false });
    }
});
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173/');
  });
});

module.exports = router;