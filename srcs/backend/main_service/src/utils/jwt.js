const { SignJWT, jwtVerify } = require('jose');

// Convert secret strings to Uint8Array for jose
const getSecretKey = (secret) => {
    return new TextEncoder().encode(secret);
};

const generateAccessToken = async (user) => {
    const secret = getSecretKey(process.env.JWT_SECRET);
    
    const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified
    })
    .setProtectedHeader({ alg: 'HS256' }) // Algorithm
    .setIssuedAt() // Current timestamp
    .setIssuer('RH connect') // Who created the token
    .setAudience('Clients') // Who the token is for
    .setExpirationTime('15m') // Expires in 15 minutes
    .sign(secret);
    
    return token;
};

const generateRefreshToken = async (user) => {
    const secret = getSecretKey(process.env.JWT_REFRESH_SECRET);
    
    const token = await new SignJWT({
        userId: user.id,
        tokenVersion: user.tokenVersion || 0
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('RH connect')
    .setAudience('Clients')
    .setExpirationTime('7d') // Expires in 7 days
    .sign(secret);
    
    return token;
};

const verifyAccessToken = async (token) => {
    try {
        const secret = getSecretKey(process.env.JWT_SECRET);
        
        const { payload } = await jwtVerify(token, secret, {
            issuer: 'RH connect',
            audience: 'Clients'
        });
        
        return payload;
    } catch (error) {
        throw error;
    }
};

const verifyRefreshToken = async (token) => {
    try {
        const secret = getSecretKey(process.env.JWT_REFRESH_SECRET);
        
        const { payload } = await jwtVerify(token, secret, {
            issuer: 'RH connect',
            audience: 'Clients'
        });
        
        return payload;
    } catch (error) {
        throw error;
    }
};

const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

const clearRefreshTokenCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    setRefreshTokenCookie,
    clearRefreshTokenCookie
};
