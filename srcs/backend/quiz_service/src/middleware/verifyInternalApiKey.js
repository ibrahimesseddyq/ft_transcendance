import {HttpException} from '../utils/httpExceptions.js'
import crypto from 'crypto';
import env from '../config/env.js';

export const verifyInternalApiKey = (req, res, next) => {
    const apiKey = req.headers["x-internal-api-key"] ?? "";
    const expected = env.INTERNAL_API_KEY;
    const a = Buffer.from(apiKey.padEnd(expected.length, '\0').slice(0, expected.length));
    const b = Buffer.from(expected);
    if (a.length === b.length && crypto.timingSafeEqual(a, b) && apiKey.length === expected.length) {
        return next();
    }
    next(new HttpException(401, 'Unauthorized'));
};