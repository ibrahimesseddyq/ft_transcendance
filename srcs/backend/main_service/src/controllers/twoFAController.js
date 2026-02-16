const TwoFAService = require('../services/twoFAService');
const userService = require('../services/userService');

const twoFAService = new TwoFAService(userService);

const    setup = async (req, res) =>
    {
        // to validate
        const data = await twoFAService.setup(req.user.id);
        res.json(data);
    };

const    verifySetup = async (req, res) => {
        const { token } = req.body;
        const data = await twoFAService.verifySetup(req.user.id, token);
        res.json(data);
    };

const    disable = async (req, res) => {
        const { token } = req.body;
        const data = await twoFAService.disable(req.user.id, token);
        res.json(data);
    };
module.exports = {
    disable,
    verifySetup,
    setup
}