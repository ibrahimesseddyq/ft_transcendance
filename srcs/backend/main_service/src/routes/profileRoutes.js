const profileController = require('../controllers/profileController');
const express =  require('express');
const router = express.Router();
const upload =  require('../config/multer');


router.get('/:id', profileController.getProfile)
    .post('/',upload.single("resume"),profileController.createProfile)
    .patch('/:id',upload.single("resume"),profileController.updateProfile);

module.exports = router;