import express from 'express';
import session from 'express-session';
import passport from './passport.js';


const app = express();
const SESSION_SECRET  = 'dddddddvcsdredgerthgbzcsdfsvfd1204rtr';
/* SESSION  */
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

/* PASSPORT */
app.use(passport.initialize());
app.use(passport.session());

/* ROUTES */
app.get('/', (req, res) => {
  res.send(
    req.user
      ? `<h1>Hello ${req.user.first}</h1><a href="/logout">Logout</a>`
      : '<a href="/auth/google">Login with Google</a>'
  );
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log(req.user);
    res.redirect('http://localhost:5173/dashboard');
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.listen(3000, () =>
  console.log('Server running on http://localhost:3000')
);
