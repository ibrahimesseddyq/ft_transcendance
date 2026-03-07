import {HttpException} from '../utils/httpExceptions.js'
import crypto from 'crypto';
import env from '../config/env.js';

export const verifyInternalApiKey = async (req, res, next) => {
    const apiKey = req.headers["x-internal-api-key"] || "";

    console.log("req.headers : ", req.headers);
    const isEqual = apiKey.length === env.INTERNAL_API_KEY.length;
    if(!apiKey || apiKey.length !== env.INTERNAL_API_KEY.length)
        apiKey = env.INTERNAL_API_KEY;
    if (crypto.timingSafeEqual(Buffer.from(env.INTERNAL_API_KEY), Buffer.from(apiKey)) && isEqual)
        return next()
    next(new HttpException(401, 'Unauthorized'));
}