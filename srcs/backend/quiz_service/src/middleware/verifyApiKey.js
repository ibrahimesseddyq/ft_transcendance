import {HttpException} from '../utils/httpExceptions.js'
import crypto from 'crypto';
import env from '../config/env.js';

export const verifyApiKey = async (req, res, next) => {
    let apiKey = req.headers["x-api-key"] || "";
    const isEqual = apiKey.length === env.QUIZ_PUBLIC_API_KEY.length;
    if(!apiKey || apiKey.length !== env.QUIZ_PUBLIC_API_KEY.length)
        apiKey = env.QUIZ_PUBLIC_API_KEY;
    if (crypto.timingSafeEqual(Buffer.from(env.QUIZ_PUBLIC_API_KEY), Buffer.from(apiKey)) && isEqual)
        return next()
    throw new HttpException(401, 'Unauthorized');
}