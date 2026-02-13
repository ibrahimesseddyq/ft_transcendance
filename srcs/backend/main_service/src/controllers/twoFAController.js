export class TwoFAController
{
    constructor(twoFAService)
    {
        this.twoFAService = twoFAService;
    }

    setup = async (req, res) =>
    {
        // to validate
        const data = await this.twoFAService.setup(req.setup.id);
        res.json(data);
    };

    verifySetup = async (req, res) => {
        const { token } = req.body;
        const data = await this.twoFAService.verifySetup(req.user.id, token);
        res.json(data);
    };

    disable = async (req, res) => {
        const { token } = req.body;
        const data = await this.twoFAService.disable(req.user.id, token);
        res.json(data);
    };
};