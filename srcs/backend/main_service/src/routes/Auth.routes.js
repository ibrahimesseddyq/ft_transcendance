const passport = require('../controllers/GoogleAuth.js');
const express = require('express');
const router = express.Router();


/* ROUTES */
router.get('/', (req, res) => {
  res.redirect('http://localhost:5173/');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', passport.authenticate('google',
  { successReturnToOrRedirect: 'http://localhost:5173/dashboard', failureRedirect: 'http://localhost:5173' }),
  (req, res) => {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  }
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