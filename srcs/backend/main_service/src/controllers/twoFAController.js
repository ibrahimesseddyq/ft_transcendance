import  TwoFAService from  '../services/twoFAService.js';
import {accessTokenOptions} from './authController.js'
import { refreshTokenOptions } from './authController.js';
import asyncHandler from '../utils/asyncHandler.js';

const twoFAService = new TwoFAService();

export const    setup = asyncHandler(async (req, res ,next) =>
{
    const data = await twoFAService.setup(req.body.id);
    res.json(data);
});

export const    verifySetup = asyncHandler( async (req, res,next) => {
    const { code } = req.body;
    const data = await twoFAService.verifySetup(req.body.id, code);
    res
    .cookie("accessToken", data.accessToken, accessTokenOptions)
    .cookie("refreshToken", data.refreshToken, refreshTokenOptions)
    .status(200)
    .json({
        message: "2FA setup successful",
        data: data.user
    });
});

export const   disable = asyncHandler( async (req, res,next) => {
    const { token } = req.body;
    const data = await twoFAService.disable(req.body.id, token);
    res.json(data);
});
