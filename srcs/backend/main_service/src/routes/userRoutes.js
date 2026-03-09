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
  .get('/:id/jobs',userController.getUserJobs)
  .get('/:id/applications', userController.getUserApplications)
  .get('/avatar/:id',userController.getAvatar)
  .get('/',userController.listUsers)

  .post('/',ValidateRequest(createUserSchema),userController.createUser)
  .post('/avatar/:id',upload.single('avatar'),userController.uploadAvatar)
  .patch('/:id', ValidateRequest(updateUserSchema),userController.updateUser)
  
  .delete('/:id',userController.deleteUser)
  .delete('/avatar/:id',userController.deleteAvatar)

  
export default router;