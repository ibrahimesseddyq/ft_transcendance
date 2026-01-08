const express =  require('express');
const userController = require('../controllers/userController');
const router =  express.Router();

router.get('/',userController.listUsers.bind(userController))
    .get('/:id', userController.getUserById.bind(userController))
    .post('/',userController.createUser.bind(userController))
    .delete('/:id',userController.deleteUser.bind(userController))
    .patch('/:id',userController.updateUser.bind(userController));

module.exports = router;