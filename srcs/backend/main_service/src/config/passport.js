const env = require('../config/env');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const userService = require('../services/userService');
console.log(`http://${env.HOST}:${env.PORT}${env.CALLBACK_URL}`);

const callbackURL = `http://${env.HOST}:${env.PORT}${env. CALLBACK_URL}`;
passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        console.log(request.body);
        const user = await userService.findUserOrCreate(profile);
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) =>{
    done(null, user.id)
});
    
passport.deserializeUser(async (id, done) => {
    const user = await userService.getUserById(id);
    done(null, user);
});

module.exports = passport;