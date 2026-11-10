const prisma = require('../lib/prisma');
const { body, matchedData, validationResult } = require('express-validator');

const getManyComments = async (req, res) => {
	const start = req.query.comment_count || 0;
	const comments = await prisma.comment.findMany({
		where: { postId: Number(req.params.postId) },
		skip: start * 20,
		take: 20,
	});
	res.status(200).json({ comments });
};

const getComment = async (req, res) => {
	const comment = await prisma.comment.findUnique({
		where: {
			id: Number(req.params.commentId),
			postId: Number(req.params.postId),
		},
	});
	res.status(200).json(comment);
};
const commentValidation = [body('content').trim().isLength({ min: 1 }).withMessage('Invalid comment content length')];
// Should there be handling for if a user tries to create a comment on a deleted post or is that out of scope?
const createComment = [
	commentValidation,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ message: 'Failed to create comment', errors });
		}
		const { content } = matchedData(req);
		const comment = await prisma.comment.create({
			data: {
				content,
				authorId: Number(req.user.id),
				postId: Number(req.params.postId),
			},
		});
		return res.status(200).json(comment);
	},
];

// There does not need to be an optional validation chain for comments as there is only one thing to edit which is the content.
// So every edit will be guaranteed to have content in it.
const updateComment = [
	commentValidation,
	async (req, res) => {
		const comment = await prisma.comment.findUnique({
			where: { id: Number(req.params.commentId) },
		});
		if (comment.id !== req.user.id) {
			return res.status(403).json({ message: 'You are not allowed to update this comment' });
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ message: 'Failed to update comment', errors });
		}
		const { content } = matchedData(req);
		const updatedComment = await prisma.comment.update({
			where: { id: Number(req.params.commentId) },
			data: {
				content,
				lastUpdate: new Date(),
			},
		});
		return res.status(200).json(updatedComment);
	},
];
const deleteComment = async (req, res) => {
	const comment = await prisma.comment.findUnique({
		where: { id: Number(req.params.commentId) },
	});
	if (comment.authorId !== req.user.id || !req.user.postAuthor) {
		return res.status(403).json({ message: 'You are not allowed to delete this comment' });
	}
	await prisma.comment.delete({
		where: { id: Number(req.params.commentId) },
	});
	return res.status(204).end();
};

module.exports = {
	getManyComments,
	getComment,
	createComment,
	updateComment,
	deleteComment,
};
