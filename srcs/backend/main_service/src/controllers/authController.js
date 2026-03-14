import env from'../config/env.js';
import * as authService from'../services/authService.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as jwtService from '../services/jwtService.js';

const accessTokenOptions = {
    httpOnly: true,
    maxAge:7 * 24 * 60 * 60 * 1000,
    sameSite: env.NODE_ENV === "production" ? 'none' : 'lax',
    secure: env.NODE_ENV === "production"
}
const refreshTokenOptions = {
    httpOnly: true,
    maxAge:7 * 24 * 60 * 60 * 1000,
    sameSite: env.NODE_ENV === "production" ? 'none' : 'lax',
    secure: env.NODE_ENV === "production",
    path: '/api/main/auth/refresh'
}
const tempTokenOptions = {
    httpOnly: true,
    maxAge:7 * 24 * 60 * 60 * 1000,
    sameSite: env.NODE_ENV === "production" ? 'none' : 'lax',
    secure: env.NODE_ENV === "production",
}


export const login = asyncHandler(async (req, res, next) => {
        const result = await authService.login(req.body);
        if (result.require2FA)
        {
            return res
            .cookie('tempToken', result.tempToken, tempTokenOptions)
            .status(200).json({
                message: "2FA required",
                require2FA: true,
                userId: result.userId,
                firstLogin: result.firstLogin
            });
        }
        res
        .cookie('accessToken',result.accessToken,accessTokenOptions)
        .cookie('refreshToken', result.refreshToken ,refreshTokenOptions)
        .status(200)
        .json({
                success: true,
                message: 'login successful',
                data:{
                    user: result.user,
                }
            }
        );
})

export const verify2FA = asyncHandler(async (req, res, next) =>{
    const tempToken = req.cookies.tempToken;
    const {code} = req.body;
    const { user, accessToken, refreshToken} = await authService.verifyLoginWith2FA(tempToken, code);
    
    res
    .cookie('accessToken',accessToken,accessTokenOptions)
    .cookie('refreshToken', refreshToken ,refreshTokenOptions)
    .status(200)
    .json({
        message:'login successful',
        data: {
            user,
        }
    });
})

export const register = asyncHandler(async (req, res, next) => {
    const user = await authService.register(req.body)
    res
    .status(201)
    .json({
        message : 'If the email is valid, an account will be created.',
    });
})


export const refresh =  asyncHandler(async (req, res, next) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res
            .status(401)
            .json({
                error: 'refreshToken not provided'
            });
        }
        const {user, accessToken} = await  authService.refresh(refreshToken);
        res
        .status(200)
        .cookie('accessToken',accessToken,accessTokenOptions)
        .json({
            success: true,
            message: 'token refreshed successfully',
            data:{
                user,
            }
        });
})

export const logout =  asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.sendStatus(204);
    await authService.logout(refreshToken);
    res.clearCookie('accessToken', accessTokenOptions)
    .clearCookie('refreshToken',refreshTokenOptions)
    .sendStatus(204);
})

export const verifyEmail = asyncHandler(async (req, res, next) => {
    const token = req.params.token;
    await authService.verifyEmail(token);
    res.redirect(`${env.FRONTEND_URL}`);

})

export const resendVerification = asyncHandler(async (req, res, next) => {
    const email = req.body.email;
    const message = await authService.resendVerification(email);
    res.status(200).json({ message });
}) 

export const googleCallBack = asyncHandler(async (req, res) => {
    const tokens = jwtService.generateAuthTokens({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
    });
    const tempToken = jwtService.generateTempToken({
        id: req.user.id,
        email: req.user.email,
        purpose: '2fa-pending'
    })
    const userId = req.user.id;
    const firstLogin = req.user.firstLogin;
    res.cookie('accessToken', tokens.accessToken, accessTokenOptions)
    .cookie('refreshToken',tokens.refreshToken, refreshTokenOptions)
    .cookie('tempToken',tempToken, tempTokenOptions)
    .redirect(`${env.FRONTEND_URL}/auth/callback?userId=${userId}&firstLogin=${firstLogin}`);
})
