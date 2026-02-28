import  TwoFAService from  '../services/twoFAService.js';
import * as userService from  '../services/userService.js';

const twoFAService = new TwoFAService();

export const    setup = async (req, res ,next) =>
{
    try {

        console.log("iam here");
        const data = await twoFAService.setup(req.body.id);
        res.json(data);
            } catch (error) {
        next(error)
    }
};

export const    verifySetup = async (req, res,next) => {
     try {

        const { code } = req.body;
        
        const data = await twoFAService.verifySetup(req.body.id, code);
        res.json(  {             
            data: {
                    user : data.user,
                    accessToken : data.accessToken
                }
            });
            } catch (error) {
        next(error)
    }
};

export const    disable = async (req, res,next) => {
        try {

        const { token } = req.body;
        const data = await twoFAService.disable(req.body.id, token);
        res.json(data);
            } catch (error) {
        next(error)
    }
};
