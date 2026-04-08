import env from '../config/env.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import * as  userService from '../services/userService.js';

const protocolByMode = env.NODE_ENV === 'development' ? 'http' : 'https';
const resolvedBackendBaseUrl = /^https?:\/\//.test(env.BACKEND_URL)
    ? env.BACKEND_URL
    : `${protocolByMode}://${env.HOST}:${env.PORT}`;

const callbackURL = env.CALLBACK_URL.startsWith('http')
    ? env.CALLBACK_URL
    : `${resolvedBackendBaseUrl.replace(/\/$/, '')}${env.CALLBACK_URL}`;

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