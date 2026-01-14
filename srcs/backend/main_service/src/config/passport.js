const env = require('../config/env');
const passport = require('passport');
const { prisma } = require('./prisma');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { findUserOrCreate } = require('../services/userService');

passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://${env.HOST}:${env.PORT}${env.CALLBACK_URL}`
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        const user = await findUserOrCreate(profile);
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) =>{
    done(null, user.id)
});
    
passport.deserializeUser(async (id, done) => {
    const user = await prisma.users.findUnique({ where: { id } });
    done(null, user);
});

module.exports = passport;