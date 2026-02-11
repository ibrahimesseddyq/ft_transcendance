const profileController = require('../controllers/profileController');
const express =  require('express');
const router = express.Router();
const {uploadProfile} =  require('../config/multer');
const {
    createProfileSchema,
    updateProfileSchema
} = require('../validators/profileValidator');
const validateRequest = require('../middleware/ValidateRequest');

// the validate request should be refactored based on req.body & req.files
router.get('/:id', profileController.getProfile)
    .post('/',uploadProfile.fields([
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

module.exports = router;