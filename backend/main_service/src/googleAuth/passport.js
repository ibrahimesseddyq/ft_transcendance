

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js'; 


const GOOGLE_CLIENT_ID = '103278425538-0iqof4oahn4rfkl1j51tbd4t8bvu6655.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const [user] = await User.findOrCreate({
          where: { googleId: profile.id },
          defaults: {
            first: profile.name.givenName,
            last: profile.name.familyName,
            email: profile.emails[0].value,
          },
        });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Store user ID in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Get user from DB on each request
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
