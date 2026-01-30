const express =  require('express');
const upload = require('../config/multer')
const userController = require('../controllers/userController');
const ValidateRequest = require('../middleware/ValidateRequest');
const {
  createUserSchema,
  updateUserSchema
} = require('../validators/userValidator');
const router =  express.Router();

router.get('/',userController.listUsers)
  .get('/:id', userController.getUserById)
  .post('/',ValidateRequest(createUserSchema),userController.createUser)
  .delete('/:id',userController.deleteUser)
  .patch('/:id', ValidateRequest(updateUserSchema),userController.updateUser)
  .post('/avatar',upload.single('avatar'),userController.uploadAvatar)
  .get('/avatar/:id',userController.getAvatar)
  .delete('/avatar/:id',userController.deleteAvatar)

module.exports = router;