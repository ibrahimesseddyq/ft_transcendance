const passport = require('passport');
require('dotenv').config();
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../..', '.env') });

// const { PrismaClient } = require('../../generated/prisma');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log("CALLBACK_URL : *" + process.env.GOOGLE_CLIENT_ID + "*")
console.log("CALLBACK_URL : *" + process.env.GOOGLE_CLIENT_SECRET + "*")
console.log("CALLBACK_URL : *" + process.env.CALLBACK_URL + "*")
passport.use(new GoogleStrategy({ 
    clientID: process.env.GOOGLE_CLIENT_ID || '103278425538-0iqof4oahn4rfkl1j51tbd4t8bvu6655.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
      const nameParts = profile.displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const user = await prisma.users.upsert({
        // search for user with google id
        where: { id: profile.id },
        // update the user data if already exist
        update: {
          first_name: firstName,
          last_name: lastName,
          avatar_url: profile.photos?.[0]?.value || null
        },
        // create user if not exist in the database
        create: {
          id: profile.id,
          email: profile.emails?.[0]?.value || '',
          first_name: firstName,
          last_name: lastName,
          avatar_url: profile.photos?.[0]?.value || null,
          password_hash: '',
          role: 'candidate'
        }
      });
      
      return done(null, user);
    } catch (err) {
      console.error('Google auth error:', err);
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id); // Save only the MySQL ID in the cookie
});

// Deserialize: Find the actual user from the DB using that ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.users.findUnique({ where: { id } });
    if (user)
      done(null, user);
    else
      console.log("No user found with this id ", id);
  } catch (err) {
    done(err, null);
  }
});
module.exports = passport;
