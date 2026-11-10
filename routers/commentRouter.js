const { Router } = require('express');
const commentController = require('../controllers/commentController');
const { requireUser } = require('../controllers/helpers');

const commentRouter = Router({ mergeParams: true });

commentRouter.get('/', commentController.getManyComments);
commentRouter.get('/:commentId', commentController.getComment);
commentRouter.post('/', requireUser, commentController.createComment);
commentRouter.patch('/:commentId', requireUser, commentController.updateComment);
commentRouter.delete('/:commentId', requireUser, commentController.deleteComment);

module.exports = commentRouter;
