const { Router } = require('express');
const postController = require('../controllers/postController');
const commentRouter = require('./commentRouter');
const { requireAuthor } = require('../controllers/helpers');

const postRouter = Router();

// Currently requireAuthor only checks if the user is a verfied author, not the same author.
// This works if I am imagining this blog being run by a company or something where each verfied author is a trusted employee who is allowed to CRUD their co-workers creations.
// But I will need to change this if I intend for random users to be considered verfied authors.

postRouter.get('/', postController.getMultiplePosts);
postRouter.get('/:postId', postController.getPost);
postRouter.post('/', requireAuthor, postController.createPost);
postRouter.patch('/:postId', requireAuthor, postController.updatePost);
postRouter.delete('/:postId', requireAuthor, postController.deletePost);
postRouter.use('/:postId/comments', commentRouter);

module.exports = postRouter;
