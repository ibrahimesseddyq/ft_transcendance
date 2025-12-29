// import app from 'express';
// const app = express();

// Routes
app.get('/', (req, res) => {
  res.send(req.user ? `<h1>Hello ${req.user.displayName}</h1><a href="/logout">Logout</a>` : '<a href="/auth/google">Login with Google</a>');
});

// Start Authentication
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback Route
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});
