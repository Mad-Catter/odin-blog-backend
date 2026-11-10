const { body, matchedData, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const getMultiplePosts = async (req, res) => {
	const start = req.params.page || 0;
	const posts = await prisma.post.findMany({
		skip: Number(start) * 10,
		take: 10,
	});
	if (posts) {
		return res.status(200).json(posts);
	} else {
		return res.status(404);
	}
};

const getPost = async (req, res) => {
	const post = await prisma.post.findUnique({
		where: { id: req.params.postId },
	});
	if (post) {
		return res.status(200).json(post);
	} else {
		return res.status(404);
	}
};

const createPostValidation = [
	body('title').trim().isLength({ min: 1 }).withMessage('Invalid title length.'),
	body('content').trim().isLength({ min: 1 }).withMessage('Invalid content length.'),
	body('published').isBoolean().toBoolean(true).optional().withMessage('Published status must be a boolean'),
];
const updatePostValidation = [
	body('title').trim().isLength({ min: 1 }).optional().withMessage('Invalid title length.'),
	body('content').trim().isLength({ min: 1 }).optional().withMessage('Invalid content length.'),
	body('published').isBoolean().toBoolean(true).optional().withMessage('Published status must be a boolean'),
];

const createPost = [
	createPostValidation,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ message: 'Failed to create post', errors });
		}
		const { title, content, published } = matchedData(req);
		const post = await prisma.post.create({
			data: {
				title,
				content,
				published,
				authorId: req.user.id,
			},
		});
		res.status(200).json(post);
	},
];

const updatePost = [
	updatePostValidation,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ message: 'Failed to update post', errors });
		}
		const { title, content, published } = matchedData(req);
		const post = await prisma.post.update({
			where: { id: Number(req.params.postId) },
			data: {
				title,
				content,
				published,
				lastUpdate: new Date(),
			},
		});
		res.status(200).json(post);
	},
];

const deletePost = async (req, res) => {
	try {
		await prisma.post.delete({
			where: { id: Number(req.params.postId) },
		});
		res.status(204).end();
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports = {
	getMultiplePosts,
	getPost,
	createPost,
	updatePost,
	deletePost,
};
