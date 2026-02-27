import * as  twoFAController from'../controllers/twoFAController.js';
import  express from'express';
import  {verifyToken} from'../middleware/auth.js';
import  {registerUserSchema,loginUserSchema} from'../validators/userValidator.js';

const  router = express.Router();

router.post('/setup',twoFAController.setup);
router.post('/verify-setup', twoFAController.verifySetup);
router.post('/disable',verifyToken,twoFAController.disable);
export default router