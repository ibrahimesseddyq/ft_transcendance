const nodemailer = require('nodemailer');
const crypto = require('crypto');
const prisma = require('../config/prisma');

const { 
    generateAccessToken, 
    generateRefreshToken,
    verifyRefreshToken,
    setRefreshTokenCookie,
    clearRefreshTokenCookie
} = require('../utils/jwt');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:" elhoussaineaboudi@gmail.com",
        pass: "cthn ceyk hwgt lsdn"
    }
});

// Helper: Send verification email
const sendVerificationEmail = async (email, token) => {
    // const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
    const verificationUrl = `localhost:5000/api/auth/verify-email?token=${token}`;
    
    const mailOptions = {
        from: `"Your App" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Email Verification',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        line-height: 1.6; 
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container { 
                        max-width: 600px; 
                        margin: 0 auto; 
                        padding: 20px; 
                        background-color: #ffffff;
                    }
                    .header {
                        background-color: #4CAF50;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 5px 5px 0 0;
                    }
                    .content {
                        padding: 30px 20px;
                    }
                    .button { 
                        display: inline-block;
                        padding: 15px 40px;
                        background-color: #4CAF50;
                        color: white !important;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 20px 0;
                        font-weight: bold;
                        font-size: 16px;
                    }
                    .link-box {
                        background-color: #f4f4f4;
                        padding: 15px;
                        word-break: break-all;
                        border-radius: 5px;
                        margin: 20px 0;
                        font-size: 14px;
                        border-left: 4px solid #4CAF50;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 2px solid #eee;
                        font-size: 12px;
                        color: #666;
                        text-align: center;
                    }
                    .warning {
                        background-color: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 10px 15px;
                        margin: 20px 0;
                        border-radius: 3px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0;">Email Verification</h1>
                    </div>
                    
                    <div class="content">
                        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
                        
                        <p style="text-align: center;">
                            <a href="${verificationUrl}" class="button">Verify Email Address</a>
                        </p>
                        
                        <p style="font-size: 14px; color: #666;">
                            If the button doesn't work, copy and paste this link into your browser:
                        </p>
                        
                        <div class="link-box">
                            ${verificationUrl}
                        </div>
                        
                        <div class="warning">
                            <strong>⏰ Important:</strong> This verification link will expire in <strong>24 hours</strong>.
                        </div>
                        
                        <p style="font-size: 14px; color: #666; margin-top: 30px;">
                            If you didn't create an account, you can safely ignore this email.
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated message, please do not reply to this email.</p>
                        <p>&copy; 2024 Your App. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Verification email sent to:', email);
        console.log('📧 Message ID:', info.messageId);
        console.log('🔗 Verification URL:', verificationUrl);
        return info;
    } catch (error) {
        console.error('❌ Failed to send email:', error.message);
        throw new Error('Failed to send verification email');
    }
};

const sendOTPEmail = async (email) => {
    try {
        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            throw new Error('User not found');
        }

        // Generate token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Save token to database
        await prisma.users.update({
            where: { email },
            data: {
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });

        console.log(`📧 Sending verification email to: ${email}`);

        // Send email
        await sendVerificationEmail(email, verificationToken);

        console.log('✅ Verification email sent successfully');
        return true;
    } catch (error) {
        console.error('❌ sendOTPEmail error:', error.message);
        throw error;
    }
};

// Verify email with token

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        // Find user with valid token
        const user = await prisma.users.findFirst({
            where: {
                emailVerificationToken: token,
                emailVerificationTokenExpires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Update user as verified
        const updatedUser = await prisma.users.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                emailVerificationToken: null,
                emailVerificationTokenExpires: null
            }
        });

        console.log('✅ Email verified for user:', updatedUser.email);

        // Generate JWT tokens (now async with jose)
        const accessToken = await generateAccessToken(updatedUser);
        const refreshToken = await generateRefreshToken(updatedUser);

        // Set refresh token as httpOnly cookie
        setRefreshTokenCookie(res, refreshToken);

        return res.status(200).json({ 
            message: 'Email verified successfully',
            accessToken,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                isEmailVerified: true
            },
            redirect: 'localhost:5000/api/auth/dashboard'
        });

    } catch (error) {
        console.error('❌ Email verification error:', error);
        return res.status(500).json({ message: 'Verification failed' });
    }
};

// Resend verification email
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Generate and send new token
        await sendOTPEmail(email);

        return res.status(200).json({ 
            message: 'Verification email sent successfully' 
        });

    } catch (error) {
        console.error('❌ Resend verification error:', error);
        return res.status(500).json({ 
            message: 'Failed to send verification email' 
        });
    }
};

module.exports = {
    sendOTPEmail,
    verifyEmail,
    resendVerificationEmail
};