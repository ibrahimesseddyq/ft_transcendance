const jwt = require('jsonwebtoken');
const {HttpException} = require('../utils/httpExceptions');
const env = require('../config/env');

const accessTokenSecret = env.ACCESS_TOKEN_SECRET;
const accessTokenExpiry = env.ACCESS_TOKEN_EXPIRY;
const refreshTokenSecret = env.REFRESH_TOKEN_SECRET;
const refreshTokenExpiry = env.REFRESH_TOKEN_EXPIRY;
const tempTokenSecret = env.TEMP_TOKEN_SECRET || accessTokenSecret;
const tempTokenExpiry = env.TEMP_TOKEN_EXPIRY || "5m";

const generateTempToken = (payload) =>
{
    return sign(payload, tempTokenSecret, { expiresIn: tempTokenExpiry });
};
const verifyTempToken = (payload) => {
    return verify(payload, tempTokenSecret);
};
const generateAuthTokens =  (payload) => {
    const accessToken = sign(payload,accessTokenSecret,{
            expiresIn : accessTokenExpiry
        })
    const refreshToken = sign(payload,refreshTokenSecret,{
            expiresIn: refreshTokenExpiry
        }) 
    return {accessToken , refreshToken};  
}

const verify = async (token, secret) => {
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

 const verifyAccessToken = (token) => {
    return verify(token,accessTokenSecret);
}

const verifyRefreshToken = (token) => {
        return verify(token , refreshTokenSecret);
}

const sign = (payload , secret , options = {}) =>{
    return jwt.sign(payload,secret,options);
}

const decode = (token) => {
    return jwt.decode(token)
}

const refreshAccessToken = async (refreshToken) => {
    const decoded = await verifyRefreshToken(refreshToken);
    const { iat, exp, ...payload } = decoded;
    const accessToken = sign(payload, accessTokenSecret, {
        expiresIn : accessTokenExpiry
    })
    return {accessToken};
}

const verifyVerificationToken = async (token) => {
    const decoded = await verify(token,accessTokenSecret);
    if (!decoded || decoded.type !== 'email_verification')
        throw new HttpException(403, 'Invalid token type');
    return decoded;
}

const generateVerificationToken = async (userId, email) => {
    const payload = {
        id : userId,
        email: email,
        type: 'email_verification'
    }
    const token = sign(payload,accessTokenSecret,{expiresIn: "24h"});
    return token;
}

module.exports = {
    generateAuthTokens,
    verify,
    verifyAccessToken,
    verifyRefreshToken,
    sign,
    decode,
    refreshAccessToken,
    verifyVerificationToken,
    generateVerificationToken,
    generateTempToken,
    verifyTempToken
};