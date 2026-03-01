import * as  profileController from '../controllers/profileController.js';
import {uploadProfile} from '../config/multer.js';
import {
    createProfileSchema,
    updateProfileSchema
} from '../validators/profileValidator.js';
import validateRequest from '../middleware/ValidateRequest.js';
import express from 'express';

const router = express.Router();

// the validate request should be refactored based on req.body & req.files
router.get('/:id', 
            // verifyToken,
            profileController.getProfile)
    .post('/:id',
            // verifyToken,
        uploadProfile.fields([
            {name : "avatar" , maxCount: 1},
            {name : "resume", maxCount: 1}
        ])
        ,profileController.createProfile)
    .patch('/:id',
            // verifyToken,
            uploadProfile.fields([
            {name : "avatar" , maxCount: 1},
            {name : "resume", maxCount: 1},
        ]),
        profileController.updateProfile);

export default router;