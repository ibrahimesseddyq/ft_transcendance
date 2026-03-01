import express from 'express';
import {upload} from '../config/multer.js';
import * as userController from '../controllers/userController.js';
import ValidateRequest from '../middleware/ValidateRequest.js';
import {
  createUserSchema,
  updateUserSchema
} from '../validators/userValidator.js';

const router =  express.Router();

router.get('/',
            // verifyToken,
            userController.listUsers)
  .get('/:id', 
            // verifyToken,
            userController.getUserById)
  .post('/',
            // verifyToken,
            ValidateRequest(createUserSchema),userController.createUser)
  .delete('/:id',
            // verifyToken,
            userController.deleteUser)
  .patch('/:id', 
            // verifyToken,
            ValidateRequest(updateUserSchema),userController.updateUser)
  .post('/avatar/:id',
            // verifyToken,
            upload.single('avatar'),userController.uploadAvatar)
  .get('/avatar/:id',
              // verifyToken,
              userController.getAvatar)
  .delete('/avatar/:id',
              // verifyToken,

              userController.deleteAvatar)
  .get('/me',
            // verifyToken,
            userController.checkAuth);
export default router;