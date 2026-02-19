import jwt from 'jsonwebtoken';
import {HttpException} from '../utils/httpExceptions.js';
import env from '../config/env.js';

const accessTokenSecret = env.ACCESS_TOKEN_SECRET;
const accessTokenExpiry = env.ACCESS_TOKEN_EXPIRY;
const refreshTokenSecret = env.REFRESH_TOKEN_SECRET;
const refreshTokenExpiry = env.REFRESH_TOKEN_EXPIRY;
const tempTokenSecret = env.TEMP_TOKEN_SECRET || accessTokenSecret;
const tempTokenExpiry = env.TEMP_TOKEN_EXPIRY || "55m";

export const generateTempToken = (payload) =>
{
    return sign(payload, tempTokenSecret, { expiresIn: tempTokenExpiry });
};
export const verifyTempToken = (payload) => {
    return verify(payload, tempTokenSecret);
};
export const generateAuthTokens =  (payload) => {
    const accessToken = sign(payload,accessTokenSecret,{
            expiresIn : accessTokenExpiry
        })
    const refreshToken = sign(payload,refreshTokenSecret,{
            expiresIn: refreshTokenExpiry
        }) 
    return {accessToken , refreshToken};  
}

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

export const verifyRefreshToken = (token) => {
        return verify(token , refreshTokenSecret);
}

export const sign = (payload , secret , options = {}) =>{
    return jwt.sign(payload,secret,options);
}

export const decode = (token) => {
    return jwt.decode(token)
}

export const refreshAccessToken = async (refreshToken) => {
    const decoded = await verifyRefreshToken(refreshToken);
    const { iat, exp, ...payload } = decoded;
    const accessToken = sign(payload, accessTokenSecret, {
        expiresIn : accessTokenExpiry
    })
    return {accessToken};
}

export const verifyVerificationToken = async (token) => {
    const decoded = await verify(token,accessTokenSecret);
    if (!decoded || decoded.type !== 'email_verification')
        throw new HttpException(403, 'Invalid token type');
    return decoded;
}

export const generateVerificationToken = async (userId, email) => {
    const payload = {
        id : userId,
        email: email,
        type: 'email_verification'
    }
    const token = sign(payload,accessTokenSecret,{expiresIn: "24h"});
    return token;
}
