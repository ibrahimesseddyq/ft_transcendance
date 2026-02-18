import  TwoFAService from  '../services/twoFAService.js';
import * as userService from  '../services/userService.js';
import asyncHandler from '../utils/asyncHandler.js';
const twoFAService = new TwoFAService(userService);

export const    setup = asyncHandler( async (req, res) => {
    // to validate
    const data = await twoFAService.setup(req.body.id);
    res.json(data);
})

export const    verifySetup = asyncHandler( async (req, res) => {
    const { token } = req.body;
    const data = await twoFAService.verifySetup(req.body.id, token);
    res.json(data);
})

export const    disable = asyncHandler( async (req, res) => {
    const { token } = req.body;
    const data = await twoFAService.disable(req.body.id, token);
    res.json(data);
})
