import  TwoFAService from  '../services/twoFAService.js';

const twoFAService = new TwoFAService();

export const    setup = async (req, res ,next) =>
{
    try {
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

        res
        .cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: false,        
            sameSite: "lax",      
            maxAge: 15 * 60 * 1000
        })
        .cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: false,        
            sameSite: "lax",      
            maxAge: 15 * 60 * 1000
        })
        .status(200)
        .json({
            message: "2FA setup successful",
            data: data.user
        });

    } catch (error) {
        next(error);
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
