import env from'../config/env.js';
import * as authService from'../services/authService.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as jwtService from '../services/jwtService.js';
import { getSafeUser } from '../utils/excludeSensitive.js';
import * as userService from '../services/userService.js'
import ms from 'ms';

export const accessTokenOptions = {
    httpOnly: true,
    maxAge: ms(env.ACCESS_TOKEN_EXPIRY),
    sameSite: env.NODE_ENV === "production" ? 'none' : 'lax',
    secure: env.NODE_ENV === "production"
}
export const refreshTokenOptions = {
    httpOnly: true,
    maxAge: ms(env.REFRESH_TOKEN_EXPIRY),
    sameSite: env.NODE_ENV === "production" ? 'none' : 'lax',
    secure: env.NODE_ENV === "production",
    path: '/api/main/auth/refresh'
}
export const tempTokenOptions = {
    httpOnly: true,
    maxAge: ms(env.TEMP_TOKEN_EXPIRY),
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
                data : {
                    require2FA: true,
                    id: result.userId,
                    firstLogin: result.firstLogin
                }
            });
        }
        res
        .cookie('accessToken',result.accessToken,accessTokenOptions)
        .cookie('refreshToken', result.refreshToken ,refreshTokenOptions)
        .status(200)
        .json({
                success: true,
                message: 'login successful',
                data: getSafeUser(result.user),
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
        data:  getSafeUser(user)
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

export const refresh = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: 'refreshToken not provided' });
    }
    const { user, accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
    res
        .status(200)
        .cookie('accessToken', accessToken, accessTokenOptions)
        .cookie('refreshToken', newRefreshToken, refreshTokenOptions)
        .json({
            success: true,
            message: 'token refreshed successfully',
            data: getSafeUser(user)
        });
});

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
    const user = req.user;
    if (user.twoFAEnabled) {
        const tempToken = jwtService.generateTempToken({
            id: user.id, email: user.email, purpose: '2fa-pending'
        });
        return res.cookie('tempToken', tempToken, tempTokenOptions)
            .redirect(`${env.FRONTEND_URL}/auth/callback?userId=${user.id}&firstLogin=${user.firstLogin}`);
    }

    const tokens = jwtService.generateAuthTokens({ id: user.id, email: user.email, role: user.role });
    await userService.updateUser(user.id, { refreshToken: tokens.refreshToken });
    res.cookie('accessToken', tokens.accessToken, accessTokenOptions)
       .cookie('refreshToken', tokens.refreshToken, refreshTokenOptions)
       .redirect(`${env.FRONTEND_URL}/auth/callback?userId=${user.id}&firstLogin=${user.firstLogin}`);
});
