const express =  require('express');
const userController = require('../controllers/userController');
const router =  express.Router();

router.get('/',userController.listUsers);
router.get('/:id', userController.getUserById);
router.post('/',userController.createUser);
router.delete('/:id',userController.deleteUser);
router.patch('/:id',userController.udateUser);

module.exports = router;