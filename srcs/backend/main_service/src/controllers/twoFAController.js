import  TwoFAService from  '../services/twoFAService.js';
import * as userService from  '../services/userService.js';

const twoFAService = new TwoFAService(userService);

export const    setup = async (req, res) =>
    {
        // to validate
        console.log("iam here");
        const data = await twoFAService.setup(req.body.id);
        res.json(data);
    };

export const    verifySetup = async (req, res) => {
        const { token } = req.body;
        const data = await twoFAService.verifySetup(req.body.id, token);
        res.json(data);
    };

export const    disable = async (req, res) => {
        const { token } = req.body;
        const data = await twoFAService.disable(req.body.id, token);
        res.json(data);
};
