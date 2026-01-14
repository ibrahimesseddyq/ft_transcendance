const express =  require('express');
const userController = require('../controllers/userController');
const ValidateRequest = require('../middleware/ValidateRequest');
const {
  createUserSchema,
  updateUserSchema
} = require('../validators/userValidator');


const router =  express.Router();

router.get('/',userController.listUsers.bind(userController))
    .get('/:id', userController.getUserById.bind(userController))
    .post('/',ValidateRequest(createUserSchema),userController.createUser.bind(userController))
    .delete('/:id',userController.deleteUser.bind(userController))
    .patch('/:id', ValidateRequest(updateUserSchema),userController.updateUser.bind(userController));

module.exports = router;