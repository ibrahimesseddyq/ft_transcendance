const prisma = require('../config/prisma');
const argon2 = require('argon2');
const { sendOTPEmail } = require('../controllers/email.controller');
const {jwt} = require('../utils/jwt');
const { 
    generateAccessToken, 
    generateRefreshToken,
    verifyRefreshToken,
    setRefreshTokenCookie,
    clearRefreshTokenCookie
} = require('../utils/jwt');



const signUp = async (req, res) => {
    try {
        const IsExist = await prisma.users.findUnique({
            where: {
                email: req.body.email,
            },
        });
        
        if (IsExist) {
            return res.status(400).json({ message: "User already exists" });
        }
                
        const hashedPassword = await argon2.hash(req.body.password);
        const newUser = await prisma.users.create({
            data: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword,
                role: req.body.role || 'candidate'
            },
        });
        
        // // Send verification email with timeout
        // try {
        //     await Promise.race([
        //         sendOTPEmail(req.body.email),
        //         new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), 5000))
        //     ]);
        // } catch (emailError) {
        //     // Continue anyway - user is created
        //     console.log('email failed');
        // }
        await sendOTPEmail(req.body.email);
        return res.status(201).json({
            message: 'User registered successfully',
            // redirectTo: '/verify-email',
            user: {
            id: newUser.id,
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            role: newUser.role
            }
        });
    }
     catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { signUp };


const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        // Verify refresh token (now async with jose)
        const decoded = await verifyRefreshToken(refreshToken);

        // Get user and verify token version
        const user = await prisma.users.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new access token (now async with jose)
        const accessToken = await generateAccessToken(user);

        return res.status(200).json({ accessToken });

    } catch (error) {
        if (error.code === 'ERR_JWT_EXPIRED') {
            clearRefreshTokenCookie(res);
            return res.status(401).json({ 
                message: 'Refresh token expired',
                code: 'REFRESH_TOKEN_EXPIRED'
            });
        }
        console.error('❌ Token refresh error:', error);
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
};

const logout = async (req, res) => {
    try {
        clearRefreshTokenCookie(res);
        
        // Optional: Increment tokenVersion to invalidate all existing tokens
        // await prisma.users.update({
        //     where: { id: req.user.userId },
        //     data: { tokenVersion: { increment: 1 } }
        // });

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('❌ Logout error:', error);
        return res.status(500).json({ message: 'Logout failed' });
    }
};

module.exports = { 
    refreshAccessToken,
    logout,
    signUp
};