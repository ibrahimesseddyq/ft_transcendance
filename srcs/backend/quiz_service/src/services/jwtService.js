import jwt from 'jsonwebtoken';
import {HttpException} from '../utils/httpExceptions.js';
import env from '../config/env.js';

const accessTokenSecret = env.ACCESS_TOKEN_SECRET;

export const verify = async (token, secret) => {
    return new Promise((resolve,reject) => {
        jwt.verify(token,secret, (err, decoded) => {
            if(err) {
                if (err.name === 'TokenExpiredError')
                    reject(new HttpException(401,'Token expired'));
                else if (err.name === 'JsonWebTokenError')
                    reject(new HttpException(403,'Invalid token'));
                else
                    reject(new HttpException(403,'Forbidden'));
            }
            else
                resolve(decoded);
        })
    })
}

export const verifyAccessToken = (token) => {
    return verify(token,accessTokenSecret);
}
