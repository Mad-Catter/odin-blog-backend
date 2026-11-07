const { Router } = require('express');
const userRouter = Router();
const userController = require('../controllers/userController');

userRouter.get('/:id', userController.getUser);
userRouter.post('/', userController.createUser);

module.exports = userRouter;
