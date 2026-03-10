import {getRecruiterDashboard} from '../controllers/dashboardController.js';
import express from 'express'
import {verifyRoles} from '../middleware/auth.js';

const router = express.Router();

router.get('/',
    // verifyRoles(['recruiter']),
    getRecruiterDashboard
)

export default router;