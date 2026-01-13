const passport = require('../controllers/GoogleAuth.js');
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/login.controller');
const { signUp } = require('../controllers/auth.controller');
const { signupSchema } = require('../schemas/SchemaForm');
const { loginSchema } = require('../schemas/loginShchema');
const { loginValidate } = require('../middleware/login.validate.middleware');
const { validate } = require('../middleware/validate.middleware');
const { verifyEmail, resendVerificationEmail } = require('../controllers/email.controller');


// /* ROUTES */
// router.get('/', (req, res) => {
//   res.redirect('http://localhost:5173/');
// });

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', passport.authenticate('google',
  { successReturnToOrRedirect: 'http://localhost:5173/dashboard', failureRedirect: 'http://localhost:5173' }),
  (req, res) => {
   
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

router.post('/signup', validate(signupSchema), async (req, res) => {
    await signUp(req, res);
});

router.post('/login', loginValidate(loginSchema), async (req, res) => {
    await login(req, res);
});

router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

module.exports = router;