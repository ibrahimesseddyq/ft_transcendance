import env from'../config/env.js';
import * as authService from'../services/authService.js';
import asyncHandler from '../utils/asyncHandler.js';
const cookieOptions = {
    httpOnly: true,
    maxAge:7 * 24 * 60 * 60 * 1000,
    sameSite: env.NODE_ENV === "production" ? 'none' : 'lax',
    secure: env.NODE_ENV === "production"
}

export const login = asyncHandler(async (req, res, next) => {
        // 2FA
        const result = await authService.login(req.body);

        const {userId, accessToken, refreshToken, firstLogin} = result;
        if (result.require2FA)
        {
            return res.status(200).json({
                message: "2FA required",
                require2FA: true,
                tempToken: result.tempToken,
                userId: userId,
                firstLogin: firstLogin
            });
        }
        // Normal flow
        res
        .cookie('jwt', refreshToken ,cookieOptions)
        .status(200)
        .json({
                success: true,
                message: 'login successful',
                data:{
                    user,
                    accessToken
                }
            }
        );
})

export const verify2FA = asyncHandler(async (req, res, next) =>{

    const { tempToken, code } = req.body;
    const { user, accessToken, refreshToken} = await authService.verifyLoginWith2FA(tempToken, code);

    res.cookie('jwt', refreshToken, cookieOptions)
    .status(200)
    .json(
        {
            message:'login successful',
            data: {
                user,
                accessToken
            }
        }
    );
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
        const refreshToken = req.cookies.jwt;
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
        .json({
            success: true,
            message: 'token refreshed successfully',
            data:{
                user,
                accessToken
            }
        });
})

export const logout =  asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken)
        return res.sendStatus(204);
    await authService.logout(refreshToken);
    res.clearCookie('jwt', cookieOptions).sendStatus(204);
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




