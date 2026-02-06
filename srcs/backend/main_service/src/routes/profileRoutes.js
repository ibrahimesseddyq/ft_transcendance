const profileController = require('../controllers/profileController');
const express =  require('express');
const router = express.Router();
const {uploadProfile} =  require('../config/multer');
const ValidateRequest = require('../middleware/ValidateRequest');
const {
    createProfileschema,
    updateProfileschema
} = require('../validators/profileValidator');
const validateRequest = require('../middleware/ValidateRequest');

router.get('/:id/resume',validateRequest(createProfileschema),
    profileController.getProfile)
    .post('/',uploadProfile.fields([
        {name : "avatar" , maxCount: 1},
        {name : "resume", maxCount: 1}
    ]),profileController.createProfile)
    .patch('/:id',validateRequest(updateProfileschema),
        uploadProfile.fields([
        {name : "avatar" , maxCount: 1},
        {name : "resume", maxCount: 1},
    ]),profileController.updateProfile);

module.exports = router;