const { verifyAccessToken } = require('../utils/jwt');

const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access token required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = await verifyAccessToken(token);
        
        req.user = decoded;
        next();
        
    } catch (error) {
        if (error.code === 'ERR_JWT_EXPIRED') {
            return res.status(401).json({ 
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }
        if (error.code === 'ERR_JWT_INVALID') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
            return res.status(401).json({ message: 'Token validation failed' });
        }
        console.error('JWT verification error:', error);
        return res.status(500).json({ message: 'Authentication error' });
    }
};

const optionalJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = await verifyAccessToken(token);
            req.user = decoded;
        }
        
        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};

module.exports = { verifyJWT, optionalJWT };
