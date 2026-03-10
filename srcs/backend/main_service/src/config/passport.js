import env from '../config/env.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import * as  userService from '../services/userService.js';

const callbackURL = `http://${env.HOST}:${env.PORT}${env.CALLBACK_URL}`;

passport.use(new GoogleStrategy({
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL
    }, async (request, accessToken, refreshToken, profile, done) => {
        try {
            const user = await userService.findUserOrCreate(profile);
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    })
);

export default  passport;