import express from 'express';
import {upload} from '../config/multer.js';
import * as userController from '../controllers/userController.js';
import ValidateRequest from '../middleware/ValidateRequest.js';
import {
  createUserSchema,
  updateUserSchema
} from '../validators/userValidator.js';

const router =  express.Router();

router
  .get('/me',userController.checkAuth)
  .get('/:id', userController.getUserById)
  .get('/',userController.listUsers)
  .post('/',ValidateRequest(createUserSchema),userController.createUser)
  .delete('/:id',userController.deleteUser)
  .patch('/:id', ValidateRequest(updateUserSchema),userController.updateUser)
  .post('/avatar/:id',upload.single('avatar'),userController.uploadAvatar)
  .get('/avatar/:id',userController.getAvatar)
  .delete('/avatar/:id',userController.deleteAvatar)
  
export default router;