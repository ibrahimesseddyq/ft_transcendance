import * as  profileController from '../controllers/profileController.js';
import {uploadProfile} from '../config/multer.js';
import {
    createProfileSchema,
    updateProfileSchema
} from '../validators/profileValidator.js';
import validateRequest from '../middleware/ValidateRequest.js';
import express from 'express';
import { verifyOwnership } from '../middleware/auth.js';

const router = express.Router();

// the validate request should be refactored based on req.body & req.files
router.get('/:id',
            verifyOwnership,
            profileController.getProfile)
    .post('/:id',
        uploadProfile.fields([
            {name : "avatar" , maxCount: 1},
            {name : "resume", maxCount: 1}
        ])
        ,profileController.createProfile)
    .patch('/:id',
            uploadProfile.fields([
            {name : "avatar" , maxCount: 1},
            {name : "resume", maxCount: 1},
        ]),
        profileController.updateProfile);

export default router;