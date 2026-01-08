const {prisma} = require('../config/prisma')
const argon2 = require('argon2');


const { 
    generateAccessToken, 
    generateRefreshToken,
    verifyRefreshToken,
    setRefreshTokenCookie
} = require('../utils/jwt');

const login = async (req, res) => {
    try {
        const { email, password } = req.body; 
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
        }
        
        // Check if user already has a valid refresh token (from cookies)
        const existingRefreshToken = req.cookies.refreshToken;
        
        if (existingRefreshToken) {
            try {
                // Verify the existing refresh token
                const decoded = await verifyRefreshToken(existingRefreshToken);
                
                // Get user from decoded token
                const existingUser = await prisma.users.findUnique({
                    where: { id: decoded.userId }
                });

                // If token is valid and belongs to the same user trying to login
                if (existingUser && existingUser.email === email) {
                    console.log('✅ User already has valid session:', email);
                    
                    // Generate new access token (refresh token stays the same)
                    const accessToken = await generateAccessToken(existingUser);
                    
                    return res.status(200).json({
                        success: true, // ✅ Added for consistency
                        message: 'Already logged in',
                        accessToken,
                        user: {
                            id: existingUser.id,
                            email: existingUser.email,
                            isEmailVerified: existingUser.isEmailVerified
                        }
                    });
                }
            } catch (error) {
                // Token invalid or expired, continue with normal login
                console.log('Existing token invalid, proceeding with new login');
            }
        }

        // Find user by email
        const user = await prisma.users.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({ 
                success: false,
                message: 'Please verify your email before logging in',
                code: 'EMAIL_NOT_VERIFIED'
            });
        }

        // Verify password using argon2
        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        console.log('✅ User logged in:', user.email);

        // Generate new JWT tokens
        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user); // ✅ Fixed variable name (lowercase r)

        // Set refresh token as httpOnly cookie
        setRefreshTokenCookie(res, refreshToken); // ✅ Fixed variable name

        return res.status(200).json({
            success: true, // ✅ Added for consistency
            message: 'Login successful',
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        return res.status(500).json({ // ✅ Added return
            success: false,
            message: 'Login failed'
        });
    }
};

module.exports = { login };