import {getRecruiterDashboard} from '../controllers/dashboardController.js';
import express from 'express'
import {verifyRoles} from '../middleware/auth.js';
import { UserRole } from '../../generated/prisma/index.js';
const router = express.Router();

router.get('/',
    verifyRoles([UserRole.recruiter]),
    getRecruiterDashboard
)

export default router;