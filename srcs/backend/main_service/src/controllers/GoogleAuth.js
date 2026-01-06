const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2' ).Strategy; //do not use var (deprecated)
const env = require('../config/env')
const {prisma} = require('../config/prisma');

console.log("CALLBACK_URL : *" + env.GOOGLE_CLIENT_ID + "*");
console.log("CALLBACK_URL : *" + env.GOOGLE_CLIENT_SECRET + "*");
console.log("CALLBACK_URL : *" + env.CALLBACK_URL + "*");

passport.use(new GoogleStrategy({ 
    clientID: env.GOOGLE_CLIENT_ID ,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL:`http://${env.HOST}:${env.PORT}${env.CALLBACK_URL}`
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
      const nameParts = profile.displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      console.log(typeof prisma.users);
      const user = await prisma.users.upsert({
        // search for user with google id
        where: { email: profile.emails?.[0]?.value },
        // update the user data if already exist
        update: {
          first_name: firstName,
          last_name: lastName,
          avatar_url: profile.photos?.[0]?.value || null
        },
        // create user if not exist in the database
        create: {
          email: profile.emails?.[0]?.value || '',
          first_name: firstName,
          last_name: lastName,
          avatar_url: profile.photos?.[0]?.value || null,
          password_hash: '',
          role: 'candidate'
        }
      });
      
      console.log(user);
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
