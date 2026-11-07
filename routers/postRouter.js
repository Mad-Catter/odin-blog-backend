const { Router } = require('express');
const postRouter = Router();
const postController = require('../controllers/postController');
const commentRouter = require('./commentRouter');

// Authentication middleware needs to be added

postRouter.get('/', postController.getAllPosts);
postRouter.get('/:postId', postController.getPost);
postRouter.post('/', postController.createPost);
postRouter.patch('/:postId', postController.updatePost);
postRouter.delete('/:postId', postController.deletePost);
postRouter.use('/:postId/comments', commentRouter);

module.exports = postRouter;
