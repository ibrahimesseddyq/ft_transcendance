const profileController = require('../controllers/profileController');
const express =  require('express');
const router = express.Router();
const {uploadProfile} =  require('../config/multer');


router.get('/:id', profileController.getProfile)
    .post('/',uploadProfile.fields([
        {name : "avatar" , maxCount: 1},
        {name : "resume", maxCount: 1}
    ]),profileController.createProfile)
    .patch('/:id',uploadProfile.fields([
        {name : "avatar" , maxCount: 1},
        {name : "resume", maxCount: 1},
    ]),profileController.updateProfile);

module.exports = router;