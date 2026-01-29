const express =  require('express');
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
    .patch('/:id', ValidateRequest(updateUserSchema),userController.updateUser);

module.exports = router;